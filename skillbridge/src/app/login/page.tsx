'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LangSelector, { useLang } from '@/components/LangSelector';
import { setSession, getSession } from '@/lib/user-session';

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useLang();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Indian mobile: optional +91, then 10 digits starting with 6-9
    const mobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

    const trimmed = identifier.trim();
    if (!trimmed) {
      newErrors.identifier = 'Email or mobile number is required.';
    } else if (!emailRegex.test(trimmed) && !mobileRegex.test(trimmed.replace(/\s/g, ''))) {
      newErrors.identifier = 'Enter a valid email address or Indian mobile number.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Auth submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const id = identifier.toLowerCase();
      const isEmail = id.includes('@');
      
      setSession({
        email: isEmail ? id : '',
        phone: !isEmail ? id : '',
      });

      if (id.includes('industry')) {
        router.push('/industry/dashboard');
      } else if (id.includes('faculty')) {
        router.push('/academician/dashboard');
      } else if (id.includes('institution')) {
        router.push('/institution/dashboard');
      } else {
        const session = getSession();
        if (!session.isProfileComplete) {
          router.push('/student/onboarding');
        } else {
          router.push('/student/dashboard');
        }
      }
    }, 1200);
  };


  const handleGoogleSSO = () => {
    showToast('Redirecting to Google Sign-In…');
  };

  // ── Labels (i18n) ────────────────────────────────────────────────────────────
  const t = {
    eyebrow: lang === 'en' ? 'SECURE ACCESS' : 'सुरक्षित एक्सेस',
    heading: lang === 'en' ? 'Welcome back to SkillBridge' : 'SkillBridge में वापस स्वागत है',
    subheading:
      lang === 'en'
        ? 'Sign in to continue your journey from skills to opportunities.'
        : 'कौशल से अवसरों तक अपनी यात्रा जारी रखने के लिए साइन इन करें।',
    emailLabel: lang === 'en' ? 'Email or Mobile Number' : 'ईमेल या मोबाइल नंबर',
    emailPlaceholder:
      lang === 'en' ? 'you@example.com or +91 XXXXX XXXXX' : 'you@example.com या +91 XXXXX XXXXX',
    passwordLabel: lang === 'en' ? 'Password' : 'पासवर्ड',
    passwordPlaceholder: lang === 'en' ? 'Enter your password' : 'अपना पासवर्ड दर्ज करें',
    rememberMe: lang === 'en' ? 'Remember me' : 'मुझे याद रखें',
    forgotPassword: lang === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?',
    signIn: lang === 'en' ? 'Sign In' : 'साइन इन करें',
    signingIn: lang === 'en' ? 'Signing in…' : 'साइन इन हो रहा है…',
    orContinueWith: lang === 'en' ? 'OR CONTINUE WITH' : 'या इससे जारी रखें',
    googleBtn: lang === 'en' ? 'Continue with Google' : 'Google से जारी रखें',
    noAccount: lang === 'en' ? "Don't have an account?" : 'खाता नहीं है?',
    createAccount:
      lang === 'en' ? 'Create your SkillBridge account →' : 'अपना SkillBridge खाता बनाएं →',
    roleAware: lang === 'en' ? 'Your account is role-aware' : 'आपका खाता भूमिका-आधारित है',
    returnToSkillBridge: lang === 'en' ? 'Return to SkillBridge' : 'SkillBridge पर वापस जाएं',
  };

  return (
    <div
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
      className="min-h-screen flex flex-col"
    >
      {/* ── Global styles injected inline to avoid dependency on Tailwind variables ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .sb-login-root {
          background-color: #F8FAFC;
          color: #111827;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        /* Header */
        .sb-header {
          background: #ffffff;
          border-bottom: 1px solid #E2E8F0;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .sb-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .sb-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
          transform: scale(3);
          transform-origin: left center;
        }
        .sb-wordmark {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.3px;
        }
        .sb-header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        /* Language toggle */
        .sb-lang-toggle {
          display: flex;
          background: #F1F5F9;
          border-radius: 8px;
          padding: 2px;
        }
        .sb-lang-btn {
          padding: 4px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sb-lang-btn.active {
          background: #ffffff;
          color: #111827;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .sb-return-link {
          font-size: 14px;
          font-weight: 500;
          color: #2563EB;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .sb-return-link:hover { opacity: 0.75; }

        /* Main layout */
        .sb-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .sb-center-col {
          width: 100%;
          max-width: 480px;
        }
        /* Eyebrow */
        .sb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #2563EB;
          margin-bottom: 12px;
        }
        .sb-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2563EB;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .sb-heading {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .sb-subheading {
          font-size: 15px;
          color: #475569;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        /* Card */
        .sb-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }
        .sb-card-top-label {
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          text-align: right;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }

        /* Form fields */
        .sb-field {
          margin-bottom: 16px;
        }
        .sb-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .sb-input-wrap {
          position: relative;
        }
        .sb-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          display: flex;
          align-items: center;
          pointer-events: none;
          font-size: 18px;
        }
        .sb-input {
          width: 100%;
          height: 46px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 0 44px 0 42px;
          font-size: 14px;
          font-family: inherit;
          color: #111827;
          background: #F8FAFC;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
          box-sizing: border-box;
        }
        .sb-input::placeholder { color: #9CA3AF; }
        .sb-input:focus {
          border-color: #2563EB;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .sb-input.has-error {
          border-color: #EF4444;
          background: #FEF2F2;
        }
        .sb-input.has-error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        .sb-input-right-btn {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          transition: color 0.15s;
        }
        .sb-input-right-btn:hover { color: #374151; }
        .sb-error-msg {
          font-size: 12px;
          color: #EF4444;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Remember / forgot row */
        .sb-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .sb-remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }
        .sb-remember-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #2563EB;
          cursor: pointer;
          border-radius: 4px;
        }
        .sb-forgot-link {
          font-size: 13px;
          font-weight: 500;
          color: #2563EB;
          text-decoration: none;
        }
        .sb-forgot-link:hover { text-decoration: underline; }

        /* Primary button */
        .sb-btn-primary {
          width: 100%;
          height: 48px;
          background: #2563EB;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .sb-btn-primary:hover:not(:disabled) {
          background: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        .sb-btn-primary:active:not(:disabled) { transform: scale(0.985); }
        .sb-btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .sb-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .sb-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .sb-divider-line {
          flex: 1;
          height: 1px;
          background: #E2E8F0;
        }
        .sb-divider-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94A3B8;
          white-space: nowrap;
        }

        /* Google button */
        .sb-btn-google {
          width: 100%;
          height: 46px;
          background: #ffffff;
          color: #374151;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.15s, border-color 0.15s;
        }
        .sb-btn-google:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        /* Signup link */
        .sb-signup-row {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #475569;
        }
        .sb-signup-link {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
        }
        .sb-signup-link:hover { text-decoration: underline; }

        /* Demo sandbox */
        .sb-demo-box {
          margin-top: 28px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 22px 24px;
          background: #F8FAFC;
        }
        .sb-demo-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #2563EB;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sb-demo-heading {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }
        .sb-demo-desc {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 14px;
          line-height: 1.5;
        }
        .sb-demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .sb-demo-btn {
          background: #ffffff;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 11px 12px 10px;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .sb-demo-btn:hover {
          border-color: #2563EB;
          background: #EFF6FF;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }
        .sb-demo-btn:hover .sb-demo-arrow {
          color: #2563EB;
        }
        .sb-demo-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .sb-demo-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #EFF6FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563EB;
          flex-shrink: 0;
        }
        .sb-demo-arrow {
          color: #CBD5E1;
          transition: color 0.18s;
        }
        .sb-demo-role {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
        }
        .sb-demo-subrole {
          font-size: 11px;
          font-weight: 500;
          color: #475569;
          margin-bottom: 2px;
        }
        .sb-demo-email {
          font-size: 10.5px;
          color: #2563EB;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb-demo-card-desc {
          font-size: 10.5px;
          color: #94A3B8;
          line-height: 1.4;
        }
        .sb-demo-note {
          font-size: 11px;
          color: #94A3B8;
          margin-top: 12px;
          display: flex;
          align-items: flex-start;
          gap: 5px;
          line-height: 1.5;
        }

        /* Toast */
        .sb-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #1E293B;
          color: #F1F5F9;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          z-index: 100;
          transition: opacity 0.25s, transform 0.25s;
          max-width: 320px;
        }
        .sb-toast.hidden {
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
        }

        /* Footer */
        .sb-footer {
          padding: 14px 24px;
          font-size: 12px;
          color: #94A3B8;
          border-top: 1px solid #E2E8F0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sb-footer-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sb-footer-link {
          color: #94A3B8;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.15s;
        }
        .sb-footer-link:hover { color: #475569; }
        .sb-footer-sep {
          color: #E2E8F0;
          font-size: 12px;
          user-select: none;
        }

        @media (max-width: 520px) {
          .sb-card { padding: 24px 18px; }
          .sb-demo-box { padding: 18px 16px; }
          .sb-heading { font-size: 22px; }
          .sb-demo-grid { grid-template-columns: 1fr; }
          .sb-header { padding: 0 16px; }
          .sb-wordmark { font-size: 16px; }
          .sb-return-link { font-size: 13px; }
          .sb-footer { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>

      <div className="sb-login-root">
        {/* ── HEADER ─────────────────────────────────────────────────────────────── */}
        <header className="sb-header">
          <Link href="/" className="sb-logo-wrap">
            <Image
              src="/image.png"
              alt="SkillBridge"
              width={160}
              height={40}
              className="sb-logo-img"
              priority
            />
          </Link>

          <div className="sb-header-right">
            {/* Language toggle */}
            <LangSelector lang={lang} setLang={setLang} />

            <Link href="/" className="sb-return-link" aria-label="Return to SkillBridge homepage">
              {t.returnToSkillBridge}
            </Link>
          </div>
        </header>

        {/* ── MAIN ───────────────────────────────────────────────────────────────── */}
        <main className="sb-main">
          <div className="sb-center-col">
            {/* Eyebrow + heading */}
            <div className="sb-eyebrow">
              <span className="sb-eyebrow-dot" aria-hidden="true" />
              {t.eyebrow}
            </div>
            <h1 className="sb-heading">{t.heading}</h1>
            <p className="sb-subheading">{t.subheading}</p>

            {/* ── AUTH CARD ─────────────────────────────────────────────────────── */}
            <div className="sb-card">
              <p className="sb-card-top-label" aria-label="Account type information">
                {t.roleAware}
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Email / Mobile */}
                <div className="sb-field">
                  <label className="sb-label" htmlFor="identifier">
                    {t.emailLabel}
                  </label>
                  <div className="sb-input-wrap">
                    <span className="sb-input-icon" aria-hidden="true">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        person
                      </span>
                    </span>
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username email"
                      placeholder={t.emailPlaceholder}
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                      }}
                      className={`sb-input${errors.identifier ? ' has-error' : ''}`}
                      aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                      aria-invalid={!!errors.identifier}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="sb-error-msg" id="identifier-error" role="alert">
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
                      {errors.identifier}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="sb-field">
                  <label className="sb-label" htmlFor="password">
                    {t.passwordLabel}
                  </label>
                  <div className="sb-input-wrap">
                    <span className="sb-input-icon" aria-hidden="true">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        lock
                      </span>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      className={`sb-input${errors.password ? ' has-error' : ''}`}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      className="sb-input-right-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="sb-error-msg" id="password-error" role="alert">
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me + Forgot password */}
                <div className="sb-row">
                  <label className="sb-remember-label">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    {t.rememberMe}
                  </label>
                  <Link href="/forgot" className="sb-forgot-link">
                    {t.forgotPassword}
                  </Link>
                </div>

                {/* Sign In */}
                <button
                  type="submit"
                  className="sb-btn-primary"
                  disabled={loading}
                  aria-label="Sign in to SkillBridge"
                >
                  {loading ? (
                    <>
                      <span className="sb-spinner" aria-hidden="true" />
                      {t.signingIn}
                    </>
                  ) : (
                    <>
                      {t.signIn}
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="sb-divider" aria-hidden="true">
                <span className="sb-divider-line" />
                <span className="sb-divider-text">{t.orContinueWith}</span>
                <span className="sb-divider-line" />
              </div>

              {/* Google SSO */}
              <button
                type="button"
                className="sb-btn-google"
                onClick={handleGoogleSSO}
                aria-label="Continue with Google"
              >
                {/* Google G mark */}
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                {t.googleBtn}
              </button>

              {/* Sign up link */}
              <div className="sb-signup-row">
                <span style={{ color: '#475569' }}>
                  {lang === 'en' ? "New to SkillBridge?" : 'खाता नहीं है?'}
                </span>
                <br />
                <Link href="/role?type=signup" className="sb-signup-link">
                  {lang === 'en' ? 'Create your account →' : 'अपना खाता बनाएं →'}
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
        <footer className="sb-footer">
          <span>© 2026 SkillBridge</span>
          <nav className="sb-footer-links" aria-label="Footer links">
            <Link href="/privacy" className="sb-footer-link">Privacy</Link>
            <span className="sb-footer-sep" aria-hidden="true">·</span>
            <Link href="/terms" className="sb-footer-link">Terms</Link>
            <span className="sb-footer-sep" aria-hidden="true">·</span>
            <Link href="/accessibility" className="sb-footer-link">Accessibility</Link>
          </nav>
        </footer>

        {/* ── TOAST ──────────────────────────────────────────────────────────────── */}
        <div
          role="status"
          aria-live="polite"
          className={`sb-toast${toast.visible ? '' : ' hidden'}`}
        >
          {toast.message}
        </div>
      </div>
    </div>
  );
}
