"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  duration: string;
  description?: string;
  image?: string;
}

interface ProgressiveBlurModalProps {
  songs?: Song[];
  currentTrack?: number;
  albumTitle?: string;
  albumImage?: string;
  artistName?: string;
  artistImage?: string;
  genre?: string;
  totalSongs?: number;
  year?: string;
  artistListeners?: string;
  birthdayMessage?: string;
  isModalOpen?: boolean;
  onModalToggle?: () => void;
}

const GradientBlur = () => (
  <div className="gradient-blur">
    {[...Array(8)].map((_, i) => <div key={i}></div>)}
  </div>
);

export const ProgressiveBlurModal: React.FC<ProgressiveBlurModalProps> = ({
  songs = [] as Song[],
  currentTrack = 0,
  albumTitle = "Birthday Vibes",
  albumImage = "/finepic1.jpg",
  artistName = "Your Love",
  artistImage = "/finepic2.jpg",
  genre = "Love",
  totalSongs = songs.length,
  year = new Date().getFullYear().toString(),
  artistListeners = "Forever",
  birthdayMessage = "Happy Birthday! You make my heart sing.",
  isModalOpen = false,
  onModalToggle = () => {},
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen">
      {/* Main Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Hero Image - NO BLUR */}
        <img
          src={albumImage}
          alt={albumTitle}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold mb-3">{songs[currentTrack]?.title}</h2>
            <p className="text-2xl text-gray-200 mb-8">{songs[currentTrack]?.artist}</p>
            
            {/* Plus Button to Open Modal */}
            <button
              onClick={onModalToggle}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 text-black transition-all hover:scale-110 shadow-2xl mb-6"
            >
              {isModalOpen ? (
                <X size={32} />
              ) : (
                <Plus size={32} />
              )}
            </button>
            
            {/* Modal - Love Message with Image */}
            {isModalOpen && (
              <div className="bg-black/90 backdrop-blur-sm border border-green-500/50 rounded-xl overflow-hidden mt-6 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-6 p-8">
                  {/* Modal Image */}
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <img
                      src={albumImage}
                      alt="Birthday Special"
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Love Message */}
                  <div className="w-full md:w-2/3">
                    <h3 className="text-2xl font-bold text-green-400 mb-4">💚 A Message from the Heart</h3>
                    <p className="text-lg leading-relaxed text-gray-100 mb-6">
                      {birthdayMessage}
                    </p>
                    <p className="text-base text-gray-300 italic">
                      {songs[currentTrack]?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Spacing for Music Player */}
      <div className="h-40" />
    </div>
  );
};
