"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle autoplay on load
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy was triggered
          setIsPlaying(false);
        });
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      className="relative w-full aspect-video overflow-hidden group cursor-pointer"
      style={{
        borderRadius: "18px",
        border: "1px solid #D7E1F5",
        boxShadow: "0 0 25px rgba(0, 0, 0, 0.08), 0 15px 35px -5px rgba(0, 0, 0, 0.1)",
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover block"
        style={{ borderRadius: "18px" }}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/skillbridge-ad.mp4" type="video/mp4" />
        <source src="/assets/Create_a_premium_%E2%80%93_second.mp4" type="video/mp4" />
        <source src="/assets/Create_a_premium_-_second.mp4" type="video/mp4" />
        <source src="/skillbridge-ad.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <span className="material-symbols-outlined text-[18px]">volume_off</span>
        ) : (
          <span className="material-symbols-outlined text-[18px]">volume_up</span>
        )}
      </button>

      {/* Subtle play button shown only when paused */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all"
          aria-label="Video paused - click to play"
        >
          <div
            className="w-16 h-16 rounded-full bg-white/95 text-[#2563EB] flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
            style={{
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            <svg
              className="w-7 h-7 translate-x-0.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
