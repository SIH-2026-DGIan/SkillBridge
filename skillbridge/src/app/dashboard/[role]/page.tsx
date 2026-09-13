'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

const DASHBOARD_ROUTES: Record<string, string> = {
  student: '/student/dashboard',
  tpo: '/institution/dashboard',
  institution: '/institution/dashboard',
  recruiter: '/industry/dashboard',
  industry: '/industry/dashboard',
  faculty: '/academician/dashboard',
  academician: '/academician/dashboard',
};

export default function RoleDashboardRedirect() {
  const router = useRouter();
  const params = useParams();
  const rawRole = (params?.role as string) || 'student';
  const targetRoute = DASHBOARD_ROUTES[rawRole.toLowerCase()] || '/student/dashboard';

  useEffect(() => {
    router.replace(targetRoute);
  }, [router, targetRoute]);

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
          gap: '18px',
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '36px 44px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
        }}
      >
        <Image src="/image.png" alt="SkillBridge" width={150} height={38} priority />
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(37, 99, 235, 0.2)',
            borderTopColor: '#2563EB',
            borderRadius: '50%',
            animation: 'dash-spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontWeight: 500 }}>
          Opening {rawRole} dashboard…
        </p>
      </div>

      <style>{`
        @keyframes dash-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
