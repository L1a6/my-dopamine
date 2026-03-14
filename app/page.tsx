"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, SkipBack, SkipForward, X, Plus, Music, Cake } from 'lucide-react';

const DotLottiePlayer = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { ssr: false }
);

interface Song {
  title: string;
  artist: string;
  duration: string;
  audioFile: string;
  image: string;
}

interface ModalMessage {
  title: string;
  message: string;
  image: string;
}

export default function BirthdayPage() {
  const [preloaderStage, setPreloaderStage] = useState<"loading" | "exiting" | "reveal" | "done">("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayRef = useRef(false);

  const parseDuration = (value: string) => {
    const [min, sec] = value.split(":").map(Number);
    if (!Number.isFinite(min) || !Number.isFinite(sec)) return 0;
    return min * 60 + sec;
  };

  const songs: Song[] = useMemo(() => [
    {
      title: "You",
      artist: "Fola",
      duration: "3:45",
      audioFile: "/you - FOLA.mp3",
      image: "/finepic1.jpg",
    },
    {
      title: "Blue",
      artist: "Ruger",
      duration: "3:58",
      audioFile: "/Blue - Ruger.mp3",
      image: "/finepic3.jpg",
    },
    {
      title: "Bambi",
      artist: "Josh Belter",
      duration: "4:12",
      audioFile: "/BAMBI - Josh Belter.mp3",
      image: "/finepic2.jpg",
    },
    {
      title: "Vanilla",
      artist: "Hyce",
      duration: "3:52",
      audioFile: "/Vanilla - Hyce.mp3",
      image: "/finepic4.jpg",
    },
    {
      title: "Asylum",
      artist: "Oliver the Boy",
      duration: "4:15",
      audioFile: "/Asylum - Olivetheboy.mp3",
      image: "/finepic5.jpg",
    }
  ], []);

  const modalMessages: ModalMessage[] = useMemo(() => [
    {
      title: "Happy Birthday, Love",
      message: "You are my greatest blessing. Every moment with you is a song I never want to end. You make my heart sing in ways I never thought possible. Here's to celebrating you today and every day.",
      image: "/finepic1.jpg",
    },
    {
      title: "Your Beauty Within",
      message: "It's not just your beauty that captivates me, it's your kindness, your strength, and the light you bring to my world. Thank you for being exactly who you are.",
      image: "/finepic3.jpg",
    },
    {
      title: "My Midnight Sky",
      message: "In the darkness, you are my light. In the chaos, you are my calm. In my heart, you are everything.",
      image: "/finepic2.jpg",
    },
    {
      title: "Sweet Moments",
      message: "Life is more beautiful with you in it. From the simple morning talks to the late-night conversations, every moment with you is pure vanilla, sweet and perfect.",
      image: "/finepic4.jpg",
    },
    {
      title: "Forever Safe",
      message: "With you, I've found my sanctuary. My asylum from all the noise. You are my home, my peace, and my forever. Happy 19th birthday to my everything.",
      image: "/finepic5.jpg",
    }
  ], []);

  const accentThemes = useMemo(
    () => [
      { primary: "#ff8db1", glow: "rgba(255, 141, 177, 0.68)", soft: "rgba(255, 141, 177, 0.24)", sheen: "rgba(255, 220, 231, 0.36)" },
      { primary: "#58b9ff", glow: "rgba(88, 185, 255, 0.7)", soft: "rgba(88, 185, 255, 0.24)", sheen: "rgba(213, 240, 255, 0.35)" },
      { primary: "#f0c96c", glow: "rgba(240, 201, 108, 0.68)", soft: "rgba(240, 201, 108, 0.24)", sheen: "rgba(255, 240, 201, 0.36)" },
      { primary: "#7be6bf", glow: "rgba(123, 230, 191, 0.68)", soft: "rgba(123, 230, 191, 0.24)", sheen: "rgba(216, 255, 243, 0.34)" },
      { primary: "#b8a3ff", glow: "rgba(184, 163, 255, 0.7)", soft: "rgba(184, 163, 255, 0.24)", sheen: "rgba(235, 228, 255, 0.35)" }
    ],
    []
  );

  const revealConfetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, idx) => ({
        id: idx,
        left: `${Math.round(Math.random() * 100)}%`,
        delay: `${(Math.random() * 0.35).toFixed(2)}s`,
        duration: `${(1.2 + Math.random() * 0.8).toFixed(2)}s`,
        drift: `${Math.round((Math.random() - 0.5) * 180)}px`,
        spin: `${Math.round(420 + Math.random() * 340)}deg`,
        color: accentThemes[idx % accentThemes.length].primary,
        scale: `${(0.65 + Math.random() * 0.9).toFixed(2)}`
      })),
    [accentThemes]
  );

  const currentAccent = accentThemes[currentTrack % accentThemes.length];
  const safeDuration = duration > 0 ? duration : parseDuration(songs[currentTrack].duration);

  // Preloader stage sequence
  useEffect(() => {
    const toExit = setTimeout(() => setPreloaderStage("exiting"), 2400);
    const toReveal = setTimeout(() => setPreloaderStage("reveal"), 3050);
    const toDone = setTimeout(() => setPreloaderStage("done"), 3900);
    return () => {
      clearTimeout(toExit);
      clearTimeout(toReveal);
      clearTimeout(toDone);
    };
  }, []);

  // Handle track change with automatic playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      if (shouldAutoPlayRef.current) {
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    
    // Reset timing state and force metadata reload for the new source.
    audio.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    setDuration(parseDuration(songs[currentTrack].duration));
    audio.load();
    
    if (shouldAutoPlayRef.current) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrack, songs]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncFromAudio = () => {
      const safeDuration = Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : parseDuration(songs[currentTrack].duration);

      setDuration(safeDuration);
      setCurrentTime(audio.currentTime || 0);
      setProgress(safeDuration > 0 ? (audio.currentTime / safeDuration) * 100 : 0);
    };

    const handleTimeUpdate = () => {
      syncFromAudio();
    };

    const handleLoadedMetadata = () => {
      syncFromAudio();
    };

    const handleDurationChange = () => {
      syncFromAudio();
    };

    const handleEnded = () => {
      if (shouldAutoPlayRef.current) {
        playNextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      syncFromAudio();
    };

    const handleSeeking = () => {
      syncFromAudio();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("seeking", handleSeeking);
    audio.addEventListener("seeked", handleSeeking);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("seeking", handleSeeking);
      audio.removeEventListener("seeked", handleSeeking);
    };
  }, [currentTrack, songs]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      shouldAutoPlayRef.current = true;
      try {
        await audio.play();
      } catch {
        shouldAutoPlayRef.current = false;
        setIsPlaying(false);
      }
    } else {
      shouldAutoPlayRef.current = false;
      audio.pause();
    }
  };
  
  const playNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % songs.length);
  };
  
  const playPreviousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const durationValue = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : parseDuration(songs[currentTrack].duration);
    if (durationValue <= 0) return;

    const nextTime = Math.min(Math.max(Number(e.target.value), 0), durationValue);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    setProgress((nextTime / durationValue) * 100);
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (preloaderStage !== "done") {
    const isExiting = preloaderStage === "exiting";
    const showReveal = preloaderStage === "reveal";

    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        {!showReveal && (
          <div
            className={`absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-gray-950 flex items-center justify-center transition-all duration-700 ${isExiting ? "opacity-0 scale-95 -translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}
          >
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

            <div className="relative z-10 text-center space-y-8">
              <div className="flex items-center justify-center gap-4">
                <Music className="w-14 h-14 text-pink-300 animate-pulse" />
                <Cake className="w-14 h-14 text-blue-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>

              <div className="space-y-3">
                <p className="text-white text-4xl font-light tracking-wide">cheers to the big 19</p>
                <p className="text-pink-300 text-xl font-light">baby!</p>
              </div>
            </div>
          </div>

        )}

        {showReveal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="premium-confetti-layer" aria-hidden="true">
              {revealConfetti.map((piece) => (
                <span
                  key={piece.id}
                  className="premium-confetti-piece"
                  style={{
                    left: piece.left,
                    backgroundColor: piece.color,
                    animationDelay: piece.delay,
                    animationDuration: piece.duration,
                    "--drift": piece.drift,
                    "--spin": piece.spin,
                    "--scale": piece.scale
                  } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 15% 15%, ${currentAccent.soft} 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${currentAccent.glow} 0%, transparent 42%), linear-gradient(135deg, transparent 20%, ${currentAccent.sheen} 50%, transparent 80%)`
        }}
      />

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={songs[currentTrack].audioFile} 
        crossOrigin="anonymous"
        preload="metadata"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 pt-8">
        {/* Album Cover Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl aspect-square group">
          <img
            src={songs[currentTrack].image}
            alt={songs[currentTrack].title}
            className="w-full h-full object-cover"
          />

          {/* Plus Button for Modal */}
          <button
            onClick={() => setShowModal(true)}
            className="premium-plus-button absolute top-4 right-4 z-10 p-3 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
            style={{
              backgroundColor: `${currentAccent.primary}66`,
              border: `1px solid ${currentAccent.sheen}`,
              boxShadow: `0 8px 28px ${currentAccent.glow}, inset 0 1px 0 rgba(255,255,255,0.42)`
            }}
            type="button"
            aria-label="Show message"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Title Below Image */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Happy Birthday, My Love</h1>
          <p className="text-gray-400">A Collection of Songs for Your 19th</p>
        </div>

        {/* Song Info */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-1">{songs[currentTrack].title}</h2>
          <p className="text-gray-300 text-sm">{songs[currentTrack].artist}</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="relative z-10 bg-gradient-to-t from-black via-black/98 to-transparent backdrop-blur-lg border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-5">

          {/* Progress Bar */}
          <div className="mb-5" role="group" aria-label="Seek playback">
            <input
              type="range"
              min={0}
              max={safeDuration || 0}
              step={0.1}
              value={Math.min(currentTime, safeDuration || 0)}
              onChange={handleSeekChange}
              className="player-range"
              style={{
                background: `linear-gradient(to right, ${currentAccent.primary} 0%, ${currentAccent.primary} ${progress}%, rgba(107,114,128,0.65) ${progress}%, rgba(107,114,128,0.65) 100%)`
              }}
              aria-label="Seek song position"
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white font-medium text-sm">{songs[currentTrack].title}</p>
              <p className="text-gray-400 text-xs">{songs[currentTrack].artist}</p>
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={playPreviousTrack}
              className="text-gray-400 hover:text-white transition-colors p-2"
              type="button"
              aria-label="Previous track"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button
              onClick={togglePlayPause}
              className="text-black rounded-full p-3 transition-all hover:scale-110 shadow-lg"
              style={{
                backgroundColor: currentAccent.primary,
                boxShadow: `0 0 28px ${currentAccent.glow}`
              }}
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              onClick={playNextTrack}
              className="text-gray-400 hover:text-white transition-colors p-2"
              type="button"
              aria-label="Next track"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          {/* Song Counter */}
          <div className="text-center text-xs text-gray-500">
            {currentTrack + 1} / {songs.length}
          </div>
        </div>
      </div>

      {/* .lottie Display Section - after controls */}
      <div
        className="relative z-10 overflow-hidden premium-lottie-section"
        style={{
          ["--accent-primary" as "--accent-primary"]: currentAccent.primary,
          ["--accent-soft" as "--accent-soft"]: currentAccent.soft,
          ["--accent-glow" as "--accent-glow"]: currentAccent.glow,
          ["--accent-sheen" as "--accent-sheen"]: currentAccent.sheen
        } as React.CSSProperties}
      >
        <div className="premium-lottie-grid" />
        <div className="premium-lottie-glow-left" />
        <div className="premium-lottie-glow-right" />
        <div className="premium-lottie-sheen" />

        <div className="max-w-2xl mx-auto px-6 py-8">
          <DotLottiePlayer
            src="/Happy Birthday!.lottie"
            autoplay
            loop
            className="w-full h-96 premium-lottie-player"
          />
        </div>
      </div>



      {/* Modal - Love Message with Image */}
      {showModal && (
        <div 
          className="modal-backdrop" 
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="modal-content premium-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="close-modal"
              type="button"
              aria-label="Close message"
            >
              <X size={24} />
            </button>

            <img
              src={modalMessages[currentTrack].image}
              alt="Love message"
              className="modal-image"
            />

            <h2 
              id="modal-title"
              className="text-3xl font-bold mb-4 text-white"
            >
              {modalMessages[currentTrack].title}
            </h2>

            <p className="modal-message">
              {modalMessages[currentTrack].message}
            </p>

            <div className="gradient-blur"></div>
          </div>
        </div>
      )}
    </div>
  );
}
