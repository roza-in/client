'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Wifi, ArrowRight, Volume2, Settings, Users, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Loading } from '@/components/ui/loading';
import { Error as ErrorUI } from '@/components/ui/error';

interface PreJoinLobbyProps {
    appointmentId: string;
    patientName?: string;
    doctorName?: string;
    scheduledAt?: string;
    consultationType?: string;
    onJoin: (audioId: string, videoId: string) => void;
}

export function PreJoinLobby({
    appointmentId,
    patientName = 'Patient',
    doctorName = 'Doctor',
    scheduledAt,
    consultationType = 'General Consultation',
    onJoin
}: PreJoinLobbyProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    // Device Selection State
    const [devices, setDevices] = useState<{ audio: MediaDeviceInfo[], video: MediaDeviceInfo[] }>({ audio: [], video: [] });
    const [selectedAudioId, setSelectedAudioId] = useState<string>('');
    const [selectedVideoId, setSelectedVideoId] = useState<string>('');
    const [showSettings, setShowSettings] = useState(false);

    // 1. Enumerate Devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devs = await navigator.mediaDevices.enumerateDevices();
                const audio = devs.filter(d => d.kind === 'audioinput');
                const video = devs.filter(d => d.kind === 'videoinput');
                setDevices({ audio, video });
            } catch (e) {
                console.error("Error enumerating devices:", e);
            }
        };
        getDevices();
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    }, []);

    // 2. Initialize Stream (runs on mount and when selection changes)
    const initializeStream = async () => {
        setIsChecking(true);
        try {
            // If we have selected IDs, attempt to use them.
            const constraints: MediaStreamConstraints = {
                audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
                video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            setStream(mediaStream);
            setHasPermission(true);
            setIsChecking(false);

            // Update selected IDs to match what we actually got
            if (!selectedAudioId) {
                const track = mediaStream.getAudioTracks()[0];
                if (track) setSelectedAudioId(track.getSettings().deviceId || '');
            }
            if (!selectedVideoId) {
                const track = mediaStream.getVideoTracks()[0];
                if (track) setSelectedVideoId(track.getSettings().deviceId || '');
            }

            // Audio Level Setup
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    const audioContext = new AudioContextClass();
                    const analyser = audioContext.createAnalyser();
                    const microphone = audioContext.createMediaStreamSource(mediaStream);
                    microphone.connect(analyser);
                    analyser.fftSize = 256;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const updateAudioLevel = () => {
                        if (!mediaStream.active) return; // Stop if stream is inactive
                        analyser.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
                        setAudioLevel(average * 2);
                        requestAnimationFrame(updateAudioLevel);
                    };
                    updateAudioLevel();
                }
            } catch (e) {
                console.warn("Audio context warning:", e);
            }
        } catch (err: any) {
            console.error("Error accessing devices:", err);
            setIsChecking(false);

            // Handle specific errors
            if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                console.warn("Camera/Mic is busy or not readable.");
                setHasPermission(false);
            } else {
                setHasPermission(false);
            }
        }
    };

    useEffect(() => {
        initializeStream();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAudioId, selectedVideoId]);

    // 3. Attach Stream to Video Element
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicEnabled(audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

    const testSpeaker = () => {
        if (isPlayingTestSound) return;
        try {
            setIsPlayingTestSound(true);
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);

            setTimeout(() => {
                setIsPlayingTestSound(false);
                audioContext.close();
            }, 500);
        } catch (e) {
            setIsPlayingTestSound(false);
        }
    };

    if (isChecking) {
        return (
            <Loading
                title="Checking Devices"
                description="Verifying camera and microphone..."
                fullscreen={false}
            />
        );
    }

    if (hasPermission === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-900">
                <Card className="max-w-md w-full border-0 shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <VideoOff className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Camera Access Needed</h2>
                            <p className="text-muted-foreground">
                                To join the consultation, we need access to your camera and microphone.
                            </p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg text-sm text-left text-muted-foreground space-y-2">
                            <p className="font-semibold text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" /> If blocked:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-1">
                                <li>Click the <strong>lock icon</strong> in your browser address bar.</li>
                                <li>Toggle <strong>Camera</strong> and <strong>Microphone</strong> to "Allow".</li>
                                <li>Refresh the page.</li>
                            </ul>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                size="lg"
                                onClick={initializeStream}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Try Allow Access Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-4 lg:p-8 gap-8 lg:gap-16 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => window.history.back()}
            >
                <span className="sr-only">Close</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-slate-500"
                >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
            </Button>

            {/* Left: Video Preview */}
            <div className="w-full max-w-2xl space-y-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10 bg-black group">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className={cn("w-full h-full object-cover transform scale-x-[-1]", !videoEnabled && "hidden")}
                    />

                    {!videoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
                                <VideoOff className="w-10 h-10 text-slate-500" />
                            </div>
                        </div>
                    )}

                    {/* Left Badges: Secure Connection */}
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            Secure
                        </div>
                    </div>

                    {/* Right Badges: Connection Status */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-emerald-400">
                            <Wifi className="w-3.5 h-3.5" />
                            HD Ready
                        </div>
                    </div>

                    {/* Center Badge: Participants (Fake for Lobby) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-sm">
                            <Users className="w-4 h-4" />
                            {patientName} + {doctorName}
                        </div>
                    </div>

                    {/* Audio Waveform */}
                    {micEnabled && (
                        <div className="absolute bottom-6 left-6 flex items-end gap-1 h-8">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-emerald-500 rounded-full transition-all duration-75 shadow-lg"
                                    style={{
                                        height: `${Math.max(20, Math.min(100, audioLevel * (1 + i * 0.5)))}%`, // Random-ish variation based on level
                                        opacity: audioLevel > 5 ? 1 : 0.3
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Settings UI Overlay (When showSettings is true) */}
                    {showSettings && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-8 animate-in fade-in duration-200">
                            <div className="w-full max-w-sm space-y-6">
                                <h3 className="text-white font-bold text-lg text-center">Audio & Video Settings</h3>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Microphone</label>
                                    <select
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={selectedAudioId}
                                        onChange={(e) => setSelectedAudioId(e.target.value)}
                                    >
                                        {devices.audio.map(d => (
                                            <option key={d.deviceId} value={d.deviceId} className="bg-slate-900 text-white">
                                                {d.label || `Microphone ${d.deviceId.slice(0, 5)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Camera</label>
                                    <select
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={selectedVideoId}
                                        onChange={(e) => setSelectedVideoId(e.target.value)}
                                    >
                                        {devices.video.map(d => (
                                            <option key={d.deviceId} value={d.deviceId} className="bg-slate-900 text-white">
                                                {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => setShowSettings(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className={cn("absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl transition-opacity duration-300", showSettings ? "opacity-0 pointer-events-none" : "opacity-100")}>
                        <Button
                            size="icon"
                            variant={micEnabled ? "secondary" : "destructive"}
                            className={cn("w-12 h-12 rounded-full shadow-lg transition-all", micEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "")}
                            onClick={toggleMic}
                        >
                            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </Button>
                        <Button
                            size="icon"
                            variant={videoEnabled ? "secondary" : "destructive"}
                            className={cn("w-12 h-12 rounded-full shadow-lg transition-all", videoEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "")}
                            onClick={toggleVideo}
                        >
                            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </Button>
                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className={cn("w-12 h-12 rounded-full transition-all hover:bg-white/20 text-white")}
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-muted-foreground">
                        Check your hair and microphone
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={testSpeaker}
                        disabled={isPlayingTestSound}
                        className="gap-2 h-8 text-xs font-medium rounded-full"
                    >
                        <Volume2 className={cn("w-3.5 h-3.5", isPlayingTestSound ? "text-emerald-500 animate-pulse" : "text-slate-500")} />
                        {isPlayingTestSound ? "Playing Sound..." : "Test Speakers"}
                    </Button>
                </div>
            </div>

            {/* Right: Join Details */}
            <div className="w-full max-w-md space-y-8 text-center lg:text-left">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        Ready to join?
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        You are about to enter the secure consultation room with <span className="font-semibold text-foreground">{doctorName}</span>.
                    </p>
                </div>

                <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden">
                    <CardContent className="p-6 flex flex-col gap-6">
                        {/* Session Info Header */}
                        <div className="flex items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
                            <div className="shrink-0 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/5">
                                <Image
                                    src={'/logo/rozx-light-logo.svg'}
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div className="text-left space-y-1">
                                <p className="font-semibold text-foreground">{siteConfig.name} Secure Meet</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                                        ID: {appointmentId.slice(0, 8)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Verification Details */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consultation With</label>
                                <p className="text-lg font-medium text-foreground">{doctorName}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {scheduledAt && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appoinment Date</label>
                                        <p className="text-sm font-medium">{scheduledAt}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Button
                        size="lg"
                        onClick={() => onJoin(selectedAudioId, selectedVideoId)}
                        className="w-full h-14 text-lg font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                        Join Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        By joining, you agree to our Terms of Service around secure telemedicine practices.
                    </p>
                </div>
            </div>
        </div>
    );
}
