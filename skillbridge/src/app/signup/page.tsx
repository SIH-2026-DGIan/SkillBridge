'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setSession, type UserRole } from '@/lib/user-session';
import LangSelector, { useLang } from '@/components/LangSelector';

/* ── Shared auth styles (same as role page) ──────────────────────────────── */
const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.auth-root {
  font-family: 'Inter','Segoe UI',system-ui,sans-serif;
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
.auth-back-link {
  font-size:14px; font-weight:500; color:#2563EB; text-decoration:none; transition:opacity 0.15s;
}
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
.auth-eyebrow-dot {
  width:6px; height:6px; border-radius:50%; background:#2563EB; animation:auth-pulse 2s infinite;
}
@keyframes auth-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.auth-h1 { font-size:28px; font-weight:700; color:#111827; margin:0 0 8px; letter-spacing:-0.5px; line-height:1.2; }
.auth-sub { font-size:15px; color:#475569; margin:0 0 28px; line-height:1.6; }
/* Card */
.auth-card {
  background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:32px;
  box-shadow:0 4px 24px rgba(0,0,0,.05);
}
/* Role pill */
.role-pill {
  display:inline-flex; align-items:center; gap:6px;
  background:#EFF6FF; border:1px solid #BFDBFE; color:#2563EB;
  border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600;
  margin-bottom:20px;
}
/* Field */
.sb-field { margin-bottom:16px; }
.sb-label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:6px; }
.sb-input-wrap { position:relative; }
.sb-input-icon {
  position:absolute; left:13px; top:50%; transform:translateY(-50%);
  color:#9CA3AF; display:flex; align-items:center; pointer-events:none;
}
.sb-input {
  width:100%; height:46px; border:1.5px solid #E2E8F0; border-radius:10px;
  padding:0 44px 0 42px; font-size:14px; font-family:inherit; color:#111827;
  background:#F8FAFC; transition:border-color 0.15s,box-shadow 0.15s,background 0.15s;
  outline:none; box-sizing:border-box;
}
.sb-input::placeholder { color:#9CA3AF; }
.sb-input:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sb-input.error { border-color:#DC2626; background:#FEF2F2; }
.sb-input.error:focus { box-shadow:0 0 0 3px rgba(220,38,38,.1); }
.sb-input.ok { border-color:#059669; }
.sb-input-right {
  position:absolute; right:0; top:0; height:100%; width:44px;
  display:flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer; color:#9CA3AF; transition:color 0.15s;
}
.sb-input-right:hover { color:#374151; }
.sb-error { font-size:12px; color:#DC2626; margin-top:5px; display:flex; align-items:center; gap:4px; }
/* Password strength */
.pw-reqs { margin-top:8px; display:flex; flex-direction:column; gap:4px; }
.pw-req { display:flex; align-items:center; gap:6px; font-size:12px; color:#94A3B8; transition:color 0.15s; }
.pw-req.met { color:#059669; }
/* Checkbox */
.sb-checkbox-row { display:flex; align-items:flex-start; gap:10px; margin-bottom:20px; margin-top:4px; }
.sb-checkbox-row input[type="checkbox"] {
  width:16px; height:16px; accent-color:#2563EB; cursor:pointer; flex-shrink:0; margin-top:2px;
}
.sb-checkbox-label { font-size:13px; color:#475569; line-height:1.5; }
.sb-checkbox-label a { color:#2563EB; text-decoration:none; }
.sb-checkbox-label a:hover { text-decoration:underline; }
/* Buttons */
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
.sb-spinner {
  width:18px; height:18px; border:2px solid rgba(255,255,255,.35);
  border-top-color:#fff; border-radius:50%; animation:auth-spin 0.7s linear infinite;
}
@keyframes auth-spin { to{transform:rotate(360deg)} }
/* Divider */
.sb-divider { display:flex; align-items:center; gap:12px; margin:22px 0; }
.sb-divider-line { flex:1; height:1px; background:#E2E8F0; }
.sb-divider-text { font-size:11px; font-weight:700; letter-spacing:0.08em; color:#94A3B8; white-space:nowrap; }
.sb-btn-google {
  width:100%; height:46px; background:#fff; color:#374151; border:1.5px solid #E2E8F0;
  border-radius:10px; font-size:14px; font-weight:500; font-family:inherit; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:10px;
  transition:background 0.15s,border-color 0.15s;
}
.sb-btn-google:hover { background:#F8FAFC; border-color:#CBD5E1; }
/* Footer */
.auth-footer {
  padding:14px 24px; font-size:12px; color:#94A3B8; border-top:1px solid #E2E8F0;
  background:#fff; display:flex; align-items:center; justify-content:space-between;
  gap:16px; flex-wrap:wrap;
}
.auth-footer-links { display:flex; align-items:center; gap:16px; }
.auth-footer-link { color:#94A3B8; text-decoration:none; font-size:12px; transition:color 0.15s; }
.auth-footer-link:hover { color:#475569; }
.auth-footer-sep { color:#E2E8F0; user-select:none; }
@media(max-width:520px){
  .auth-h1{font-size:22px;}
  .auth-card{padding:24px 18px;}
  .auth-header{padding:0 16px;}
  .auth-stepper{display:none;}
  .auth-footer{flex-direction:column;gap:8px;text-align:center;}
}
`;

const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  industry: 'Industry Partner',
  academician: 'Faculty Mentor',
  institution: 'College / TPO',
};

/* ── Helper: inline icon ─── */
const Icon = ({ name, size = 18 }: { name: string; size?: number }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">{name}</span>
);

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') || 'student') as UserRole;

  const [lang, setLang] = useLang();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // touched flags
  const [t_name, setTname] = useState(false);
  const [t_email, setTemail] = useState(false);
  const [t_mobile, setTmobile] = useState(false);
  const [t_pw, setTpw] = useState(false);
  const [t_confirm, setTconfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  // Validation
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validMobile = /^(\+91[\s-]?)?[6-9]\d{9}$/.test(mobile.replace(/\s/g, ''));
  const pwReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const validPw = Object.values(pwReqs).every(Boolean);
  const validConfirm = confirm === password && confirm.length > 0;

  const showPwReqs = t_pw || password.length > 0;

  const err_name   = (submitted || t_name)   && fullName.trim().length < 2;
  const err_email  = (submitted || t_email)  && !validEmail;
  const err_mobile = (submitted || t_mobile) && !validMobile;
  const err_pw     = (submitted || t_pw)     && !validPw && password.length > 0;
  const err_confirm = (submitted || t_confirm) && !validConfirm && confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fullName.trim() || !validEmail || !validMobile || !validPw || !validConfirm || !agreed) return;
    setLoading(true);
    try {
      // Try Supabase if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== 'your_supabase_project_url') {
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data } = await supabase.auth.signUp({ email, password, options: { data: { role } } });
          if (data?.user) {
            await supabase.from('profiles').insert({ user_id: data.user.id, role, name: fullName });
          }
        } catch { /* fallback */ }
      }
      setSession({ id: `user-${Date.now()}`, name: fullName, email, role, onboardingStep: 1 });
      router.push('/verify');
    } catch {
      // silent fallback
    } finally {
      setLoading(false);
    }
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
              { label: 'Role', step: '01', state: 'done' },
              { label: 'Account', step: '02', state: 'active' },
              { label: 'Verify', step: '03', state: '' },
              { label: 'Profile', step: '04', state: '' },
            ].map(({ label, step, state }, i) => (
              <span key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span className="auth-step-sep" aria-hidden="true" />}
                <span className={`auth-step ${state}`}>
                  <span className="auth-step-num">
                    {state === 'done' ? <Icon name="check" size={10} /> : step}
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
            CREATE ACCOUNT
          </div>
          <h1 className="auth-h1">Create your SkillBridge account</h1>
          <p className="auth-sub">
            You&rsquo;re joining as{' '}
            <span style={{ fontWeight: 600, color: '#111827' }}>{ROLE_LABELS[role] || 'Student'}</span>.
          </p>

          <div className="auth-card">
            {/* Role pill */}
            <div className="role-pill" aria-label="Selected role">
              <Icon name={role === 'student' ? 'school' : role === 'industry' ? 'business_center' : role === 'academician' ? 'menu_book' : 'account_balance'} size={13} />
              {ROLE_LABELS[role]}
              <Link href="/role?type=signup" style={{ color: '#2563EB', fontSize: 11, marginLeft: 4, textDecoration: 'none', opacity: 0.75 }}>Change</Link>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="fullName">Full Name</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="person" /></span>
                  <input
                    id="fullName" type="text" autoComplete="name"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); if (submitted) setTname(true); }}
                    onBlur={() => setTname(true)}
                    className={`sb-input${err_name ? ' error' : fullName.trim().length >= 2 ? ' ok' : ''}`}
                    aria-invalid={err_name} aria-describedby={err_name ? 'err-name' : undefined}
                  />
                </div>
                {err_name && <p className="sb-error" id="err-name" role="alert"><Icon name="error" size={13} />Please enter your full name.</p>}
              </div>

              {/* Email */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="email">Email Address</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="mail" /></span>
                  <input
                    id="email" type="email" autoComplete="email"
                    placeholder="you@example.com"
                    ref={emailRef}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (submitted) setTemail(true); }}
                    onBlur={() => setTemail(true)}
                    className={`sb-input${err_email ? ' error' : validEmail ? ' ok' : ''}`}
                    aria-invalid={err_email} aria-describedby={err_email ? 'err-email' : undefined}
                  />
                  {validEmail && (
                    <span className="sb-input-right" style={{ pointerEvents: 'none' }}>
                      <Icon name="check_circle" size={18} />
                    </span>
                  )}
                </div>
                {err_email && <p className="sb-error" id="err-email" role="alert"><Icon name="error" size={13} />Please enter a valid email address.</p>}
              </div>

              {/* Mobile */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="mobile">Mobile Number</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="phone" /></span>
                  <input
                    id="mobile" type="tel" autoComplete="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value); if (submitted) setTmobile(true); }}
                    onBlur={() => setTmobile(true)}
                    className={`sb-input${err_mobile ? ' error' : validMobile ? ' ok' : ''}`}
                    aria-invalid={err_mobile} aria-describedby={err_mobile ? 'err-mobile' : undefined}
                  />
                </div>
                {err_mobile && <p className="sb-error" id="err-mobile" role="alert"><Icon name="error" size={13} />Enter a valid Indian mobile number (+91 or 10-digit).</p>}
              </div>

              {/* Password */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="password">Password</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="lock" /></span>
                  <input
                    id="password" type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    ref={pwRef}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (submitted) setTpw(true); }}
                    onBlur={() => setTpw(true)}
                    className={`sb-input${err_pw ? ' error' : validPw ? ' ok' : ''}`}
                    aria-invalid={err_pw}
                  />
                  <button type="button" className="sb-input-right" onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    <Icon name={showPw ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>

                {/* Strength checklist */}
                {showPwReqs && (
                  <ul className="pw-reqs" aria-label="Password requirements">
                    {([
                      { key: 'length', label: '8+ characters' },
                      { key: 'upper',  label: 'Uppercase letter' },
                      { key: 'number', label: 'Number' },
                      { key: 'special', label: 'Special character' },
                    ] as const).map(({ key, label }) => (
                      <li key={key} className={`pw-req ${pwReqs[key] ? 'met' : ''}`}>
                        <Icon name={pwReqs[key] ? 'check_circle' : 'radio_button_unchecked'} size={13} />
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm Password */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="confirm">Confirm Password</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="lock_reset" /></span>
                  <input
                    id="confirm" type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    ref={confirmRef}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); if (submitted) setTconfirm(true); }}
                    onBlur={() => setTconfirm(true)}
                    className={`sb-input${err_confirm ? ' error' : validConfirm ? ' ok' : ''}`}
                    aria-invalid={err_confirm} aria-describedby={err_confirm ? 'err-confirm' : undefined}
                  />
                  <button type="button" className="sb-input-right" onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    <Icon name={showConfirm ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
                {err_confirm && <p className="sb-error" id="err-confirm" role="alert"><Icon name="error" size={13} />Passwords do not match.</p>}
                {validConfirm && <p style={{ fontSize: 12, color: '#059669', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="check_circle" size={13} />Passwords match</p>}
              </div>

              {/* Terms */}
              <div className="sb-checkbox-row">
                <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
                <label htmlFor="agree" className="sb-checkbox-label">
                  I agree to the{' '}
                  <Link href="/terms">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy">Privacy Policy</Link>.
                </label>
              </div>
              {submitted && !agreed && (
                <p className="sb-error" style={{ marginBottom: 12, marginTop: -8 }} role="alert">
                  <Icon name="error" size={13} />You must accept the Terms to continue.
                </p>
              )}

              <button type="submit" className="auth-btn-primary" disabled={loading} aria-label="Create account">
                {loading ? <><span className="sb-spinner" /><span>Creating account…</span></> : <>Create Account <span aria-hidden="true">→</span></>}
              </button>
            </form>

            {/* Divider + Google */}
            <div className="sb-divider" aria-hidden="true">
              <span className="sb-divider-line" />
              <span className="sb-divider-text">OR CONTINUE WITH</span>
              <span className="sb-divider-line" />
            </div>
            <button type="button" className="sb-btn-google" aria-label="Sign up with Google">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign-in link */}
            <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#475569' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F8FAFC' }} />}>
      <SignupContent />
    </Suspense>
  );
}
