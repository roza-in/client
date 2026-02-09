'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ZegoExpressEngine } from 'zego-express-engine-webrtc';

interface UseZegoCallProps {
    appId: number;
    token: string;
    roomId: string;
    userId: string;
    userName: string;
    containerId: string;
    remoteContainerId: string;
}

export function useZegoCall({
    appId,
    token,
    roomId,
    userId,
    userName,
    containerId,
    remoteContainerId
}: UseZegoCallProps) {
    const zegoRef = useRef<ZegoExpressEngine | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        if (!appId || !token || !roomId) return;

        let isMounted = true;
        let zg: ZegoExpressEngine | null = null;
        let localStream: MediaStream | null = null;

        async function initZego() {
            try {
                // Dynamically import ZegoEngine to avoid SSR 'document is not defined'
                const { ZegoExpressEngine } = await import('zego-express-engine-webrtc');

                // 1. Initialize Engine
                zg = new ZegoExpressEngine(appId, 'wss://webliveroom-api.zegocloud.com/ws');
                zegoRef.current = zg;

                // 2. Handle events
                zg.on('roomStateUpdate', (id, state, errorCode, extendedData) => {
                    if (state === 'CONNECTED') setIsConnected(true);
                    if (state === 'DISCONNECTED') setIsConnected(false);
                });

                zg.on('roomStreamUpdate', async (id, updateType, streamList) => {
                    if (updateType === 'ADD') {
                        const stream = streamList[0];
                        const remoteView = document.getElementById(remoteContainerId);
                        if (remoteView) {
                            const remoteStream = await zg!.startPlayingStream(stream.streamID);
                            const videoElement = document.createElement('video');
                            videoElement.id = 'remote-video-element';
                            videoElement.autoplay = true;
                            videoElement.playsInline = true;
                            videoElement.style.width = '100%';
                            videoElement.style.height = '100%';
                            videoElement.style.objectFit = 'cover';
                            videoElement.srcObject = remoteStream;
                            remoteView.innerHTML = '';
                            remoteView.appendChild(videoElement);
                        }
                    }
                });

                // 3. Login Room
                await zg.loginRoom(roomId, token, { userID: userId, userName }, { userUpdate: true });

                // 4. Create and Publish Local Stream
                // @ts-ignore
                localStream = await zg.createStream({ camera: { video: true, audio: true } });
                localStreamRef.current = localStream;

                const localView = document.getElementById(containerId);
                if (localView && localStream) {
                    const videoElement = document.createElement('video');
                    videoElement.id = 'local-video-element';
                    videoElement.autoplay = true;
                    videoElement.muted = true; // Mute local playback to avoid echo
                    videoElement.playsInline = true;
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                    videoElement.srcObject = localStream;
                    localView.innerHTML = '';
                    localView.appendChild(videoElement);
                }

                await zg.startPublishingStream(`${roomId}_${userId}`, localStream);
            } catch (err: any) {
                if (isMounted) setError(err.message || 'Failed to initialize Zego');
                console.error('Zego initialization failed:', err);
            }
        }

        initZego();

        return () => {
            isMounted = false;
            // Cleanup function
            if (localStream) {
                // Stop tracks
                localStream.getTracks().forEach(track => track.stop());

                if (zg) {
                    zg.destroyStream(localStream);
                }
            }
            if (zg) {
                zg.logoutRoom(roomId);
                zg.destroyEngine();
            }
            zegoRef.current = null;
            localStreamRef.current = null;
        };
    }, [appId, token, roomId, userId, userName, containerId, remoteContainerId]);

    const toggleMic = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
                // Also update Zego if method exists
                const zg = zegoRef.current as any;
                if (zg && typeof zg.mutePublishStreamAudio === 'function') {
                    zg.mutePublishStreamAudio(localStreamRef.current, !audioTrack.enabled);
                } else if (zg && typeof zg.muteMicrophone === 'function') {
                    zg.muteMicrophone(!audioTrack.enabled);
                }
            }
        }
    }, []);

    const toggleCamera = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
                // Also update Zego if method exists
                const zg = zegoRef.current as any;
                if (zg && typeof zg.mutePublishStreamVideo === 'function') {
                    zg.mutePublishStreamVideo(localStreamRef.current, !videoTrack.enabled);
                } else if (zg && typeof zg.enableCamera === 'function') {
                    zg.enableCamera(videoTrack.enabled);
                }
            }
        }
    }, []);

    return {
        isConnected,
        error,
        isMuted,
        isVideoOff,
        toggleMic,
        toggleCamera
    };
}
