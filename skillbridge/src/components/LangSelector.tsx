'use client';

import { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
export type Lang = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te';

export const LANGUAGES: { code: Lang; native: string; label: string }[] = [
  { code: 'en', native: 'English',  label: 'English'  },
  { code: 'hi', native: 'हिन्दी',    label: 'Hindi'    },
  { code: 'bn', native: 'বাংলা',     label: 'Bengali'  },
  { code: 'mr', native: 'मराठी',    label: 'Marathi'  },
  { code: 'ta', native: 'தமிழ்',    label: 'Tamil'    },
  { code: 'te', native: 'తెలుగు',   label: 'Telugu'   },
];

const STORAGE_KEY = 'sb-lang';

// ── Hook — persists lang in localStorage ───────────────────────────────────────
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && LANGUAGES.some((l) => l.code === stored)) {
        setLangState(stored);
      }
    } catch { /* SSR / private-browsing */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  };

  return [lang, setLang];
}

// ── Component ──────────────────────────────────────────────────────────────────
interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function LangSelector({ lang, setLang }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 60 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.native}. Click to change.`}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', borderRadius: 8,
          border: `1.5px solid ${open ? '#2563EB' : '#E2E8F0'}`,
          background: '#fff', fontSize: 13, fontWeight: 500,
          color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap', transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: open ? '0 0 0 2px rgba(37,99,235,.12)' : 'none',
        }}
      >
        {current.native}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s', flexShrink: 0 }}>
          <path d="M1 1l4 4 4-4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <ul role="listbox" aria-label="Select language"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 148,
            padding: '4px 0', listStyle: 'none', margin: 0,
          }}
        >
          {LANGUAGES.map((l) => {
            const selected = lang === l.code;
            return (
              <li key={l.code} role="option" aria-selected={selected} tabIndex={0}
                onClick={() => { setLang(l.code); setOpen(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLang(l.code); setOpen(false); } }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px', fontSize: 13,
                  fontWeight: selected ? 600 : 400,
                  color: selected ? '#2563EB' : '#374151',
                  cursor: 'pointer', userSelect: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span>{l.native}</span>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7l3 3 6-6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
