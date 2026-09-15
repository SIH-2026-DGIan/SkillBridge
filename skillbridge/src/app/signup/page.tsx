'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setSession, type UserRole } from '@/lib/user-session';
import { isSupabaseConfigured } from '@/lib/supabase/client';

/* ── Types ──────────────────────────────────────────────────────────────────── */
type RoleId = 'student' | 'industry' | 'institution' | 'academician';

/* ── Role meta ──────────────────────────────────────────────────────────────── */
const ROLE_META: Record<RoleId, { label: string; color: string; description: string }> = {
  student:      { label: 'Student Registration',      color: '#2563EB', description: 'Create your student account to discover opportunities and track your career progress.' },
  industry:     { label: 'Industry Registration',     color: '#7C3AED', description: 'Register your company to find and evaluate skilled candidates.' },
  institution:  { label: 'Institution Registration',  color: '#0D9488', description: 'Register your institution to monitor student readiness and placement outcomes.' },
  academician:  { label: 'Academician Registration',  color: '#EA580C', description: 'Join as faculty to connect with industry for research and collaboration.' },
};

/* ── CSS ─────────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.reg-root { font-family:'Inter',system-ui,sans-serif; background:#F8FAFC; min-height:100vh; display:flex; flex-direction:column; }
.reg-header { background:#fff; border-bottom:1px solid #E2E8F0; height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; position:sticky; top:0; z-index:50; }
.reg-logo img { height:40px; width:auto; object-fit:contain; transform:scale(2.8); transform-origin:left center; }
.reg-main { flex:1; display:flex; align-items:flex-start; justify-content:center; padding:40px 24px 64px; }
.reg-card-wrap { width:100%; max-width:520px; }
.reg-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; }
.reg-badge-dot { width:6px; height:6px; border-radius:50%; }
.reg-h1 { font-size:26px; font-weight:700; color:#111827; margin:0 0 6px; letter-spacing:-0.4px; line-height:1.25; }
.reg-sub { font-size:14px; color:#6B7280; margin:0 0 24px; line-height:1.6; }
.reg-card { background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:28px; box-shadow:0 4px 24px rgba(0,0,0,.05); }
.reg-section-title { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9CA3AF; margin:20px 0 12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9; }
.reg-section-title:first-child { margin-top:0; }
.reg-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.sb-field { margin-bottom:14px; }
.sb-label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:5px; }
.sb-input-wrap { position:relative; }
.sb-input { width:100%; height:44px; border:1.5px solid #E2E8F0; border-radius:9px; padding:0 14px; font-size:14px; font-family:inherit; color:#111827; background:#F8FAFC; transition:border-color 0.15s,box-shadow 0.15s; outline:none; box-sizing:border-box; }
.sb-input::placeholder { color:#9CA3AF; }
.sb-input:focus { border-color:var(--accent,#2563EB); background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sb-input.error { border-color:#DC2626; background:#FEF2F2; }
.sb-input.ok { border-color:#059669; }
.sb-select { width:100%; height:44px; border:1.5px solid #E2E8F0; border-radius:9px; padding:0 14px; font-size:14px; font-family:inherit; color:#111827; background:#F8FAFC; outline:none; cursor:pointer; box-sizing:border-box; appearance:none; }
.sb-select:focus { border-color:var(--accent,#2563EB); background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sb-error { font-size:12px; color:#DC2626; margin-top:4px; }
.sb-checkbox-row { display:flex; align-items:flex-start; gap:10px; margin:16px 0; }
.sb-checkbox-row input { width:16px; height:16px; accent-color:var(--accent,#2563EB); cursor:pointer; flex-shrink:0; margin-top:2px; }
.sb-checkbox-label { font-size:13px; color:#475569; line-height:1.5; }
.sb-checkbox-label a { color:var(--accent,#2563EB); text-decoration:none; }
.auth-btn-primary { width:100%; height:46px; background:var(--accent,#2563EB); color:#fff; border:none; border-radius:10px; font-size:15px; font-weight:600; font-family:inherit; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s,transform 0.1s; box-shadow:0 2px 8px rgba(37,99,235,.3); margin-top:8px; }
.auth-btn-primary:hover:not(:disabled) { filter:brightness(1.1); }
.auth-btn-primary:active:not(:disabled) { transform:scale(0.985); }
.auth-btn-primary:disabled { opacity:0.65; cursor:not-allowed; }
.sb-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.sb-divider { display:flex; align-items:center; gap:12px; margin:18px 0; }
.sb-divider-line { flex:1; height:1px; background:#E2E8F0; }
.sb-divider-text { font-size:11px; font-weight:700; letter-spacing:0.08em; color:#94A3B8; }
.sb-btn-google { width:100%; height:44px; background:#fff; color:#374151; border:1.5px solid #E2E8F0; border-radius:10px; font-size:14px; font-weight:500; font-family:inherit; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:background 0.15s; }
.sb-btn-google:hover:not(:disabled) { background:#F8FAFC; border-color:#CBD5E1; }
.reg-footer-note { text-align:center; margin-top:20px; font-size:14px; color:#6B7280; }
.reg-footer-note a { color:var(--accent,#2563EB); font-weight:600; text-decoration:none; }
.reg-back { font-size:13px; font-weight:500; color:#6B7280; text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:color 0.15s; }
.reg-back:hover { color:#111827; }
@media(max-width:520px) { .reg-grid-2 { grid-template-columns:1fr; } .reg-card { padding:20px 16px; } }
`;

/* ── Individual field component ──────────────────────────────────────────────── */
function Field({ id, label, type = 'text', placeholder, value, onChange, required, error, autoComplete }: {
  id: string; label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; error?: string; autoComplete?: string;
}) {
  const [touched, setTouched] = useState(false);
  const showErr = error && (touched || required);
  return (
    <div className="sb-field">
      <label className="sb-label" htmlFor={id}>{label}{required && <span style={{ color: '#DC2626' }}> *</span>}</label>
      <input
        id={id} type={type} placeholder={placeholder} value={value ?? ''}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`sb-input${showErr ? ' error' : (value ?? '') ? ' ok' : ''}`}
      />
      {showErr && <p className="sb-error">{error}</p>}
    </div>
  );
}

function SelectField({ id, label, options, value, onChange, required }: {
  id: string; label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="sb-field">
      <label className="sb-label" htmlFor={id}>{label}{required && <span style={{ color: '#DC2626' }}> *</span>}</label>
      <select id={id} className="sb-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ── Role-specific field groups ──────────────────────────────────────────────── */
function StudentFields({ f, s }: { f: Record<string, string>; s: (k: string, v: string) => void }) {
  return (
    <>
      <p className="reg-section-title">Academic Details</p>
      <div className="reg-grid-2">
        <Field id="college"  label="College / University"  placeholder="e.g. IIT Bombay"      value={f.college}  onChange={(v) => s('college', v)} required />
        <Field id="course"   label="Course / Degree"       placeholder="e.g. B.Tech CSE"      value={f.course}   onChange={(v) => s('course', v)} required />
      </div>
      <div className="reg-grid-2">
        <SelectField id="year" label="Current Year" options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Post Graduate']} value={f.year} onChange={(v) => s('year', v)} required />
        <Field id="cgpa" label="CGPA / Percentage" placeholder="e.g. 8.5" value={f.cgpa} onChange={(v) => s('cgpa', v)} />
      </div>
      <Field id="skills" label="Key Skills (comma-separated)" placeholder="e.g. Python, React, SQL" value={f.skills} onChange={(v) => s('skills', v)} />
    </>
  );
}

function IndustryFields({ f, s }: { f: Record<string, string>; s: (k: string, v: string) => void }) {
  return (
    <>
      <p className="reg-section-title">Company Details</p>
      <Field id="companyName" label="Company Name"    placeholder="e.g. TechNova Pvt. Ltd." value={f.companyName} onChange={(v) => s('companyName', v)} required />
      <div className="reg-grid-2">
        <Field id="industry" label="Industry / Sector" placeholder="e.g. Software, FinTech" value={f.industry} onChange={(v) => s('industry', v)} required />
        <Field id="companySize" label="Company Size" placeholder="e.g. 50–200 employees" value={f.companySize} onChange={(v) => s('companySize', v)} />
      </div>
      <Field id="website" label="Company Website" placeholder="https://yourcompany.com" value={f.website} onChange={(v) => s('website', v)} autoComplete="url" />
    </>
  );
}

function InstitutionFields({ f, s }: { f: Record<string, string>; s: (k: string, v: string) => void }) {
  return (
    <>
      <p className="reg-section-title">Institution Details</p>
      <Field id="institutionName" label="Institution Name" placeholder="e.g. NIT Kozhikode" value={f.institutionName} onChange={(v) => s('institutionName', v)} required />
      <div className="reg-grid-2">
        <SelectField id="institutionType" label="Institution Type" options={['University', 'Deemed University', 'Engineering College', 'Management Institute', 'Polytechnic', 'Other']} value={f.institutionType} onChange={(v) => s('institutionType', v)} required />
        <Field id="affiliatedUniversity" label="Affiliated University" placeholder="e.g. Anna University" value={f.affiliatedUniversity} onChange={(v) => s('affiliatedUniversity', v)} />
      </div>
      <div className="reg-grid-2">
        <Field id="city" label="City" placeholder="e.g. Chennai" value={f.city} onChange={(v) => s('city', v)} required />
        <Field id="state" label="State" placeholder="e.g. Tamil Nadu" value={f.state} onChange={(v) => s('state', v)} required />
      </div>
      <Field id="tpoHead" label="TPO / Placement Head Name" placeholder="Full name" value={f.tpoHead} onChange={(v) => s('tpoHead', v)} />
    </>
  );
}

function AcademicianFields({ f, s }: { f: Record<string, string>; s: (k: string, v: string) => void }) {
  return (
    <>
      <p className="reg-section-title">Academic Details</p>
      <Field id="institution" label="College / University" placeholder="e.g. IIT Delhi" value={f.institution} onChange={(v) => s('institution', v)} required />
      <div className="reg-grid-2">
        <Field id="department" label="Department" placeholder="e.g. CSE, Electronics" value={f.department} onChange={(v) => s('department', v)} required />
        <Field id="designation" label="Designation" placeholder="e.g. Assistant Professor" value={f.designation} onChange={(v) => s('designation', v)} />
      </div>
      <Field id="researchDomain" label="Research Domain / Specialization" placeholder="e.g. Machine Learning, VLSI" value={f.researchDomain} onChange={(v) => s('researchDomain', v)} />
    </>
  );
}

/* ── Main Signup Component ──────────────────────────────────────────────────── */
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') || 'student') as RoleId;
  const meta = ROLE_META[role] || ROLE_META.student;
  const accentColor = meta.color;

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Role-specific extra fields stored as a single flat object
  const [extra, setExtra] = useState<Record<string, string>>({});
  const setField = (key: string, val: string) => setExtra((prev) => ({ ...prev, [key]: val }));

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
  const validPw = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fullName.trim() || !validEmail || !validPhone || !validPw || !agreed) return;
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data } = await supabase.auth.signUp({ email, password, options: { data: { role, full_name: fullName } } });
          if (data?.user) {
            const profilePayload: Record<string, string | number | boolean> = {
              user_id: data.user.id,
              role,
              name: fullName,
              email,
              phone,
            };
            if (role === 'student') {
              Object.assign(profilePayload, {
                college: extra.college || '',
                degree: extra.course || '',
                cgpa: parseFloat(extra.cgpa || '0') || 0,
              });
            } else if (role === 'industry') {
              Object.assign(profilePayload, {
                company: extra.companyName || '',
                industry: extra.industry || '',
                website: extra.website || '',
              });
            } else if (role === 'institution') {
              Object.assign(profilePayload, {
                institution: extra.institutionName || '',
                city: extra.city || '',
                state: extra.state || '',
              });
            } else if (role === 'academician') {
              Object.assign(profilePayload, {
                institution: extra.institution || '',
                department: extra.department || '',
                research_domain: extra.researchDomain || '',
              });
            }
            await supabase.from('profiles').insert(profilePayload).single();
          }
        } catch (sbErr) {
          console.warn('Supabase signup error (non-fatal):', sbErr);
        }
      }

      setSession({
        id: 'user-' + Date.now(),
        name: fullName,
        email,
        phone,
        role: role as UserRole,
        college: extra.college || extra.institution,
        company: extra.companyName,
        institutionName: extra.institutionName,
        department: extra.department,
        onboardingStep: 1,
        isProfileComplete: false,
      });

      router.push('/verify');
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback?next=/onboarding&role=' + role,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) console.error('Google OAuth error:', error);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="reg-root" style={{ ['--accent' as string]: accentColor }}>
      <style>{CSS}</style>

      <header className="reg-header">
        <Link href="/" className="reg-logo">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority />
        </Link>
        <Link href="/role" className="reg-back">
          ← Change role
        </Link>
      </header>

      <main className="reg-main">
        <div className="reg-card-wrap">
          <div className="reg-badge">
            <span className="reg-badge-dot" style={{ background: accentColor }} />
            <span style={{ color: accentColor }}>Create Account</span>
          </div>
          <h1 className="reg-h1">{meta.label}</h1>
          <p className="reg-sub">{meta.description}</p>

          <div className="reg-card">
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Common fields ── */}
              <p className="reg-section-title">Personal Information</p>
              <Field id="fullName" label="Full Name" placeholder="Your full name" value={fullName} onChange={setFullName}
                required error={submitted && !fullName.trim() ? 'Name is required' : ''} autoComplete="name" />
              <div className="reg-grid-2">
                <Field id="email" label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail}
                  required error={submitted && !validEmail ? 'Enter a valid email' : ''} autoComplete="email" />
                <Field id="phone" label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={setPhone}
                  required error={submitted && !validPhone ? 'Enter a valid Indian number' : ''} autoComplete="tel" />
              </div>

              {/* ── Role-specific fields ── */}
              {role === 'student'      && <StudentFields     f={extra} s={setField} />}
              {role === 'industry'     && <IndustryFields    f={extra} s={setField} />}
              {role === 'institution'  && <InstitutionFields f={extra} s={setField} />}
              {role === 'academician'  && <AcademicianFields f={extra} s={setField} />}

              {/* ── Password ── */}
              <p className="reg-section-title">Account Security</p>
              <div className="sb-field">
                <label className="sb-label" htmlFor="password">Password <span style={{ color: '#DC2626' }}>*</span></label>
                <div className="sb-input-wrap" style={{ position: 'relative' }}>
                  <input
                    id="password" type={showPw ? 'text' : 'password'}
                    autoComplete="new-password" placeholder="Min. 8 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className={`sb-input${submitted && !validPw ? ' error' : validPw ? ' ok' : ''}`}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 44, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 13 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                {submitted && !validPw && <p className="sb-error">Password must be at least 8 characters.</p>}
              </div>

              {/* Terms */}
              <div className="sb-checkbox-row">
                <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
                <label htmlFor="agree" className="sb-checkbox-label">
                  I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </label>
              </div>
              {submitted && !agreed && <p className="sb-error" style={{ marginTop: -10, marginBottom: 10 }}>You must accept the Terms to continue.</p>}

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? <><span className="sb-spinner" /><span>Creating account…</span></> : <>Create Account →</>}
              </button>
            </form>

            {isSupabaseConfigured() && (
              <>
                <div className="sb-divider"><span className="sb-divider-line" /><span className="sb-divider-text">OR CONTINUE WITH</span><span className="sb-divider-line" /></div>
                <button type="button" className="sb-btn-google" onClick={handleGoogleSignIn} disabled={googleLoading}>
                  {googleLoading ? <span className="sb-spinner" style={{ borderColor: 'rgba(37,99,235,.25)', borderTopColor: '#2563EB' }} /> : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <p className="reg-footer-note" style={{ marginTop: 20 }}>
            Already have an account?{' '}
            <Link href="/login">Sign In</Link>
          </p>
        </div>
      </main>
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
