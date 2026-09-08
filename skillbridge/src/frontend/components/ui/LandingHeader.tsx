"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/image.png" 
            alt="SkillBridge" 
            width={240} 
            height={64} 
            className="h-12 lg:h-[60px] w-auto object-contain scale-[3] lg:scale-[3.5] origin-left" 
            priority 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full gap-8 text-[14px] font-semibold text-[#111827]">
          
          <a href="#features" className="hover:text-[#2563EB] transition-colors py-2 flex items-center">
            Key Features
          </a>
          
          <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors py-2 flex items-center">
            How It Works
          </a>
          
          <a href="#who-its-for" className="hover:text-[#2563EB] transition-colors py-2 flex items-center">
            Who It's For
          </a>
          
          <a href="#opportunities" className="hover:text-[#2563EB] transition-colors py-2 flex items-center">
            Opportunities
          </a>

        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-6 z-10">
          <Link href="/login" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block text-[14px] font-semibold hover:text-[#2563EB] transition-colors">
            Sign In
          </Link>
          <Link href="/role" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
            Get Started <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
