'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDashboardProfile } from '@/lib/hooks/useDashboardProfile';

export default function DashboardGateway() {
  const router = useRouter();
  const { profile, session, role, loading, error } = useDashboardProfile();

  useEffect(() => {
    if (!loading) {
      const targetRole = profile?.role || role || session?.role || 'student';
      const roleDashboard =
        targetRole === 'industry'
          ? '/industry/dashboard'
          : targetRole === 'institution'
            ? '/institution/dashboard'
            : targetRole === 'academician'
              ? '/academician/dashboard'
              : '/student/dashboard';

      router.replace(roleDashboard);
    }
  }, [loading, profile, role, session, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '40px 48px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority />

        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(37, 99, 235, 0.2)',
            borderTopColor: '#2563EB',
            borderRadius: '50%',
            animation: 'gateway-spin 0.8s linear infinite',
          }}
        />

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>
            Preparing your dashboard
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Synchronizing your profile and personalized opportunities…
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gateway-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
