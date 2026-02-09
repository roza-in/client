/**
 * Video Components - Video Consultation Room
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    Settings,
    MessageSquare,
    Users,
    Maximize,
    Minimize,
    MoreVertical,
    AlertCircle,
} from 'lucide-react';
import { useConsultation, useConsultationStatus } from '@/features/video';
import { LoadingSpinner } from '@/components/shared';

interface VideoRoomProps {
    appointmentId: string;
    doctorName: string;
    patientName: string;
    isDoctor?: boolean;
    onEnd?: () => void;
    className?: string;
}

export function VideoRoom({
    appointmentId,
    doctorName,
    patientName,
    isDoctor = false,
    onEnd,
    className,
}: VideoRoomProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [duration, setDuration] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const {
        room,
        isJoining,
        isConnected,
        isError,
        error,
        join,
        leave,
        reportIssue,
    } = useConsultation(appointmentId);

    const { data: status } = useConsultationStatus(appointmentId);

    // Timer
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isConnected]);

    // Format duration
    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle end call
    const handleEndCall = async () => {
        await leave();
        onEnd?.();
    };

    if (!isConnected && !isJoining) {
        return (
            <div className={cn('rounded-xl border bg-background p-8 text-center', className)}>
                <div className="flex h-40 w-40 mx-auto items-center justify-center rounded-full bg-primary/10">
                    <Video className="h-16 w-16 text-primary" />
                </div>
                <h2 className="mt-6 text-xl font-semibold">Video Consultation</h2>
                <p className="mt-2 text-muted-foreground">
                    {isDoctor
                        ? `Your patient ${patientName} is waiting`
                        : `Dr. ${doctorName} is ready for your consultation`}
                </p>

                {status && (
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                        <span className={cn(
                            'flex items-center gap-1',
                            status.participants.doctorJoined ? 'text-green-600' : 'text-muted-foreground'
                        )}>
                            <span className={cn(
                                'h-2 w-2 rounded-full',
                                status.participants.doctorJoined ? 'bg-green-500' : 'bg-gray-300'
                            )} />
                            Doctor {status.participants.doctorJoined ? 'online' : 'offline'}
                        </span>
                        <span className={cn(
                            'flex items-center gap-1',
                            status.participants.patientJoined ? 'text-green-600' : 'text-muted-foreground'
                        )}>
                            <span className={cn(
                                'h-2 w-2 rounded-full',
                                status.participants.patientJoined ? 'bg-green-500' : 'bg-gray-300'
                            )} />
                            Patient {status.participants.patientJoined ? 'online' : 'offline'}
                        </span>
                    </div>
                )}

                {isError && (
                    <p className="mt-4 text-sm text-destructive flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {error || 'Failed to connect'}
                    </p>
                )}

                <button
                    onClick={join}
                    disabled={isJoining}
                    className={cn(
                        'mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground',
                        'hover:bg-primary/90 disabled:opacity-50'
                    )}
                >
                    {isJoining ? (
                        <>
                            <LoadingSpinner size="sm" />
                            Connecting...
                        </>
                    ) : (
                        <>
                            <Video className="h-5 w-5" />
                            Join Consultation
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex flex-col overflow-hidden rounded-xl bg-gray-900',
                isFullscreen ? 'fixed inset-0 z-50' : 'h-[600px]',
                className
            )}
        >
            {/* Main Video (Remote) */}
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                <div className="text-center text-white">
                    <div className="h-24 w-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                        {isDoctor ? patientName.charAt(0) : doctorName.charAt(0)}
                    </div>
                    <p className="mt-4 font-medium">
                        {isDoctor ? patientName : `Dr. ${doctorName}`}
                    </p>
                    <p className="text-sm text-gray-400">Connecting video...</p>
                </div>
            </div>

            {/* Self Video (PiP) */}
            <div className="absolute top-4 right-4 h-32 w-44 overflow-hidden rounded-lg bg-gray-800 border border-gray-700">
                <div className="flex h-full items-center justify-center text-gray-500">
                    {isVideoOff ? (
                        <VideoOff className="h-8 w-8" />
                    ) : (
                        <span className="text-sm">Your camera</span>
                    )}
                </div>
            </div>

            {/* Top Bar */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    {formatDuration(duration)}
                </span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-linear-to-t from-black/80 to-transparent p-6">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                        isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                    )}
                >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                        isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                    )}
                >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                    <Phone className="h-6 w-6 rotate-135" />
                </button>

                <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                    <MessageSquare className="h-5 w-5" />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>

                <button
                    onClick={() => reportIssue('connection', 'User reported connection issue')}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                    <AlertCircle className="h-5 w-5" />
                </button>
            </div>

            {/* Chat Panel */}
            {showChat && (
                <div className="absolute top-16 right-4 bottom-24 w-80 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                    <div className="flex items-center justify-between border-b p-3">
                        <h3 className="font-medium">Chat</h3>
                        <button onClick={() => setShowChat(false)}>×</button>
                    </div>
                    <div className="p-3 text-center text-sm text-muted-foreground">
                        Chat coming soon
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoRoom;
