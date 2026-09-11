'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LangSelector, { useLang } from '@/components/LangSelector';
import { getSession } from '@/lib/user-session';

/* ── Shared auth styles ──────────────────────────────────────────────────── */
const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.auth-root {
  font-family:'Inter','Segoe UI',system-ui,sans-serif;
  background:#F8FAFC; color:#111827; min-height:100vh; display:flex; flex-direction:column;
}
.auth-header {
  background:#fff; border-bottom:1px solid #E2E8F0; height:64px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 24px; position:sticky; top:0; z-index:50;
}
.auth-logo { display:flex; align-items:center; text-decoration:none; }
.auth-logo img { height:48px; width:auto; object-fit:contain; transform:scale(3); transform-origin:left center; }
.auth-header-right { display:flex; align-items:center; gap:20px; }
.auth-lang-toggle { display:flex; background:#F1F5F9; border-radius:8px; padding:2px; }
.auth-lang-btn {
  padding:4px 12px; border-radius:6px; border:none; background:transparent;
  font-size:13px; font-weight:500; color:#64748B; cursor:pointer;
  font-family:inherit; transition:all 0.15s;
}
.auth-lang-btn.active { background:#fff; color:#111827; box-shadow:0 1px 3px rgba(0,0,0,.08); }
.auth-back-link { font-size:14px; font-weight:500; color:#2563EB; text-decoration:none; transition:opacity 0.15s; }
.auth-back-link:hover { opacity:0.75; }
/* Stepper */
.auth-stepper { display:flex; align-items:center; gap:0; font-size:11px; font-weight:600; letter-spacing:0.04em; }
.auth-step { display:flex; align-items:center; gap:6px; color:#CBD5E1; }
.auth-step.active { color:#2563EB; }
.auth-step.done { color:#059669; }
.auth-step-num {
  width:22px; height:22px; border-radius:50%; border:1.5px solid currentColor;
  display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;
}
.auth-step.done .auth-step-num { background:#059669; border-color:#059669; color:#fff; }
.auth-step.active .auth-step-num { background:#2563EB; border-color:#2563EB; color:#fff; }
.auth-step-sep { width:28px; height:1px; background:#E2E8F0; margin:0 6px; }
/* Main */
.auth-main { flex:1; display:flex; align-items:flex-start; justify-content:center; padding:48px 24px 64px; }
.auth-center { width:100%; max-width:480px; }
.auth-eyebrow {
  display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700;
  letter-spacing:0.1em; color:#2563EB; margin-bottom:12px;
}
.auth-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#2563EB; animation:auth-pulse 2s infinite; }
@keyframes auth-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.auth-h1 { font-size:28px; font-weight:700; color:#111827; margin:0 0 8px; letter-spacing:-0.5px; line-height:1.2; }
.auth-sub { font-size:15px; color:#475569; margin:0 0 28px; line-height:1.6; }
/* Card */
.auth-card {
  background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:32px;
  box-shadow:0 4px 24px rgba(0,0,0,.05);
}
/* Mobile tile */
.mobile-tile {
  display:flex; align-items:center; gap:14px; background:#F8FAFC;
  border:1px solid #E2E8F0; border-radius:10px; padding:14px 16px; margin-bottom:28px;
}
.mobile-tile-icon {
  width:36px; height:36px; border-radius:8px; background:#EFF6FF;
  display:flex; align-items:center; justify-content:center; color:#2563EB; flex-shrink:0;
}
.mobile-tile-label { font-size:11px; color:#94A3B8; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; }
.mobile-tile-number { font-size:16px; font-weight:700; color:#111827; letter-spacing:0.05em; }
/* OTP inputs */
.otp-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-bottom:24px; }
.otp-input {
  width:100%; aspect-ratio:1; text-align:center; font-size:22px; font-weight:700;
  color:#111827; background:#F8FAFC; border:2px solid #E2E8F0; border-radius:10px;
  font-family:inherit; transition:border-color 0.15s,box-shadow 0.15s,background 0.15s;
  outline:none; caret-color:#2563EB;
}
.otp-input:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.otp-input.filled { border-color:#2563EB; background:#EFF6FF; }
.otp-input.verified { border-color:#059669; background:#ECFDF5; color:#059669; }
.otp-input:disabled { opacity:0.6; cursor:not-allowed; }
/* Resend row */
.otp-resend-row { display:flex; align-items:center; justify-content:space-between; margin-top:18px; gap:12px; }
.otp-resend-text { font-size:13px; color:#64748B; }
.otp-resend-btn { font-size:13px; font-weight:600; color:#2563EB; background:none; border:none; cursor:pointer; font-family:inherit; }
.otp-resend-btn:hover { text-decoration:underline; }
/* Demo hint */
.demo-hint {
  background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px;
  padding:14px 16px; margin-bottom:24px; display:flex; align-items:flex-start; gap:10px;
}
.demo-hint-icon { color:#D97706; flex-shrink:0; margin-top:1px; }
.demo-hint-text { font-size:13px; color:#92400E; line-height:1.5; }
.demo-hint-code {
  display:inline-block; background:#FEF3C7; border:1px solid #FDE68A;
  border-radius:4px; padding:1px 7px; font-family:monospace; font-weight:700;
  color:#B45309; font-size:13px; letter-spacing:0.1em;
}
/* Primary button */
.auth-btn-primary {
  width:100%; height:48px; background:#2563EB; color:#fff; border:none;
  border-radius:10px; font-size:15px; font-weight:600; font-family:inherit;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
  transition:background 0.15s,box-shadow 0.15s,transform 0.1s;
  box-shadow:0 2px 8px rgba(37,99,235,.3);
}
.auth-btn-primary:hover:not(:disabled) { background:#1D4ED8; box-shadow:0 4px 12px rgba(37,99,235,.4); }
.auth-btn-primary:active:not(:disabled) { transform:scale(0.985); }
.auth-btn-primary:disabled { opacity:0.65; cursor:not-allowed; }
.auth-btn-success {
  width:100%; height:48px; background:#059669; color:#fff; border:none;
  border-radius:10px; font-size:15px; font-weight:600; font-family:inherit;
  display:flex; align-items:center; justify-content:center; gap:8px;
  box-shadow:0 2px 8px rgba(5,150,105,.3);
}
.sb-spinner {
  width:18px; height:18px; border:2px solid rgba(255,255,255,.35);
  border-top-color:#fff; border-radius:50%; animation:auth-spin 0.7s linear infinite;
}
@keyframes auth-spin { to{transform:rotate(360deg)} }
/* Footer */
.auth-footer {
  padding:14px 24px; font-size:12px; color:#94A3B8; border-top:1px solid #E2E8F0;
  background:#fff; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
}
.auth-footer-links { display:flex; align-items:center; gap:16px; }
.auth-footer-link { color:#94A3B8; text-decoration:none; font-size:12px; transition:color 0.15s; }
.auth-footer-link:hover { color:#475569; }
.auth-footer-sep { color:#E2E8F0; user-select:none; }
@media(max-width:520px){
  .auth-h1{font-size:22px;} .auth-card{padding:24px 18px;}
  .auth-header{padding:0 16px;} .auth-stepper{display:none;}
  .auth-footer{flex-direction:column;gap:8px;text-align:center;}
  .otp-grid{gap:6px;} .otp-input{font-size:18px;}
}
`;

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">{name}</span>
);

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useLang();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const otpString = otp.join('');
  const isComplete = otpString.length === 6;

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    setError('');
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = digits[i] ?? '';
    setOtp(next);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) { setError('Please enter all 6 digits.'); return; }
    // Demo: accept 123456; real: validate against backend
    if (otpString !== '123456') { setError('Incorrect code. Please try again.'); return; }
    setVerifying(true);
   setTimeout(() => {
  setVerified(true);
  setTimeout(() => {
    const session = getSession();
    const role = session?.role || 'student';

    // Industry recruiters must complete company onboarding first
    if (role === 'industry' && !session.isProfileComplete) {
      router.push('/industry/onboarding');
      return;
    }
const dashboardMap: Record<string, string> = {
  student: '/student/dashboard',
  industry: '/industry/dashboard',
  academician: '/academician/dashboard',

  // Institution must complete details before the dashboard
  institution: '/institution/details',
};
    router.push(dashboardMap[role] ?? '/student/dashboard');
  }, 900);
}, 1200);
  };

  const resend = () => {
    setTimeLeft(45);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="auth-root">
      <style>{AUTH_CSS}</style>

      {/* Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority />
        </Link>
        <div className="auth-header-right">
          <nav className="auth-stepper" aria-label="Sign-up progress">
            {[
              { label: 'Role', state: 'done' },
              { label: 'Account', state: 'done' },
              { label: 'Verify', state: 'active' },
              { label: 'Profile', state: '' },
            ].map(({ label, state }, i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span className="auth-step-sep" aria-hidden="true" />}
                <span className={`auth-step ${state}`}>
                  <span className="auth-step-num">
                    {state === 'done' ? <Icon name="check" size={10} /> : `0${i + 1}`}
                  </span>
                  <span>{label}</span>
                </span>
              </span>
            ))}
          </nav>
          <LangSelector lang={lang} setLang={setLang} />
          <Link href="/" className="auth-back-link">Back to SkillBridge</Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-center">
          <div className="auth-eyebrow">
            <span className="auth-eyebrow-dot" aria-hidden="true" />
            {lang === 'hi' ? 'खाता सत्यापन' : 'ACCOUNT VERIFICATION'}
          </div>
          <h1 className="auth-h1">
            {lang === 'hi' ? 'अपने खाते को सत्यापित करें' : 'Verify your account'}
          </h1>
          <p className="auth-sub">
            {lang === 'hi'
              ? 'आपके पंजीकृत मोबाइल नंबर पर भेजा गया 6-अंकीय कोड दर्ज करें।'
              : 'Enter the 6-digit code sent to your registered mobile number.'}
          </p>

          <div className="auth-card">
            {/* Mobile tile */}
            <div className="mobile-tile">
              <div className="mobile-tile-icon" aria-hidden="true">
                <Icon name="phone_android" />
              </div>
              <div>
                <p className="mobile-tile-label">Sent to</p>
                <p className="mobile-tile-number">+91 98765 •••••</p>
              </div>
            </div>

            {/* SIH demo hint */}
            <div className="demo-hint" role="note" aria-label="SIH demo information">
              <span className="demo-hint-icon"><Icon name="info" size={16} /></span>
              <p className="demo-hint-text">
                <strong>SIH 2026 Demo:</strong> Use code{' '}
                <span className="demo-hint-code">123456</span> to skip verification and access any dashboard.
              </p>
            </div>

            <form onSubmit={handleVerify} noValidate>
              {/* OTP inputs */}
              <div
                className="otp-grid"
                role="group"
                aria-label="6-digit verification code"
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    disabled={verifying || verified}
                    className={`otp-input${verified ? ' verified' : digit ? ' filled' : ''}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {/* Inline error */}
              {error && (
                <p style={{ fontSize: 13, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }} role="alert">
                  <Icon name="error" size={14} />{error}
                </p>
              )}

              {/* Submit */}
              {verified ? (
                <div className="auth-btn-success">
                  <Icon name="check_circle" />
                  Verified! Redirecting…
                </div>
              ) : (
                <button type="submit" className="auth-btn-primary" disabled={verifying || !isComplete}>
                  {verifying
                    ? <><span className="sb-spinner" /><span>Verifying…</span></>
                    : <>{lang === 'hi' ? 'सत्यापित करें और जारी रखें' : 'Verify & Continue'} <span aria-hidden="true">→</span></>
                  }
                </button>
              )}

              {/* Resend row */}
              <div className="otp-resend-row">
                <p className="otp-resend-text">
                  {lang === 'hi' ? 'कोड नहीं मिला?' : "Didn't receive the code?"}
                </p>
                {timeLeft > 0 ? (
                  <span className="otp-resend-text">
                    Resend in <strong style={{ color: '#111827' }}>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</strong>
                  </span>
                ) : (
                  <button type="button" className="otp-resend-btn" onClick={resend}>
                    {lang === 'hi' ? 'पुनः भेजें' : 'Resend Code'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

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

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
