'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, GraduationCap, Edit, ShieldCheck } from 'lucide-react';
import { getSession, type UserSession } from '@/lib/user-session';

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession>(getSession());

  useEffect(() => {
    setUser(getSession());
  }, []);

  const profile = {
    name: user.name || 'Arav Gupta',
    email: user.email || 'arav.gupta@student.edu',
    phone: '+91 98765 43210',
    college: user.college || 'Dronacharya Group of Institutions',
    degree: user.degree || 'B.Tech',
    branch: user.branch || 'Computer Science & Engineering',
    graduationYear: user.graduationYear || 2026,
    cgpa: 8.4,
    location: 'Greater Noida, Uttar Pradesh',
    bio: 'Passionate about Machine Learning, Neural Networks, and Scalable Backend Systems. Building production AI solutions with Python and PyTorch. Looking for ML internships.',
    targetRoles: [user.targetRole || 'Machine Learning Engineer', 'Data Analyst'],
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your personal information and preferences</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-indigo-200 text-[#4F46E5] text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors">
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-md shadow-indigo-500/25">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
              <span className="badge-pill badge-pill-emerald text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            </div>
            <p className="text-indigo-600 text-sm font-bold mt-0.5">{profile.degree} · {profile.branch} · {profile.college}</p>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Personal Details</h2>
        {[
          { icon: Mail, label: 'Email', value: profile.email },
          { icon: Phone, label: 'Phone', value: profile.phone },
          { icon: MapPin, label: 'Location', value: profile.location },
          { icon: GraduationCap, label: 'College', value: profile.college },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-400">{label}</div>
              <div className="text-sm font-medium text-gray-900">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Academic */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <h2 className="font-bold text-gray-900">Academic Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Degree', value: profile.degree },
            { label: 'Branch', value: profile.branch },
            { label: 'Graduation Year', value: profile.graduationYear },
            { label: 'CGPA', value: profile.cgpa },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-gray-400">{label}</div>
              <div className="text-sm font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Roles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-3">Target Roles</h2>
        <div className="flex flex-wrap gap-2">
          {profile.targetRoles.map((role) => (
            <span key={role} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
