'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LangSelector, { useLang } from '@/components/LangSelector';

/* =============================================================================
   CSS — Modern Bento · Bold & Visual (True Asymmetric Grid Geometry)
   All selectors scoped with .sb2-* prefix
============================================================================= */
const ROLE_CSS = `
/* ── Root & Ambient Background ── */
.sb2-root {
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f7fc;
  color: #0f172a;
  position: relative;
  overflow-x: hidden;
}

.sb2-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 65% 50% at 15% 0%,   rgba(37,99,235,0.12)  0%, transparent 65%),
    radial-gradient(ellipse 50% 45% at 85% 90%,  rgba(124,58,237,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 40% 35% at 50% 45%,   rgba(13,148,136,0.06) 0%, transparent 55%),
    radial-gradient(ellipse 35% 30% at 90% 15%,   rgba(234,88,12,0.05)  0%, transparent 50%),
    linear-gradient(165deg, #eef2ff 0%, #f6f8fe 35%, #faf5ff 70%, #fffbf7 100%);
}

.sb2-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(37,99,235,0.05) 1px, transparent 1px);
  background-size: 26px 26px;
}

/* ── Header ── */
.sb2-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 28px;
  background: rgba(255,255,255,0.80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226,232,240,0.8);
  box-shadow: 0 1px 3px rgba(15,23,42,0.03), 0 4px 20px rgba(15,23,42,0.03);
}
.sb2-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.sb2-logo img { height: 36px; width: auto; object-fit: contain; }
.sb2-header-right { display: flex; align-items: center; gap: 20px; }

/* ── Stepper ── */
.sb2-stepper {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.sb2-step { display: flex; align-items: center; gap: 6px; color: #cbd5e1; white-space: nowrap; }
.sb2-step.active { color: #2563eb; }
.sb2-step-num {

  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.auth-logo { display: flex; align-items: center; text-decoration: none; }
.auth-logo img { height: 48px; width: auto; object-fit: contain; transform: scale(3); transform-origin: left center; }
.auth-header-right { display: flex; align-items: center; gap: 20px; }
.auth-lang-toggle {
  display: flex; background: #F1F5F9; border-radius: 8px; padding: 2px;
}
.auth-lang-btn {
  padding: 4px 12px; border-radius: 6px; border: none;
  background: transparent; font-size: 13px; font-weight: 500;
  color: #64748B; cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.auth-lang-btn.active {
  background: #fff; color: #111827;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.auth-back-link {
  font-size: 14px; font-weight: 500; color: #2563EB;
  text-decoration: none; transition: opacity 0.15s;
}
.auth-back-link:hover { opacity: 0.75; }
/* ── Progress stepper ── */
.auth-stepper {
  display: flex; align-items: center; gap: 0;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
}
.auth-step {
  display: flex; align-items: center; gap: 6px;
  color: #CBD5E1;
}
.auth-step.active { color: #2563EB; }
.auth-step.done { color: #059669; }
.auth-step-num {

  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid currentColor;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0;
}
.sb2-step.active .sb2-step-num { background: #2563eb; border-color: #2563eb; color: #fff; }
.sb2-step-sep { width: 24px; height: 1px; background: #e2e8f0; margin: 0 5px; flex-shrink: 0; }
.sb2-back { font-size: 13px; font-weight: 500; color: #2563eb; text-decoration: none; white-space: nowrap; transition: opacity .15s; }
.sb2-back:hover { opacity: 0.75; }

/* ── Main Container ── */
.sb2-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 120px;
}

/* ── Hero Heading ── */
.sb2-hero {
  text-align: center;
  max-width: 600px;
  margin-bottom: 36px;
}
.sb2-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px 5px 10px;
  background: rgba(37,99,235,0.08);
  border: 1px solid rgba(37,99,235,0.18);
  border-radius: 100px;
  font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #2563eb;
  margin-bottom: 16px;
}
.sb2-badge-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #2563eb;
  animation: sb2-pulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes sb2-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.8)} }

.sb2-h1 {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1px;
  line-height: 1.15;
  margin: 0 0 12px;
}
.sb2-h1-accent {
  background: linear-gradient(130deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sb2-sub { font-size: 15px; color: #475569; line-height: 1.6; margin: 0; font-weight: 400; }

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO GRID — TRUE ASYMMETRIC GEOMETRY
   Desktop (min-width: 1024px):
   - Parent grid: 2 columns (1.35fr 1fr -> left column wider & visually dominant)
   - Row 1: Student (col 1, row 1-2) | Industry (col 2, row 1)
   - Row 2: Student (cont.)          | Academician (col 2, row 2)
   - Row 3: Institution & TPO        | Spans col 1 to -1 (row 3 wide bottom card)
   ═══════════════════════════════════════════════════════════════════════════ */
.sb2-bento {
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 16px;
}

/* ── Card Base ── */
.sb2-card {
  position: relative;
  background: rgba(255, 255, 255, 0.90);
  border: 1.5px solid rgba(226, 232, 240, 0.90);
  border-radius: 24px;
  cursor: pointer;
  text-align: left;
  outline: none;
  overflow: hidden;
  transition:
    transform      0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow     0.22s ease,
    border-color   0.22s ease,
    background     0.22s ease;
  box-shadow: 0 2px 4px rgba(15,23,42,0.04), 0 6px 20px rgba(15,23,42,0.03);
}

.sb2-card:hover {
  transform: translateY(-4px) scale(1.008);
  box-shadow: 0 12px 32px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.04);
}

.sb2-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(37,99,235,0.45), 0 8px 28px rgba(15,23,42,0.1);
}

/* Shiny gradient surface sheen */
.sb2-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%);
  border-radius: inherit;
  pointer-events: none;
}

/* ─── 1. STUDENT — Primary Large Hero Card ─── */
.sb2-card--student {
  grid-column: 1;
  grid-row: 1 / span 2;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 420px;
  background: rgba(255, 255, 255, 0.95);
}

/* Ambient glow orb inside student card */
.sb2-card--student::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 68%);
  pointer-events: none;
  z-index: 0;
}

.sb2-card--student.selected {
  background: rgba(239,246,255,0.98);
  border-color: #2563eb;
  border-width: 2px;
  box-shadow:
    0 0 0 4px rgba(37,99,235,0.14),
    0 16px 48px rgba(37,99,235,0.18),
    0 4px 12px rgba(15,23,42,0.05);
  transform: translateY(-4px) scale(1.01);
}
.sb2-card--student:hover { border-color: rgba(37,99,235,0.45); }

/* Student card inner structure */
.sb2-student-top {
  position: relative;
  z-index: 1;
}

.sb2-student-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(37,99,235,0.1);
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.sb2-card--student .sb2-icon {
  width: 76px; height: 76px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(37,99,235,0.30);
}
.sb2-card--student .sb2-icon .material-symbols-outlined {
  font-size: 38px;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48;
}

.sb2-student-title {
  font-size: 27px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.6px;
  line-height: 1.2;
  margin: 0 0 10px;
}

.sb2-student-desc {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 24px;
}

/* Feature bullets using vertical space */
.sb2-student-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.sb2-feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.sb2-feature-icon {
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(37,99,235,0.12); color: #2563eb;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
}

.sb2-student-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(226,232,240,0.7);
}

.sb2-student-hint {
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ─── 2. INDUSTRY — Right Col Top Card ─── */
.sb2-card--industry {
  grid-column: 2;
  grid-row: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sb2-card--industry.selected {
  background: rgba(245,243,255,0.98);
  border-color: #7c3aed;
  border-width: 2px;
  box-shadow:
    0 0 0 4px rgba(124,58,237,0.14),
    0 12px 36px rgba(124,58,237,0.16),
    0 4px 12px rgba(15,23,42,0.05);
  transform: translateY(-3px) scale(1.008);
}
.sb2-card--industry:hover { border-color: rgba(124,58,237,0.45); }

/* ─── 3. ACADEMICIAN — Right Col Bottom Card ─── */
.sb2-card--academician {
  grid-column: 2;
  grid-row: 2;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sb2-card--academician.selected {
  background: rgba(240,253,250,0.98);
  border-color: #0d9488;
  border-width: 2px;
  box-shadow:
    0 0 0 4px rgba(13,148,136,0.14),
    0 12px 36px rgba(13,148,136,0.16),
    0 4px 12px rgba(15,23,42,0.05);
  transform: translateY(-3px) scale(1.008);
}
.sb2-card--academician:hover { border-color: rgba(13,148,136,0.45); }

/* ─── 4. INSTITUTION & TPO — Full-Width Bottom Card ─── */
.sb2-card--institution {
  grid-column: 1 / 3;
  grid-row: 3;
  padding: 26px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sb2-card--institution.selected {
  background: rgba(255,247,237,0.98);
  border-color: #ea580c;
  border-width: 2px;
  box-shadow:
    0 0 0 4px rgba(234,88,12,0.13),
    0 12px 36px rgba(234,88,12,0.15),
    0 4px 12px rgba(15,23,42,0.05);
  transform: translateY(-3px) scale(1.005);
}
.sb2-card--institution:hover { border-color: rgba(234,88,12,0.45); }

/* Decorative gradient orb for Institution */
.sb2-card--institution::before {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(234,88,12,0.09) 0%, transparent 68%);
  pointer-events: none;
  z-index: 0;
}

/* Layout inside Institution card */
.sb2-inst-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
}
.sb2-inst-text { flex: 1; min-width: 0; }
.sb2-inst-tags {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.sb2-inst-tag {
  font-size: 11px;
  font-weight: 700;
  color: #ea580c;
  background: rgba(234,88,12,0.08);
  padding: 3px 10px;
  border-radius: 100px;
}

/* ── Card Elements & Typography ── */
.sb2-card-z { position: relative; z-index: 1; width: 100%; }

.sb2-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sb2-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
  transition: transform 0.22s ease;
}
.sb2-card:hover .sb2-icon { transform: scale(1.06) rotate(-3deg); }

.sb2-card--industry .sb2-icon {
  width: 50px; height: 50px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(124,58,237,0.25);
}
.sb2-card--academician .sb2-icon {
  width: 50px; height: 50px;
  background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(13,148,136,0.25);
}
.sb2-card--institution .sb2-icon {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(234,88,12,0.25);
}

.sb2-card--industry .sb2-icon .material-symbols-outlined,
.sb2-card--academician .sb2-icon .material-symbols-outlined { font-size: 26px; }
.sb2-card--institution .sb2-icon .material-symbols-outlined { font-size: 32px; }

/* Check mark ring */
.sb2-check {
  width: 26px; height: 26px; border-radius: 50%;
  border: 1.5px solid #cbd5e1; background: #ffffff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .2s, border-color .2s, transform .22s cubic-bezier(0.34,1.56,0.64,1);
}
.sb2-card--student.selected    .sb2-check { background: #2563eb; border-color: #2563eb; transform: scale(1.15); }
.sb2-card--industry.selected   .sb2-check { background: #7c3aed; border-color: #7c3aed; transform: scale(1.15); }
.sb2-card--academician.selected .sb2-check { background: #0d9488; border-color: #0d9488; transform: scale(1.15); }
.sb2-card--institution.selected .sb2-check { background: #ea580c; border-color: #ea580c; transform: scale(1.15); }

.sb2-label {
  font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
  text-transform: uppercase; color: #94a3b8;
  margin-bottom: 6px; display: block;
}
.sb2-card--student.selected    .sb2-label { color: #2563eb; }
.sb2-card--industry.selected   .sb2-label { color: #7c3aed; }
.sb2-card--academician.selected .sb2-label { color: #0d9488; }
.sb2-card--institution.selected .sb2-label { color: #ea580c; }

.sb2-title {
  font-size: 17px; font-weight: 700; color: #0f172a;
  margin: 0 0 6px; letter-spacing: -0.3px; line-height: 1.25;
}
.sb2-desc {
  font-size: 13.5px; color: #64748b; line-height: 1.55; margin: 0; font-weight: 400;
}

.sb2-card--institution .sb2-title { font-size: 21px; font-weight: 800; letter-spacing: -0.4px; }
.sb2-card--institution .sb2-desc  { font-size: 14px; color: #4b5563; }

/* ── Floating CTA Bar ── */
.sb2-cta-bar {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(226,232,240,0.9);
  border-radius: 18px;
  padding: 12px 18px;
  box-shadow:
    0 4px 6px -1px rgba(15,23,42,0.06),
    0 12px 48px rgba(15,23,42,0.14),
    0 0 0 1px rgba(255,255,255,0.6) inset;
  min-width: 320px;
  max-width: calc(100vw - 48px);
  animation: sb2-slidein 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes sb2-slidein {
  from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);   }
}

.sb2-cta-info { flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }
.sb2-cta-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; animation: sb2-pulse 2s ease-in-out infinite; }
.sb2-cta-dot--student     { background: #2563eb; }
.sb2-cta-dot--industry    { background: #7c3aed; }
.sb2-cta-dot--academician { background: #0d9488; }
.sb2-cta-dot--institution { background: #ea580c; }
.sb2-cta-label { font-size: 11px; color: #64748b; font-weight: 500; display: block; }
.sb2-cta-name  { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

.sb2-cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  border: none; border-radius: 12px; padding: 11px 22px;
  font-size: 14px; font-weight: 700; font-family: inherit;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  position: relative; overflow: hidden;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease;
}
.sb2-cta-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
  border-radius: 12px; pointer-events: none;
}
.sb2-cta-btn:hover  { transform: scale(1.04) translateY(-1px); }
.sb2-cta-btn:active { transform: scale(0.98); }
.sb2-cta-btn:focus-visible { outline: 2px solid rgba(255,255,255,0.8); outline-offset: 2px; }

.sb2-cta-btn--student     { background: linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow: 0 4px 16px rgba(37,99,235,.35); }
.sb2-cta-btn--industry    { background: linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; box-shadow: 0 4px 16px rgba(124,58,237,.35); }
.sb2-cta-btn--academician { background: linear-gradient(135deg,#0d9488,#0f766e); color:#fff; box-shadow: 0 4px 16px rgba(13,148,136,.35); }
.sb2-cta-btn--institution { background: linear-gradient(135deg,#ea580c,#c2410c); color:#fff; box-shadow: 0 4px 16px rgba(234,88,12,.35); }

/* ── Sign-in Link Row ── */
.sb2-signin-row { margin-top: 24px; text-align: center; font-size: 14px; color: #64748b; position: relative; z-index: 1; }
.sb2-signin-link { color: #2563eb; font-weight: 600; text-decoration: none; margin-left: 4px; transition: opacity .15s; }
.sb2-signin-link:hover { opacity: 0.75; }

/* ── Footer ── */
.sb2-footer {
  position: relative; z-index: 1;
  padding: 14px 28px;
  font-size: 12px; color: #94a3b8;
  border-top: 1px solid rgba(226,232,240,0.8);
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.sb2-footer-links { display: flex; align-items: center; gap: 16px; }
.sb2-footer-link { color: #94a3b8; text-decoration: none; font-size: 12px; transition: color .15s; }
.sb2-footer-link:hover { color: #475569; }
.sb2-footer-sep { color: #e2e8f0; user-select: none; }

/* ── Accessibility & Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  .sb2-card, .sb2-icon, .sb2-check, .sb2-cta-btn { transition: none !important; }
  .sb2-badge-dot, .sb2-cta-dot { animation: none !important; }
  .sb2-cta-bar { animation: none !important; }
}

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE LAYOUTS

   TABLET (641px - 1023px): Sensible 2-column adaptive layout
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 1023px) and (min-width: 641px) {
  .sb2-bento {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    max-width: 720px;
  }
  .sb2-card--student {
    grid-column: 1;
    grid-row: 1;
    min-height: unset;
    padding: 24px;
  }
  .sb2-card--student .sb2-icon { width: 56px; height: 56px; margin-bottom: 16px; }
  .sb2-card--student .sb2-icon .material-symbols-outlined { font-size: 28px; }
  .sb2-student-title { font-size: 20px; }
  .sb2-student-features { display: none; }

  .sb2-card--industry {
    grid-column: 2;
    grid-row: 1;
  }

  .sb2-card--academician {
    grid-column: 1;
    grid-row: 2;
  }

  .sb2-card--institution {
    grid-column: 1 / 3;
    grid-row: 3;
    padding: 22px 24px;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE (< 641px): Single-column vertical stack
   1. Student
   2. Industry
   3. Academician
   4. Institution & TPO
   ═══════════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .sb2-header { padding: 0 16px; }
  .sb2-stepper { display: none; }
  .sb2-main { padding: 28px 16px 110px; }
  .sb2-bento {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 100%;
  }
  .sb2-card--student,
  .sb2-card--industry,
  .sb2-card--academician,
  .sb2-card--institution {
    grid-column: auto !important;
    grid-row: auto !important;
    min-height: unset;
    padding: 20px;
  }
  .sb2-card--student::before,
  .sb2-card--institution::before { display: none; }

  .sb2-card--student .sb2-icon { width: 56px; height: 56px; margin-bottom: 14px; }
  .sb2-card--student .sb2-icon .material-symbols-outlined { font-size: 28px; }
  .sb2-student-title { font-size: 20px; }
  .sb2-student-features { display: none; }

  .sb2-inst-content { flex-direction: column; align-items: flex-start; gap: 14px; }
  .sb2-inst-tags { display: none; }

  .sb2-cta-bar {
    bottom: 14px;
    min-width: unset;
    width: calc(100% - 32px);
    border-radius: 16px;
    padding: 12px 14px;
    gap: 12px;
  }
  .sb2-footer { flex-direction: column; gap: 8px; text-align: center; padding: 12px 16px; }
}
`;

/* =============================================================================
   Role Data
============================================================================= */
const ROLES = [
  {
    id: 'student',
    label: 'STUDENT',
    title: 'Students & Graduates',
    desc: 'Build verified skills, discover career paths and find internships and jobs.',
    icon: 'school',
  },
  {
    id: 'industry',
    label: 'INDUSTRY',
    title: 'Industry & Recruiters',
    desc: 'Find skilled candidates and recruit based on verified competencies.',
    icon: 'business_center',
  },
  {
    id: 'academician',
    label: 'ACADEMIA',
    title: 'Academicians & Faculty',
    desc: 'Discover FDPs, industry training, research and collaboration opportunities.',
    icon: 'menu_book',
  },
  {
    id: 'institution',
    label: 'INSTITUTION',
    title: 'Institutions & TPOs',
    desc: 'Track skill development, internship placements and campus readiness across departments.',
    icon: 'account_balance',
  },
];

/* Checkmark SVG component */
function CheckMark({ checked }: { checked: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.5l3 3 5-5"
        stroke={checked ? '#fff' : '#cbd5e1'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =============================================================================
   RoleSelectionContent Component
============================================================================= */
function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [lang, setLang] = useLang();

  const actionType = searchParams.get('type') || 'signup';

  // Preserved exactly — router navigation logic
  const handleContinue = () => {
    if (!selectedRole) return;
    router.push(`/${actionType}?role=${selectedRole}`);
  };

  const selected = selectedRole ? ROLES.find((r) => r.id === selectedRole) : null;

  const pick = (id: string) => setSelectedRole(id);
  const keyPick = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(id); }
  };

  return (
    <div className="sb2-root">
      {/* Layered ambient gradient background */}
      <div className="sb2-bg" aria-hidden="true" />

      <style>{ROLE_CSS}</style>

      {/* ── Header ── */}
      <header className="sb2-header">
        <Link href="/" className="sb2-logo">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority />
        </Link>

        <div className="sb2-header-right">
          {/* Stepper — preserved exactly */}
          <nav className="sb2-stepper" aria-label="Sign-up progress">
            {(['01 Role', '02 Account', '03 Verify', '04 Profile'] as const).map((step, i) => (
              <span key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span className="sb2-step-sep" aria-hidden="true" />}
                <span className={`sb2-step${i === 0 ? ' active' : ''}`}>
                  <span className="sb2-step-num">{`0${i + 1}`}</span>
                  <span>{step.slice(3)}</span>
                </span>
              </span>
            ))}
          </nav>

          {/* LangSelector — preserved exactly */}
          <LangSelector lang={lang} setLang={setLang} />

          <Link href="/" className="sb2-back">Back to SkillBridge</Link>
        </div>
      </header>

      {/* ── Main Section ── */}
      <main className="sb2-main">

        {/* Hero Header */}
        <div className="sb2-hero">
          <div className="sb2-badge" aria-hidden="true">
            <span className="sb2-badge-dot" />
            GET STARTED
          </div>
          <h1 className="sb2-h1">
            What brings you to{' '}
            <span className="sb2-h1-accent">SkillBridge</span>?
          </h1>
          <p className="sb2-sub">
            Choose your role to personalise your experience and unlock the right tools for you.
          </p>
        </div>

        {/* ══ ASYMMETRIC BENTO GRID ══ */}
        <div
          className="sb2-bento"
          role="radiogroup"
          aria-label="Select your role"
        >

          {/* ─────── 1. STUDENT — Tall Primary Hero Card (Column 1, Rows 1-2) ─────── */}
          {(() => {
            const role = ROLES[0];
            const isSel = selectedRole === role.id;
            return (
              <div
                data-role={role.id}
                className={`sb2-card sb2-card--student${isSel ? ' selected' : ''}`}
                role="radio"
                aria-checked={isSel}
                tabIndex={0}
                onClick={() => pick(role.id)}
                onKeyDown={(e) => keyPick(e, role.id)}
              >
                <div className="sb2-student-top">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="sb2-student-badge">Primary Role</div>
                    <div className="sb2-check" aria-hidden="true">
                      <CheckMark checked={isSel} />
                    </div>
                  </div>

                  <div className="sb2-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">{role.icon}</span>
                  </div>

                  <span className="sb2-label">{role.label}</span>
                  <h2 className="sb2-student-title">{role.title}</h2>
                  <p className="sb2-student-desc">{role.desc}</p>

                  <div className="sb2-student-features">
                    <div className="sb2-feature-item">
                      <span className="sb2-feature-icon">✓</span>
                      <span>Verified Skill Profiles & Portfolios</span>
                    </div>
                    <div className="sb2-feature-item">
                      <span className="sb2-feature-icon">✓</span>
                      <span>Direct Internship & Job Matching</span>
                    </div>
                    <div className="sb2-feature-item">
                      <span className="sb2-feature-icon">✓</span>
                      <span>Industry Competency Challenges</span>
                    </div>
                  </div>
                </div>

                <div className="sb2-student-bottom">
                  <div className="sb2-student-hint">
                    {isSel ? 'Role Selected ✓' : 'Select Student Role →'}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─────── 2. INDUSTRY — Right Column Top Card (Column 2, Row 1) ─────── */}
          {(() => {
            const role = ROLES[1];
            const isSel = selectedRole === role.id;
            return (
              <div
                data-role={role.id}
                className={`sb2-card sb2-card--industry${isSel ? ' selected' : ''}`}
                role="radio"
                aria-checked={isSel}
                tabIndex={0}
                onClick={() => pick(role.id)}
                onKeyDown={(e) => keyPick(e, role.id)}
              >
                <div className="sb2-card-z">
                  <div className="sb2-card-header">
                    <div className="sb2-icon" aria-hidden="true">
                      <span className="material-symbols-outlined">{role.icon}</span>
                    </div>
                    <div className="sb2-check" aria-hidden="true">
                      <CheckMark checked={isSel} />
                    </div>
                  </div>
                  <span className="sb2-label">{role.label}</span>
                  <h2 className="sb2-title">{role.title}</h2>
                  <p className="sb2-desc">{role.desc}</p>
                </div>
              </div>
            );
          })()}

          {/* ─────── 3. ACADEMICIAN — Right Column Bottom Card (Column 2, Row 2) ─────── */}
          {(() => {
            const role = ROLES[2];
            const isSel = selectedRole === role.id;
            return (
              <div
                data-role={role.id}
                className={`sb2-card sb2-card--academician${isSel ? ' selected' : ''}`}
                role="radio"
                aria-checked={isSel}
                tabIndex={0}
                onClick={() => pick(role.id)}
                onKeyDown={(e) => keyPick(e, role.id)}
              >
                <div className="sb2-card-z">
                  <div className="sb2-card-header">
                    <div className="sb2-icon" aria-hidden="true">
                      <span className="material-symbols-outlined">{role.icon}</span>
                    </div>
                    <div className="sb2-check" aria-hidden="true">
                      <CheckMark checked={isSel} />
                    </div>
                  </div>
                  <span className="sb2-label">{role.label}</span>
                  <h2 className="sb2-title">{role.title}</h2>
                  <p className="sb2-desc">{role.desc}</p>
                </div>
              </div>
            );
          })()}

          {/* ─────── 4. INSTITUTION & TPO — Full-Width Bottom Card (Column 1-2, Row 3) ─────── */}
          {(() => {
            const role = ROLES[3];
            const isSel = selectedRole === role.id;
            return (
              <div
                data-role={role.id}
                className={`sb2-card sb2-card--institution${isSel ? ' selected' : ''}`}
                role="radio"
                aria-checked={isSel}
                tabIndex={0}
                onClick={() => pick(role.id)}
                onKeyDown={(e) => keyPick(e, role.id)}
              >
                <div className="sb2-inst-content">
                  <div className="sb2-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">{role.icon}</span>
                  </div>

                  <div className="sb2-inst-text">
                    <span className="sb2-label">{role.label}</span>
                    <h2 className="sb2-title">{role.title}</h2>
                    <p className="sb2-desc">{role.desc}</p>
                    <div className="sb2-inst-tags">
                      <span className="sb2-inst-tag">Campus Readiness</span>
                      <span className="sb2-inst-tag">Placement Analytics</span>
                      <span className="sb2-inst-tag">Department Management</span>
                    </div>
                  </div>

                  <div className="sb2-check" aria-hidden="true">
                    <CheckMark checked={isSel} />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Sign in row — preserved */}
        <p className="sb2-signin-row">
          Already have an account?
          <Link href="/login" className="sb2-signin-link">Sign In →</Link>
        </p>
      </main>

      {/* ── Floating CTA Bar — only when a role is selected ── */}
      {selected && (
        <div
          className="sb2-cta-bar"
          role="status"
          aria-live="polite"
          aria-label={`Selected role: ${selected.title}. Continue to proceed.`}
        >
          <div className="sb2-cta-info">
            <span className={`sb2-cta-dot sb2-cta-dot--${selected.id}`} aria-hidden="true" />
            <div>
              <span className="sb2-cta-label">Ready to join as</span>
              <span className="sb2-cta-name">{selected.title}</span>
            </div>
          </div>

          <button
            type="button"
            className={`sb2-cta-btn sb2-cta-btn--${selected.id}`}
            onClick={handleContinue}
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Footer — preserved ── */}
      <footer className="sb2-footer">
        <span>© 2026 SkillBridge</span>
        <nav className="sb2-footer-links" aria-label="Footer links">
          <Link href="/privacy" className="sb2-footer-link">Privacy</Link>
          <span className="sb2-footer-sep" aria-hidden="true">·</span>
          <Link href="/terms" className="sb2-footer-link">Terms</Link>
          <span className="sb2-footer-sep" aria-hidden="true">·</span>
          <Link href="/accessibility" className="sb2-footer-link">Accessibility</Link>
        </nav>
      </footer>
    </div>
  );
}

/* =============================================================================
   Page Export with Suspense Wrapper
============================================================================= */
export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f4f7fc' }} />}>
      <RoleSelectionContent />
    </Suspense>
  );
}
