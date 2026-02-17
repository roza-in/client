'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

interface UseAgoraCallProps {
    appId: string;
    token: string;
    channelName: string;
    uid: string | number;
    containerId: string;
    remoteContainerId: string;
    microphoneId?: string;
    cameraId?: string;
}

export function useAgoraCall({
    appId,
    token,
    channelName,
    uid,
    containerId,
    remoteContainerId,
    microphoneId,
    cameraId
}: UseAgoraCallProps) {
    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
    const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
    const joiningRef = useRef(false);

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        if (!appId || !token || !channelName || !uid) {
            console.warn('[useAgoraCall] Missing required params:', { appId, token: !!token, channelName, uid });
            return;
        }

        let isMounted = true;
        let client: IAgoraRTCClient | null = null;

        async function initAgora() {
            if (joiningRef.current) return;

            try {
                joiningRef.current = true;

                // Dynamic import to avoid SSR issues
                const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

                if (!isMounted) return;

                // Create client
                client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                clientRef.current = client;

                // Handle Events
                client.on('user-published', async (user, mediaType) => {
                    if (!isMounted) return;
                    await client!.subscribe(user, mediaType);
                    if (mediaType === 'video') {
                        const remoteVideoTrack = user.videoTrack;
                        const remoteContainer = document.getElementById(remoteContainerId);
                        if (remoteContainer && remoteVideoTrack) {
                            remoteContainer.innerHTML = ''; // Clear previous
                            remoteVideoTrack.play(remoteContainer);
                        }
                    }
                    if (mediaType === 'audio') {
                        user.audioTrack?.play();
                    }
                });

                client.on('user-unpublished', (user, mediaType) => {
                    if (mediaType === 'video') {
                        const remoteContainer = document.getElementById(remoteContainerId);
                        if (remoteContainer) remoteContainer.innerHTML = '';
                    }
                });

                client.on('connection-state-change', (curState, revState) => {
                    if (curState === 'CONNECTED') setIsConnected(true);
                    if (curState === 'DISCONNECTED' || curState === 'DISCONNECTING') setIsConnected(false);
                });

                // Join
                if (!isMounted) return;

                await client.join(appId, channelName, token, uid);

                if (!isMounted) {
                    await client.leave();
                    return;
                }

                // Publish Local
                const audioConfig = microphoneId ? { microphoneId } : undefined;
                const videoConfig = cameraId ? { cameraId } : undefined;

                let audioTrack, videoTrack;
                try {
                    [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
                        audioConfig,
                        videoConfig
                    );
                } catch (mediaError: any) {
                    console.error('[useAgoraCall] Failed to create media tracks:', mediaError);

                    if (mediaError.name === 'NotReadableError' || mediaError.code === 'NOT_READABLE') {
                        throw new Error('Could not access microphone/camera. Please check if another app is using them.');
                    }
                    if (mediaError.name === 'NotAllowedError' || mediaError.code === 'PERMISSION_DENIED') {
                        throw new Error('Microphone/Camera permission denied. Please allow access.');
                    }
                    throw mediaError;
                }

                if (!isMounted) {
                    audioTrack.close();
                    videoTrack.close();
                    await client.leave();
                    return;
                }

                localAudioTrackRef.current = audioTrack;
                localVideoTrackRef.current = videoTrack;

                const localContainer = document.getElementById(containerId);
                if (localContainer) {
                    localContainer.innerHTML = '';
                    videoTrack.play(localContainer);
                }

                await client.publish([audioTrack, videoTrack]);
                if (isMounted) setIsConnected(true);

            } catch (err: any) {
                // Handle specific errors
                if (err.code === 'UID_CONFLICT') {
                    // React Strict Mode double join, ignore
                    return;
                }

                if (err.code === 'OPERATION_ABORTED' || err.message?.includes('cancel token canceled')) {
                    // Aborted join
                    return;
                }

                if (err.code === 'NETWORK_TIMEOUT' || err.message?.includes('A_ROUND_WS_FAILED')) {
                    if (isMounted) setError('Network timeout. Please check your internet connection or firewall.');
                    return;
                }

                if (isMounted) setError(err.message || 'Failed to initialize Agora');
            } finally {
                joiningRef.current = false;
            }
        }

        if (!joiningRef.current) {
            initAgora();
        }

        return () => {
            isMounted = false;
            joiningRef.current = false;

            // cleanup tracks
            localAudioTrackRef.current?.close();
            localVideoTrackRef.current?.close();
            localAudioTrackRef.current = null;
            localVideoTrackRef.current = null;

            // leave channel
            if (clientRef.current) {
                const clientToLeave = clientRef.current;
                clientRef.current = null;
                // Leave is async, we can't await it here but we can trigger it
                clientToLeave.leave().catch(e => console.error('[useAgoraCall] Leave failed', e));
            }
        };
    }, [appId, token, channelName, uid, containerId, remoteContainerId]);

    const toggleMic = useCallback(async () => {
        if (localAudioTrackRef.current) {
            const enabled = localAudioTrackRef.current.isPlaying; // check specific state if needed
            // Actually 'enabled' property or setMuted method
            // Agora SDK: setMuted(boolean)
            const newMuted = !isMuted;
            await localAudioTrackRef.current.setMuted(newMuted);
            setIsMuted(newMuted);
        }
    }, [isMuted]);

    const toggleCamera = useCallback(async () => {
        if (localVideoTrackRef.current) {
            const newVideoOff = !isVideoOff;
            await localVideoTrackRef.current.setMuted(newVideoOff);
            setIsVideoOff(newVideoOff);
        }
    }, [isVideoOff]);

    return {
        isConnected,
        error,
        isMuted,
        isVideoOff,
        toggleMic,
        toggleCamera
    };
}
