'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationsApi } from '@/features/consultations/api/consultations';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useZegoCall } from '@/features/video/hooks/use-zego-call';
import { useAgoraCall } from '@/features/video/hooks/use-agora-call';

interface VideoPanelProps {
    consultationId: string;
    role: 'doctor' | 'patient';
    onEnd?: () => void;
    preferredMicrophoneId?: string;
    preferredCameraId?: string;
}

// Unified interface for video sessions
interface VideoSessionProps {
    appId: string | number;
    token: string;
    roomId: string;
    userId: string;
    userName: string;
    onEnd?: () => void;
    preferredMicrophoneId?: string;
    preferredCameraId?: string;
}

interface VideoLayoutProps {
    isConnected: boolean;
    error: string | null;
    isMuted: boolean;
    isVideoOff: boolean;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onEnd?: () => void;
}

export function VideoPanel({ consultationId, role, onEnd, preferredMicrophoneId, preferredCameraId }: VideoPanelProps) {
    const { user } = useAuth();

    // 1. Fetch Video Token
    const { data: tokenData, isLoading } = useQuery({
        queryKey: ['video-token', consultationId],
        queryFn: () => consultationsApi.getVideoToken(consultationId),
        enabled: !!consultationId,
    });

    if (isLoading) {
        return (
            <Card className="w-full h-full min-h-[400px] bg-slate-900 flex items-center justify-center">
                <div className="text-slate-400 animate-pulse">Initializing Secure Connection...</div>
            </Card>
        );
    }

    if (!tokenData || !user) {
        return (
            <Card className="w-full h-full min-h-[400px] bg-slate-900 flex items-center justify-center">
                <div className="text-red-400">
                    {!user ? 'Authenticating...' : 'Failed to load video configuration'}
                </div>
            </Card>
        );
    }

    const commonProps = {
        appId: tokenData.appId,
        token: tokenData.token,
        roomId: tokenData.roomId,
        userId: user?.id || '',
        userName: user?.name || 'User',
        onEnd,
        preferredMicrophoneId,
        preferredCameraId
    };

    // Dynamic Switch
    if (tokenData.provider === 'agora') {
        return <AgoraSession {...commonProps} />;
    }

    // Default to Zego
    return <ZegoSession {...commonProps} />;
}

function ZegoSession({ appId, token, roomId, userId, userName, onEnd }: VideoSessionProps) {
    const {
        isConnected, error, isMuted, isVideoOff, toggleMic, toggleCamera
    } = useZegoCall({
        appId: Number(appId),
        token,
        roomId,
        userId,
        userName,
        containerId: 'local-video',
        remoteContainerId: 'remote-video'
    });

    return (
        <VideoLayout
            isConnected={isConnected}
            error={error}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onEnd={onEnd}
        />
    );
}

function AgoraSession({ appId, token, roomId, userId, userName, onEnd, preferredMicrophoneId, preferredCameraId }: VideoSessionProps) {
    const {
        isConnected, error, isMuted, isVideoOff, toggleMic, toggleCamera
    } = useAgoraCall({
        appId: String(appId),
        token,
        channelName: roomId,
        uid: userId, // Agora Web SDK 4.x supports string UIDs.
        containerId: 'local-video',
        remoteContainerId: 'remote-video',
        microphoneId: preferredMicrophoneId,
        cameraId: preferredCameraId
    });

    return (
        <VideoLayout
            isConnected={isConnected}
            error={error}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onEnd={onEnd}
        />
    );
}

function VideoLayout({
    isConnected, error, isMuted, isVideoOff, onToggleMic, onToggleCamera, onEnd
}: VideoLayoutProps) {
    return (
        <Card className="relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden border-0 shadow-2xl rounded-2xl group ring-1 ring-white/10">
            {/* Remote Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                {!isConnected ? (
                    <div className="text-slate-400 flex flex-col items-center gap-6 z-10 p-8 max-w-sm text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 animate-[ping_3s_ease-in-out_infinite] absolute inset-0 opacity-50" />
                            <div className="w-24 h-24 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                                <VideoOff className="w-8 h-8 text-slate-500" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-slate-100">Waiting for others to join...</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                You are in the secure room. The video will start automatically when they arrive.
                            </p>
                            {error && (
                                <p className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
                                    Status: {error}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div id="remote-video" className="w-full h-full bg-black" />
                )}

                {/* Local Preview (Draggable PiP) */}
                <div className="absolute top-6 right-6 w-48 aspect-video bg-slate-800 rounded-xl border border-white/10 overflow-hidden shadow-2xl z-20 group-hover:scale-105 transition-transform duration-300 ring-1 ring-black/20">
                    <div id="local-video" className={cn("w-full h-full bg-black object-cover", isVideoOff && "hidden")} />
                    {isVideoOff && (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/90 backdrop-blur-sm gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                <VideoOff className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Camera Off</span>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/80">
                        You
                    </div>
                </div>
            </div>

            {/* Floating Controls Bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="flex items-center gap-2 p-2 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-black/20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-full w-12 h-12 transition-all duration-200",
                            isMuted
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                                : "text-white hover:bg-white/10 border border-transparent"
                        )}
                        onClick={onToggleMic}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-full w-12 h-12 transition-all duration-200",
                            isVideoOff
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                                : "text-white hover:bg-white/10 border border-transparent"
                        )}
                        onClick={onToggleCamera}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    <div className="w-px h-8 bg-white/10 mx-2" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-12 h-12 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className="rounded-full w-14 h-12 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 ml-2 transition-all"
                        onClick={onEnd}
                    >
                        <PhoneOff className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Minimal Status Overlay */}
            <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-500",
                    isConnected
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                )}>
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", isConnected ? "bg-emerald-500" : "bg-yellow-500")} />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        {isConnected ? "Encrypted • HD" : "Connecting..."}
                    </span>
                </div>
                {isConnected && (
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-xs text-slate-400 font-mono">
                        00:00
                    </div>
                )}
            </div>
        </Card>
    );
}
