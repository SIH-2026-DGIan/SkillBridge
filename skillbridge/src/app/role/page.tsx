'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LangSelector, { useLang } from '@/components/LangSelector';

/* ── Shared auth CSS (injected once per page) ─────────────────────────────── */
const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.auth-root {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: #F8FAFC;
  color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
/* ── Header ── */
.auth-header {
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 10px; font-weight: 700;
}
.auth-step.done .auth-step-num {
  background: #059669; border-color: #059669; color: #fff;
}
.auth-step.active .auth-step-num {
  background: #2563EB; border-color: #2563EB; color: #fff;
}
.auth-step-sep {
  width: 28px; height: 1px; background: #E2E8F0; margin: 0 6px;
}
/* ── Main ── */
.auth-main {
  flex: 1; display: flex; align-items: flex-start;
  justify-content: center; padding: 48px 24px 64px;
}
.auth-center { width: 100%; max-width: 640px; }
.auth-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  color: #2563EB; margin-bottom: 12px;
}
.auth-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #2563EB;
  animation: auth-pulse 2s infinite;
}
@keyframes auth-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.auth-h1 {
  font-size: 30px; font-weight: 700; color: #111827;
  margin: 0 0 8px; letter-spacing: -0.5px; line-height: 1.2;
}
.auth-sub {
  font-size: 15px; color: #475569; margin: 0 0 36px; line-height: 1.6;
}
/* ── Role 2×2 grid ── */
.role-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  margin-bottom: 28px;
}
.role-card {
  background: #fff; border: 2px solid #E2E8F0; border-radius: 14px;
  padding: 22px 20px; cursor: pointer; text-align: left;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  position: relative;
}
.role-card:hover {
  border-color: #93C5FD;
  box-shadow: 0 0 0 3px rgba(37,99,235,.07);
}
.role-card.selected {
  border-color: #2563EB;
  background: #EFF6FF;
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}
.role-card-check {
  position: absolute; top: 14px; right: 14px;
  width: 22px; height: 22px; border-radius: 50%;
  background: #E2E8F0; display: flex; align-items: center;
  justify-content: center; transition: background 0.18s;
}
.role-card.selected .role-card-check {
  background: #2563EB;
}
.role-card-check svg { width: 12px; height: 12px; }
.role-icon {
  width: 42px; height: 42px; border-radius: 10px; background: #F1F5F9;
  display: flex; align-items: center; justify-content: center;
  color: #475569; margin-bottom: 14px; transition: background 0.18s, color 0.18s;
}
.role-card.selected .role-icon {
  background: #DBEAFE; color: #2563EB;
}
.role-card-title {
  font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 6px;
}
.role-card-subtitle {
  font-size: 11px; font-weight: 600; color: #2563EB;
  letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px;
}
.role-card-desc { font-size: 13px; color: #475569; line-height: 1.5; }
/* ── CTA row ── */
.role-cta-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 24px; background: #fff; border: 1px solid #E2E8F0;
  border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.04);
}
.role-cta-selected {
  font-size: 14px; color: #475569;
}
.role-cta-selected strong { color: #111827; font-weight: 600; }
.auth-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #2563EB; color: #fff; border: none; border-radius: 10px;
  padding: 12px 24px; font-size: 15px; font-weight: 600;
  font-family: inherit; cursor: pointer; white-space: nowrap;
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(37,99,235,.3);
}
.auth-btn-primary:hover { background: #1D4ED8; box-shadow: 0 4px 12px rgba(37,99,235,.4); }
.auth-btn-primary:active { transform: scale(0.985); }
/* ── Footer ── */
.auth-footer {
  padding: 14px 24px; font-size: 12px; color: #94A3B8;
  border-top: 1px solid #E2E8F0; background: #fff;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.auth-footer-links { display: flex; align-items: center; gap: 16px; }
.auth-footer-link {
  color: #94A3B8; text-decoration: none; font-size: 12px; transition: color 0.15s;
}
.auth-footer-link:hover { color: #475569; }
.auth-footer-sep { color: #E2E8F0; user-select: none; }
/* ── Responsive ── */
@media (max-width: 540px) {
  .auth-h1 { font-size: 22px; }
  .role-grid { grid-template-columns: 1fr; }
  .role-cta-row { flex-direction: column; align-items: stretch; }
  .auth-btn-primary { justify-content: center; }
  .auth-header { padding: 0 16px; }
  .auth-stepper { display: none; }
  .auth-footer { flex-direction: column; gap: 8px; text-align: center; }
}
`;

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
    desc: 'Track skill development, internships and placement readiness.',
    icon: 'account_balance',
  },
];

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState('student');
  const [lang, setLang] = useLang();

  const actionType = searchParams.get('type') || 'signup';

  const handleContinue = () => router.push(`/${actionType}?role=${selectedRole}`);
  const selected = ROLES.find((r) => r.id === selectedRole)!;

  return (
    <div className="auth-root">
      <style>{AUTH_CSS}</style>

      {/* Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority />
        </Link>
        <div className="auth-header-right">
          {/* Progress stepper */}
          <nav className="auth-stepper" aria-label="Sign-up progress">
            {(['01 Role', '02 Account', '03 Verify', '04 Profile'] as const).map((step, i) => (
              <span key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span className="auth-step-sep" aria-hidden="true" />}
                <span className={`auth-step ${i === 0 ? 'active' : ''}`}>
                  <span className="auth-step-num">{i === 0 ? '01' : `0${i + 1}`}</span>
                  <span>{step.slice(3)}</span>
                </span>
              </span>
            ))}
          </nav>
          <LangSelector lang={lang} setLang={setLang} />
          <Link href="/" className="auth-back-link">Back to SkillBridge</Link>
        </div>
      </header>

      {/* Main */}
      <main className="auth-main">
        <div className="auth-center">
          <div className="auth-eyebrow">
            <span className="auth-eyebrow-dot" aria-hidden="true" />
            GET STARTED
          </div>
          <h1 className="auth-h1">What brings you to SkillBridge?</h1>
          <p className="auth-sub">Choose your role to personalise your experience.</p>

          {/* 2×2 role grid */}
          <div className="role-grid" role="radiogroup" aria-label="Select your role">
            {ROLES.map((role) => (
              <div
                key={role.id}
                className={`role-card${selectedRole === role.id ? ' selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                role="radio"
                aria-checked={selectedRole === role.id}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedRole(role.id)}
              >
                {/* Check badge */}
                <div className="role-card-check" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={selectedRole === role.id ? '#fff' : '#94A3B8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Icon */}
                <div className="role-icon" aria-hidden="true">
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{role.icon}</span>
                </div>

                <p className="role-card-subtitle">{role.label}</p>
                <h2 className="role-card-title">{role.title}</h2>
                <p className="role-card-desc">{role.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="role-cta-row">
            <p className="role-cta-selected">
              Selected: <strong>{selected.title}</strong>
            </p>
            <button type="button" className="auth-btn-primary" onClick={handleContinue}>
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Already have account */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#475569' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Sign In →
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <span>© 2026 SkillBridge</span>
        <nav className="auth-footer-links" aria-label="Footer links">
          <Link href="/privacy" className="auth-footer-link">Privacy</Link>
          <span className="auth-footer-sep" aria-hidden="true">·</span>
          <Link href="/terms" className="auth-footer-link">Terms</Link>
          <span className="auth-footer-sep" aria-hidden="true">·</span>
          <Link href="/accessibility" className="auth-footer-link">Accessibility</Link>
        </nav>
      </footer>
    </div>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F8FAFC' }} />}>
      <RoleSelectionContent />
    </Suspense>
  );
}
