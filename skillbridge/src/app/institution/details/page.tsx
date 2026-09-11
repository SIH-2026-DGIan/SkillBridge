'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LangSelector, { useLang } from '@/components/LangSelector';
import { getSession, setSession } from '@/lib/user-session';

/* ── Shared auth styles (matching /verify & /signup design system) ─────── */
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
.auth-back-link { font-size:14px; font-weight:500; color:#2563EB; text-decoration:none; transition:opacity 0.15s; }
.auth-back-link:hover { opacity:0.75; }
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
.auth-main { flex:1; display:flex; align-items:flex-start; justify-content:center; padding:48px 24px 64px; }
.auth-center { width:100%; max-width:580px; }
.auth-eyebrow {
  display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700;
  letter-spacing:0.1em; color:#2563EB; margin-bottom:12px;
}
.auth-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#2563EB; animation:auth-pulse 2s infinite; }
@keyframes auth-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.auth-h1 { font-size:28px; font-weight:700; color:#111827; margin:0 0 8px; letter-spacing:-0.5px; line-height:1.2; }
.auth-sub { font-size:15px; color:#475569; margin:0 0 28px; line-height:1.6; }
.auth-card {
  background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:32px;
  box-shadow:0 4px 24px rgba(0,0,0,.05);
}
.sb-section {
  font-size:11px; font-weight:700; letter-spacing:0.08em; color:#94A3B8;
  margin:24px 0 12px; text-transform:uppercase; padding-bottom:8px;
  border-bottom:1px solid #F1F5F9;
}
.sb-section:first-of-type { margin-top:0; }
.sb-field { margin-bottom:16px; }
.sb-label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:6px; }
.sb-optional { font-weight:400; color:#94A3B8; font-size:12px; margin-left:4px; }
.sb-input-wrap { position:relative; }
.sb-input-icon {
  position:absolute; left:13px; top:50%; transform:translateY(-50%);
  color:#9CA3AF; display:flex; align-items:center; pointer-events:none;
}
.sb-input {
  width:100%; height:46px; border:1.5px solid #E2E8F0; border-radius:10px;
  padding:0 14px 0 42px; font-size:14px; font-family:inherit; color:#111827;
  background:#F8FAFC; transition:border-color 0.15s,box-shadow 0.15s,background 0.15s;
  outline:none; box-sizing:border-box;
}
.sb-input::placeholder { color:#9CA3AF; }
.sb-input:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sb-input.error { border-color:#DC2626; background:#FEF2F2; }
.sb-input.error:focus { box-shadow:0 0 0 3px rgba(220,38,38,.1); }
.sb-input.ok { border-color:#059669; }
.sb-select {
  width:100%; height:46px; border:1.5px solid #E2E8F0; border-radius:10px;
  padding:0 36px 0 42px; font-size:14px; font-family:inherit; color:#111827;
  background:#F8FAFC; transition:border-color 0.15s,box-shadow 0.15s,background 0.15s;
  outline:none; box-sizing:border-box; cursor:pointer; appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 14px center;
}
.sb-select:focus { border-color:#2563EB; background-color:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sb-select.error { border-color:#DC2626; background-color:#FEF2F2; }
.sb-select.ok { border-color:#059669; }
.sb-error { font-size:12px; color:#DC2626; margin-top:5px; display:flex; align-items:center; gap:4px; }
.sb-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.auth-btn-primary {
  width:100%; height:48px; background:#2563EB; color:#fff; border:none;
  border-radius:10px; font-size:15px; font-weight:600; font-family:inherit;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
  transition:background 0.15s,box-shadow 0.15s,transform 0.1s;
  box-shadow:0 2px 8px rgba(37,99,235,.3); margin-top:24px;
}
.auth-btn-primary:hover:not(:disabled) { background:#1D4ED8; box-shadow:0 4px 12px rgba(37,99,235,.4); }
.auth-btn-primary:active:not(:disabled) { transform:scale(0.985); }
.auth-btn-primary:disabled { opacity:0.65; cursor:not-allowed; }
.sb-spinner {
  width:18px; height:18px; border:2px solid rgba(255,255,255,.35);
  border-top-color:#fff; border-radius:50%; animation:auth-spin 0.7s linear infinite;
}
@keyframes auth-spin { to{transform:rotate(360deg)} }
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
  .sb-row{grid-template-columns:1fr;}
}
`;

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">{name}</span>
);

function InstitutionDetailsContent() {
  const router = useRouter();
  const [lang, setLang] = useLang();

  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [affiliatedUniversity, setAffiliatedUniversity] = useState('');
  const [contactName, setContactName] = useState('');
  const [placementEmail, setPlacementEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [website, setWebsite] = useState('');

  // Generate academic year options: e.g. 2024-25, 2025-26, 2026-27
  const currentYear = new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 5 }, (_, i) => {
    const start = currentYear - 2 + i;
    return `${start}-${String(start + 1).slice(2)}`;
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(placementEmail);
  const validPhone = /^(\+91[\s-]?)?[6-9]\d{9}$/.test(contactNumber.replace(/\s/g, ''));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const hasErrors =
      !institutionName.trim() ||
      !institutionType ||
      !institutionCode.trim() ||
      !academicYear ||
      !city.trim() ||
      !stateVal.trim() ||
      !affiliatedUniversity.trim() ||
      !contactName.trim() ||
      !placementEmail.trim() || !validEmail ||
      !contactNumber.trim() || !validPhone;

    if (hasErrors) return;

    setLoading(true);
    try {
      // Persist via existing session architecture (localStorage + sb-demo-session cookie)
      const current = getSession();
      setSession({
        ...current,
        institutionName: institutionName.trim(),
        institutionType: institutionType,
        institutionCode: institutionCode.trim(),
        academicYear: academicYear,
        city: city.trim(),
        state: stateVal.trim(),
        affiliatedUniversity: affiliatedUniversity.trim(),
        tpoHead: contactName.trim(),
        placementContactName: contactName.trim(),
        placementEmail: placementEmail.trim(),
        contactNumber: contactNumber.trim(),
        website: website.trim() || undefined,
        onboardingStep: 3,
        isProfileComplete: true,
      });

      // Attempt Supabase persistence if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== 'your_supabase_project_url') {
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({
              institution_name: institutionName.trim(),
              institution_type: institutionType,
              institution_code: institutionCode.trim(),
              academic_year: academicYear,
              city: city.trim(),
              state: stateVal.trim(),
              affiliated_university: affiliatedUniversity.trim(),
              placement_contact_name: contactName.trim(),
              placement_email: placementEmail.trim(),
              contact_number: contactNumber.trim(),
              website: website.trim() || null,
              onboarding_complete: true,
            }).eq('user_id', user.id);
          }
        } catch { /* Supabase not configured — local session is the fallback */ }
      }

      router.push('/institution/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const err = {
    institutionName: submitted && !institutionName.trim(),
    institutionType: submitted && !institutionType,
    institutionCode: submitted && !institutionCode.trim(),
    academicYear: submitted && !academicYear,
    city: submitted && !city.trim(),
    state: submitted && !stateVal.trim(),
    affUniv: submitted && !affiliatedUniversity.trim(),
    contactName: submitted && !contactName.trim(),
    emailEmpty: submitted && !placementEmail.trim(),
    emailBad: submitted && !!placementEmail.trim() && !validEmail,
    phoneEmpty: submitted && !contactNumber.trim(),
    phoneBad: submitted && !!contactNumber.trim() && !validPhone,
  };

  return (
    <div className="auth-root">
      <style>{AUTH_CSS}</style>

      {/* Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <div className="auth-header-right">
          <nav className="auth-stepper" aria-label="Sign-up progress">
            {[
              { label: 'Role',        state: 'done'   },
              { label: 'Account',     state: 'done'   },
              { label: 'Verify',      state: 'done'   },
              { label: 'Institution', state: 'active' },
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
            INSTITUTION PROFILE
          </div>
          <h1 className="auth-h1">Complete your institution profile</h1>
          <p className="auth-sub">
            Tell us about your institution so we can personalize your placement dashboard.
          </p>

          <div className="auth-card">
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Section: Institution Information ── */}
              <p className="sb-section" style={{ marginTop: 0 }}>Institution Information</p>

              {/* Institution Name */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-name">Institution Name</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="account_balance" /></span>
                  <input
                    id="inst-name" type="text" autoComplete="organization"
                    placeholder="e.g. Indian Institute of Technology Delhi"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className={`sb-input${err.institutionName ? ' error' : institutionName.trim() ? ' ok' : ''}`}
                    aria-invalid={err.institutionName}
                    aria-describedby={err.institutionName ? 'err-inst-name' : undefined}
                  />
                </div>
                {err.institutionName && <p className="sb-error" id="err-inst-name" role="alert"><Icon name="error" size={13} />Institution name is required.</p>}
              </div>

              {/* Institution Type */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-type">Institution Type</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="category" /></span>
                  <select
                    id="inst-type"
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className={`sb-select${err.institutionType ? ' error' : institutionType ? ' ok' : ''}`}
                    aria-invalid={err.institutionType}
                    aria-describedby={err.institutionType ? 'err-inst-type' : undefined}
                  >
                    <option value="">Select institution type</option>
                    <option value="Engineering College">Engineering College</option>
                    <option value="University">University</option>
                    <option value="Institute">Institute</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {err.institutionType && <p className="sb-error" id="err-inst-type" role="alert"><Icon name="error" size={13} />Please select an institution type.</p>}
              </div>

              {/* Institution Code */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-code">Institution Code / College ID</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="badge" /></span>
                  <input
                    id="inst-code" type="text"
                    placeholder="e.g. AICTE-1234 or AISHE Code"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                    className={`sb-input${err.institutionCode ? ' error' : institutionCode.trim() ? ' ok' : ''}`}
                    aria-invalid={err.institutionCode}
                    aria-describedby={err.institutionCode ? 'err-inst-code' : undefined}
                  />
                </div>
                {err.institutionCode && <p className="sb-error" id="err-inst-code" role="alert"><Icon name="error" size={13} />Institution code is required.</p>}
              </div>

              {/* Academic Year */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-academic-year">Academic Year</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="calendar_today" /></span>
                  <select
                    id="inst-academic-year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className={`sb-select${err.academicYear ? ' error' : academicYear ? ' ok' : ''}`}
                    aria-invalid={err.academicYear}
                    aria-describedby={err.academicYear ? 'err-academic-year' : undefined}
                  >
                    <option value="">Select current academic year</option>
                    {academicYearOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                {err.academicYear && <p className="sb-error" id="err-academic-year" role="alert"><Icon name="error" size={13} />Academic year is required.</p>}
              </div>

              {/* Affiliated University */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-affuniv">Affiliated University</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="school" /></span>
                  <input
                    id="inst-affuniv" type="text"
                    placeholder="e.g. Anna University, JNTU Hyderabad"
                    value={affiliatedUniversity}
                    onChange={(e) => setAffiliatedUniversity(e.target.value)}
                    className={`sb-input${err.affUniv ? ' error' : affiliatedUniversity.trim() ? ' ok' : ''}`}
                    aria-invalid={err.affUniv}
                    aria-describedby={err.affUniv ? 'err-affuniv' : undefined}
                  />
                </div>
                {err.affUniv && <p className="sb-error" id="err-affuniv" role="alert"><Icon name="error" size={13} />Affiliated university is required.</p>}
              </div>

              {/* ── Section: Location ── */}
              <p className="sb-section">Location</p>

              <div className="sb-row">
                <div className="sb-field">
                  <label className="sb-label" htmlFor="inst-city">City</label>
                  <div className="sb-input-wrap">
                    <span className="sb-input-icon"><Icon name="location_city" /></span>
                    <input
                      id="inst-city" type="text"
                      placeholder="e.g. Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`sb-input${err.city ? ' error' : city.trim() ? ' ok' : ''}`}
                      aria-invalid={err.city}
                      aria-describedby={err.city ? 'err-city' : undefined}
                    />
                  </div>
                  {err.city && <p className="sb-error" id="err-city" role="alert"><Icon name="error" size={13} />City is required.</p>}
                </div>

                <div className="sb-field">
                  <label className="sb-label" htmlFor="inst-state">State</label>
                  <div className="sb-input-wrap">
                    <span className="sb-input-icon"><Icon name="map" /></span>
                    <input
                      id="inst-state" type="text"
                      placeholder="e.g. Maharashtra"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      className={`sb-input${err.state ? ' error' : stateVal.trim() ? ' ok' : ''}`}
                      aria-invalid={err.state}
                      aria-describedby={err.state ? 'err-state' : undefined}
                    />
                  </div>
                  {err.state && <p className="sb-error" id="err-state" role="alert"><Icon name="error" size={13} />State is required.</p>}
                </div>
              </div>

              {/* ── Section: Placement Cell Contact ── */}
              <p className="sb-section">Placement Cell Contact</p>

              {/* Contact Name */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-contact-name">Placement Cell Contact Name</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="person" /></span>
                  <input
                    id="inst-contact-name" type="text" autoComplete="name"
                    placeholder="e.g. Dr. Priya Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={`sb-input${err.contactName ? ' error' : contactName.trim() ? ' ok' : ''}`}
                    aria-invalid={err.contactName}
                    aria-describedby={err.contactName ? 'err-contact-name' : undefined}
                  />
                </div>
                {err.contactName && <p className="sb-error" id="err-contact-name" role="alert"><Icon name="error" size={13} />Contact name is required.</p>}
              </div>

              {/* Placement Email */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-email">Official Placement Email</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="mail" /></span>
                  <input
                    id="inst-email" type="email" autoComplete="email"
                    placeholder="placement@institution.ac.in"
                    value={placementEmail}
                    onChange={(e) => setPlacementEmail(e.target.value)}
                    className={`sb-input${(err.emailEmpty || err.emailBad) ? ' error' : validEmail ? ' ok' : ''}`}
                    aria-invalid={err.emailEmpty || err.emailBad}
                    aria-describedby={(err.emailEmpty || err.emailBad) ? 'err-email' : undefined}
                  />
                </div>
                {err.emailEmpty && <p className="sb-error" id="err-email" role="alert"><Icon name="error" size={13} />Placement email is required.</p>}
                {err.emailBad   && <p className="sb-error" id="err-email" role="alert"><Icon name="error" size={13} />Please enter a valid email address.</p>}
              </div>

              {/* Contact Number */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-phone">Contact Number</label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="phone" /></span>
                  <input
                    id="inst-phone" type="tel" autoComplete="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className={`sb-input${(err.phoneEmpty || err.phoneBad) ? ' error' : validPhone ? ' ok' : ''}`}
                    aria-invalid={err.phoneEmpty || err.phoneBad}
                    aria-describedby={(err.phoneEmpty || err.phoneBad) ? 'err-phone' : undefined}
                  />
                </div>
                {err.phoneEmpty && <p className="sb-error" id="err-phone" role="alert"><Icon name="error" size={13} />Contact number is required.</p>}
                {err.phoneBad   && <p className="sb-error" id="err-phone" role="alert"><Icon name="error" size={13} />Enter a valid Indian mobile number (+91 or 10-digit).</p>}
              </div>

              {/* Website (optional) */}
              <div className="sb-field">
                <label className="sb-label" htmlFor="inst-website">
                  Website <span className="sb-optional">(optional)</span>
                </label>
                <div className="sb-input-wrap">
                  <span className="sb-input-icon"><Icon name="language" /></span>
                  <input
                    id="inst-website" type="url"
                    placeholder="https://www.institution.ac.in"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="sb-input"
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading} aria-label="Continue to dashboard">
                {loading
                  ? <><span className="sb-spinner" /><span>Saving…</span></>
                  : <>Continue to Dashboard <span aria-hidden="true">→</span></>
                }
              </button>
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

export default function InstitutionDetailsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F8FAFC' }} />}>
      <InstitutionDetailsContent />
    </Suspense>
  );
}
