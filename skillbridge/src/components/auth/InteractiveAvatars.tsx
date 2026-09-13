'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

export interface InteractiveAvatarsProps {
  focusField: 'email' | 'password' | null;
  emailLength: number;
  showPassword: boolean;
}

export default function InteractiveAvatars({
  focusField,
  emailLength,
  showPassword,
}: InteractiveAvatarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      blinkTimeout = setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    };

    const interval = setInterval(() => {
      if (focusField !== 'password' || showPassword) {
        triggerBlink();
      }
    }, 3800 + Math.random() * 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(blinkTimeout);
    };
  }, [focusField, showPassword]);

  // Window mouse listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate gaze offsets
  const {
    dexPupil,
    dexHead,
    novaPupil,
    novaHead,
    sagePupil,
    sageHead,
  } = useMemo(() => {
    if (!containerRef.current) {
      return {
        dexPupil: { x: 0, y: 0 },
        dexHead: { x: 0, y: 0, rot: 0 },
        novaPupil: { x: 0, y: 0 },
        novaHead: { x: 0, y: 0, rot: 0 },
        sagePupil: { x: 0, y: 0 },
        sageHead: { x: 0, y: 0, rot: 0 },
      };
    }

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // ── 1. Password Privacy State ──────────────────────────────────────────
    if (focusField === 'password') {
      if (!showPassword) {
        // Look away / Eyes hidden
        return {
          dexPupil: { x: -5, y: -4 },
          dexHead: { x: -6, y: -2, rot: -14 },
          novaPupil: { x: 0, y: -6 },
          novaHead: { x: 0, y: -4, rot: 0 },
          sagePupil: { x: 5, y: -4 },
          sageHead: { x: 6, y: -2, rot: 14 },
        };
      } else {
        // Peek sideways towards the password field!
        return {
          dexPupil: { x: 4, y: 3 },
          dexHead: { x: 3, y: 3, rot: 7 },
          novaPupil: { x: 4, y: 2 },
          novaHead: { x: 2, y: 2, rot: 5 },
          sagePupil: { x: -4, y: 3 },
          sageHead: { x: -3, y: 3, rot: -7 },
        };
      }
    }

    // ── 2. Email Typing Focus State ─────────────────────────────────────────
    if (focusField === 'email') {
      // Calculate typing tracking: pupils sweep left to right as text grows
      const sweepProgress = Math.min(Math.max(emailLength / 28, 0), 1);
      const typingX = -4.5 + sweepProgress * 9; // sweeps from -4.5px to +4.5px
      const typingY = 4.5; // looking down into the input

      return {
        dexPupil: { x: typingX * 0.9, y: typingY },
        dexHead: { x: (sweepProgress - 0.5) * 4, y: 4, rot: (sweepProgress - 0.5) * 6 },
        novaPupil: { x: typingX, y: typingY },
        novaHead: { x: (sweepProgress - 0.5) * 5, y: 5, rot: (sweepProgress - 0.5) * 5 },
        sagePupil: { x: typingX * 0.9, y: typingY },
        sageHead: { x: (sweepProgress - 0.5) * 4, y: 4, rot: (sweepProgress - 0.5) * -6 },
      };
    }

    // ── 3. Screen / Cursor Follow ───────────────────────────────────────────
    const deltaX = mousePos.x - centerX;
    const deltaY = mousePos.y - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    // Normalize dampening
    const maxDist = 500;
    const factor = Math.min(distance / maxDist, 1);

    const maxEyeX = 5.5;
    const maxEyeY = 4.0;
    const pX = Math.cos(angle) * factor * maxEyeX;
    const pY = Math.sin(angle) * factor * maxEyeY;

    // Head rotation and subtle translation
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const normX = Math.max(Math.min(deltaX / (screenWidth / 2), 1), -1);
    const normY = Math.max(Math.min(deltaY / (screenHeight / 2), 1), -1);

    return {
      dexPupil: { x: pX, y: pY },
      dexHead: { x: normX * 4, y: normY * 3, rot: normX * 10 },
      novaPupil: { x: pX * 1.1, y: pY * 1.1 },
      novaHead: { x: normX * 5, y: normY * 4, rot: normX * 8 },
      sagePupil: { x: pX, y: pY },
      sageHead: { x: normX * 4, y: normY * 3, rot: normX * 10 },
    };
  }, [mousePos, focusField, emailLength, showPassword]);

  const isPasswordCovered = focusField === 'password' && !showPassword;
  const isPeeking = focusField === 'password' && showPassword;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[380px] mx-auto select-none pointer-events-none"
      style={{ height: '110px', marginBottom: '-10px', zIndex: 10 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 120"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="novaBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="novaVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="dexSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="sageSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="beanieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>

          {/* Eye glow */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════════
            CHARACTER 1: DEX (The Student / Coder) - LEFT
           ═══════════════════════════════════════════════════════════════════ */}
        <g
          style={{
            transform: `translate(${75 + dexHead.x}px, ${52 + dexHead.y}px) rotate(${dexHead.rot}deg)`,
            transformOrigin: '75px 85px',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Shoulders */}
          <path
            d="M 50 82 Q 75 75 100 82 L 105 105 L 45 105 Z"
            fill="#3B82F6"
          />

          {/* Neck */}
          <rect x="70" y="68" width="10" height="12" rx="4" fill="#FBBF24" />

          {/* Head Base */}
          <circle cx="75" cy="52" r="26" fill="url(#dexSkin)" />

          {/* Hair / Beanie */}
          <path
            d="M 49 50 C 49 32, 101 32, 101 50 C 97 40, 53 40, 49 50 Z"
            fill="url(#beanieGrad)"
          />
          <path
            d="M 48 51 C 52 48, 98 48, 102 51 L 102 55 C 98 52, 52 52, 48 55 Z"
            fill="#312E81"
          />
          {/* Pom-pom */}
          <circle cx="75" cy="30" r="5" fill="#EEF2FF" />

          {/* Glasses Frame */}
          <rect
            x="56"
            y="47"
            width="17"
            height="14"
            rx="5"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <rect
            x="77"
            y="47"
            width="17"
            height="14"
            rx="5"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <line x1="73" y1="53" x2="77" y2="53" stroke="#1E293B" strokeWidth="2.5" />

          {/* Eyes (Left & Right) */}
          {isPasswordCovered ? (
            // Closed eyes lines
            <g stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
              <path d="M 60 55 Q 64 58 68 55" />
              <path d="M 81 55 Q 85 58 89 55" />
            </g>
          ) : isBlinking && !isPeeking ? (
            <g stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
              <line x1="60" y1="54" x2="68" y2="54" />
              <line x1="81" y1="54" x2="89" y2="54" />
            </g>
          ) : (
            <g>
              {/* White */}
              <ellipse cx="64.5" cy="54" rx="6" ry="5" fill="#FFFFFF" />
              <ellipse cx="85.5" cy="54" rx="6" ry="5" fill="#FFFFFF" />

              {/* Pupils */}
              <circle
                cx={64.5 + dexPupil.x}
                cy={54 + dexPupil.y}
                r="3"
                fill="#0F172A"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={64.5 + dexPupil.x + 1}
                cy={54 + dexPupil.y - 1}
                r="1"
                fill="#FFFFFF"
              />

              <circle
                cx={85.5 + dexPupil.x}
                cy={54 + dexPupil.y}
                r="3"
                fill="#0F172A"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={85.5 + dexPupil.x + 1}
                cy={54 + dexPupil.y - 1}
                r="1"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* Blush */}
          <circle cx="55" cy="60" r="3.5" fill="#F87171" opacity="0.4" />
          <circle cx="95" cy="60" r="3.5" fill="#F87171" opacity="0.4" />

          {/* Mouth */}
          {focusField === 'email' ? (
            <ellipse cx="75" cy="67" rx="2.5" ry="3" fill="#1E293B" />
          ) : isPeeking ? (
            <path d="M 72 65 Q 76 70 80 66" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M 70 66 Q 75 70 80 66" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Hands (Animate up over eyes when password is active) */}
          <g
            style={{
              transform: isPasswordCovered
                ? 'translate(0px, -14px)'
                : isPeeking
                ? 'translate(0px, -4px) rotate(-8deg)'
                : 'translate(0px, 32px)',
              opacity: isPasswordCovered || isPeeking ? 1 : 0,
              transformOrigin: '75px 70px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s',
            }}
          >
            {/* Left Hand */}
            <ellipse cx="61" cy="58" rx="8" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Right Hand */}
            <ellipse cx="89" cy="58" rx="8" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            CHARACTER 2: NOVA (The SkillBridge AI Mentor Bot) - CENTER
           ═══════════════════════════════════════════════════════════════════ */}
        <g
          style={{
            transform: `translate(${190 + novaHead.x}px, ${46 + novaHead.y}px) rotate(${novaHead.rot}deg)`,
            transformOrigin: '190px 85px',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Shoulders / Stand */}
          <path
            d="M 160 82 C 160 76, 220 76, 220 82 L 226 105 L 154 105 Z"
            fill="#1E293B"
          />

          {/* Antenna */}
          <line x1="190" y1="26" x2="190" y2="14" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <circle
            cx="190"
            cy="12"
            r="5"
            fill={focusField === 'email' ? '#10B981' : focusField === 'password' ? '#F59E0B' : '#60A5FA'}
            className="animate-pulse"
          />

          {/* Head Body (Rounded modern capsule) */}
          <rect
            x="158"
            y="26"
            width="64"
            height="54"
            rx="22"
            fill="url(#novaBodyGrad)"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />

          {/* Ears / Side audio sensors */}
          <rect x="153" y="44" width="5" height="16" rx="2.5" fill="#1D4ED8" />
          <rect x="222" y="44" width="5" height="16" rx="2.5" fill="#1D4ED8" />

          {/* Visor Screen */}
          <rect
            x="166"
            y="36"
            width="48"
            height="30"
            rx="12"
            fill="url(#novaVisorGrad)"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Visor Glowing Digital Eyes */}
          {isPasswordCovered ? (
            // Privacy Blindfold Mode: [ - - ]
            <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)">
              <line x1="174" y1="51" x2="183" y2="51" />
              <line x1="197" y1="51" x2="206" y2="51" />
            </g>
          ) : isBlinking && !isPeeking ? (
            // Blinking thin slits
            <g stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlow)">
              <line x1="174" y1="51" x2="184" y2="51" />
              <line x1="196" y1="51" x2="206" y2="51" />
            </g>
          ) : isPeeking ? (
            // Peeking: One curious open eye!
            <g filter="url(#cyanGlow)">
              {/* Left eye closed */}
              <line x1="174" y1="51" x2="182" y2="51" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right eye wide open & peeking right */}
              <circle cx="201" cy="51" r="5" fill="#38BDF8" />
              <circle cx="202.5" cy="51" r="2" fill="#FFFFFF" />
            </g>
          ) : (
            // Standard tracking cyan glow eyes
            <g filter="url(#cyanGlow)">
              <circle
                cx={179 + novaPupil.x * 0.7}
                cy={51 + novaPupil.y * 0.7}
                r="4.5"
                fill="#38BDF8"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={179 + novaPupil.x * 0.7 + 1}
                cy={51 + novaPupil.y * 0.7 - 1}
                r="1.5"
                fill="#FFFFFF"
              />

              <circle
                cx={201 + novaPupil.x * 0.7}
                cy={51 + novaPupil.y * 0.7}
                r="4.5"
                fill="#38BDF8"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={201 + novaPupil.x * 0.7 + 1}
                cy={51 + novaPupil.y * 0.7 - 1}
                r="1.5"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* Hands (Robotic magnetic paddles covering face) */}
          <g
            style={{
              transform: isPasswordCovered
                ? 'translate(0px, -18px)'
                : isPeeking
                ? 'translate(0px, -6px) rotate(12deg)'
                : 'translate(0px, 32px)',
              opacity: isPasswordCovered || isPeeking ? 1 : 0,
              transformOrigin: '190px 70px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s',
            }}
          >
            <rect x="171" y="47" width="13" height="15" rx="5" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
            <rect x="196" y="47" width="13" height="15" rx="5" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            CHARACTER 3: SAGE (The Mentor / Recruiter) - RIGHT
           ═══════════════════════════════════════════════════════════════════ */}
        <g
          style={{
            transform: `translate(${305 + sageHead.x}px, ${52 + sageHead.y}px) rotate(${sageHead.rot}deg)`,
            transformOrigin: '305px 85px',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Shoulders */}
          <path
            d="M 280 82 Q 305 75 330 82 L 335 105 L 275 105 Z"
            fill="#0F766E"
          />

          {/* Neck */}
          <rect x="300" y="68" width="10" height="12" rx="4" fill="#FBBF24" />

          {/* Head Base */}
          <circle cx="305" cy="52" r="26" fill="url(#sageSkin)" />

          {/* Hair (Sleek professional crop) */}
          <path
            d="M 280 48 C 280 28, 330 28, 330 48 C 324 38, 286 38, 280 48 Z"
            fill="#1E293B"
          />
          <path
            d="M 280 45 C 288 38, 316 38, 328 46 C 322 41, 290 41, 280 45 Z"
            fill="#334155"
          />

          {/* Eyes (Left & Right) */}
          {isPasswordCovered ? (
            // Closed eyes lines
            <g stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
              <path d="M 290 55 Q 294 58 298 55" />
              <path d="M 312 55 Q 316 58 320 55" />
            </g>
          ) : isBlinking && !isPeeking ? (
            <g stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
              <line x1="290" y1="54" x2="298" y2="54" />
              <line x1="312" y1="54" x2="320" y2="54" />
            </g>
          ) : (
            <g>
              {/* White */}
              <ellipse cx="294.5" cy="54" rx="6" ry="5" fill="#FFFFFF" />
              <ellipse cx="315.5" cy="54" rx="6" ry="5" fill="#FFFFFF" />

              {/* Pupils */}
              <circle
                cx={294.5 + sagePupil.x}
                cy={54 + sagePupil.y}
                r="3"
                fill="#0F172A"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={294.5 + sagePupil.x + 1}
                cy={54 + sagePupil.y - 1}
                r="1"
                fill="#FFFFFF"
              />

              <circle
                cx={315.5 + sagePupil.x}
                cy={54 + sagePupil.y}
                r="3"
                fill="#0F172A"
                style={{ transition: 'cx 0.12s ease-out, cy 0.12s ease-out' }}
              />
              <circle
                cx={315.5 + sagePupil.x + 1}
                cy={54 + sagePupil.y - 1}
                r="1"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* Eyebrows */}
          <path
            d="M 289 46 Q 294 44 299 46"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 311 46 Q 316 44 321 46"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Blush */}
          <circle cx="286" cy="60" r="3.5" fill="#F87171" opacity="0.35" />
          <circle cx="324" cy="60" r="3.5" fill="#F87171" opacity="0.35" />

          {/* Mouth */}
          {focusField === 'email' ? (
            <ellipse cx="305" cy="67" rx="2.5" ry="3" fill="#1E293B" />
          ) : isPeeking ? (
            <path d="M 300 66 Q 305 70 310 66" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M 300 66 Q 305 70 310 66" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Hands (Animate up over eyes when password is active) */}
          <g
            style={{
              transform: isPasswordCovered
                ? 'translate(0px, -14px)'
                : isPeeking
                ? 'translate(0px, -4px) rotate(8deg)'
                : 'translate(0px, 32px)',
              opacity: isPasswordCovered || isPeeking ? 1 : 0,
              transformOrigin: '305px 70px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s',
            }}
          >
            {/* Left Hand */}
            <ellipse cx="291" cy="58" rx="8" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Right Hand */}
            <ellipse cx="319" cy="58" rx="8" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
