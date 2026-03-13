"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Cake, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

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
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lottieData, setLottieData] = useState(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const songs: Song[] = [
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
      image: "/finepic6.jpg",
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
  ];

  const modalMessages: ModalMessage[] = [
    {
      title: "Happy Birthday, Love",
      message: "You are my greatest blessing. Every moment with you is a song I never want to end. You make my heart sing in ways I never thought possible. Here's to celebrating you today and every day.",
      image: "/finepic1.jpg",
    },
    {
      title: "Your Beauty Within",
      message: "It's not just your beauty that captivates me—it's your kindness, your strength, and the light you bring to my world. Thank you for being exactly who you are.",
      image: "/finepic2.jpg",
    },
    {
      title: "My Midnight Sky",
      message: "In the darkness, you are my light. In the chaos, you are my calm. In my heart, you are everything.",
      image: "/finepic3.jpg",
    },
    {
      title: "Sweet Moments",
      message: "Life is more beautiful with you in it. From the simple morning coffee to the late-night conversations, every moment with you is pure vanilla—sweet and perfect.",
      image: "/finepic4.jpg",
    },
    {
      title: "Forever Safe",
      message: "With you, I've found my sanctuary. My asylum from all the noise. You are my home, my peace, and my forever. Happy 19th birthday to my everything.",
      image: "/finepic5.jpg",
    }
  ];

  // Preloader timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Load Lottie animation
  useEffect(() => {
    fetch('/Happy Birthday!.lottie')
      .then((res) => res.json())
      .then((data) => setLottieData(data))
      .catch(() => console.log('Lottie file loaded'));
  }, []);

  // Handle track change with automatic playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(() => console.log("Playback initiated"));
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    
    // Reset and load new track
    audio.currentTime = 0;
    setProgress(0);
    
    if (isPlaying) {
      audio.play().catch(() => console.log("Auto-play on track change"));
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrack, isPlaying]);

  // Audio playback control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => console.log("Autoplay blocked"));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  
  const playNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % songs.length);
  };
  
  const playPreviousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audio.currentTime = percent * audio.duration;
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-gray-950 flex items-center justify-center z-50 overflow-hidden">
        {/* Premium background blur elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="relative z-10 text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Music className="w-14 h-14 text-pink-400 animate-pulse" />
            <Cake className="w-14 h-14 text-purple-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>

          <div className="space-y-3">
            <p className="text-white text-4xl font-light tracking-wide">cheers to the big 19</p>
            <p className="text-pink-300 text-xl font-light">baby!</p>
          </div>

          {/* Lottie Animation */}
          {lottieData && (
            <div className="relative z-20 w-32 h-32 flex justify-center">
              <Lottie 
                animationData={lottieData}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={songs[currentTrack].audioFile} 
        crossOrigin="anonymous"
        preload="metadata"
      />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 pt-8">
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
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all hover:scale-110"
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
        <div className="mb-24">
          <h2 className="text-2xl font-bold mb-1">{songs[currentTrack].title}</h2>
          <p className="text-gray-300">{songs[currentTrack].artist}</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-gradient-to-t from-black via-black/98 to-transparent backdrop-blur-lg border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-6">
          {/* Lottie Animation in Controls */}
          {lottieData && (
            <div className="flex justify-center mb-4 h-16">
              <Lottie
                animationData={lottieData}
                loop
                autoplay
                style={{ width: '64px', height: '64px' }}
              />
            </div>
          )}

          {/* Progress Bar */}
          <div 
            className="mb-4 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
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
              className="bg-white hover:bg-gray-100 text-black rounded-full p-3 transition-all hover:scale-110 shadow-lg"
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
            className="modal-content" 
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
