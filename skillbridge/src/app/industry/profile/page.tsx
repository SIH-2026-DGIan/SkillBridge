'use client';

import { Building2, MapPin, Mail, Globe, Users, Edit } from 'lucide-react';

export default function IndustryProfilePage() {
  const company = {
    name: 'TechNova Solutions',
    recruiter: 'Rohan Mehta',
    role: 'Lead AI/ML Recruiter & Campus Hiring Lead',
    email: 'rohan@technova.demo',
    location: 'Bengaluru, Karnataka',
    website: 'https://technova.ai',
    sector: 'Artificial Intelligence & Machine Learning',
    employees: '500–1,000 employees',
    about: 'TechNova is a high-growth technology company building enterprise-grade computer vision models and generative AI systems for logistics, healthcare, and retail industries.',
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Company Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage employer branding and recruiter details</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
            TN
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{company.name}</h2>
            <p className="text-purple-700 font-medium text-sm">{company.sector}</p>
            <p className="text-gray-500 text-xs mt-1">{company.employees} · {company.location}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Company</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{company.about}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3.5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base">Recruiter &amp; Hiring Contact</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Recruiter</div>
              <div className="font-medium text-gray-900">{company.recruiter} ({company.role})</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Email</div>
              <div className="font-medium text-gray-900">{company.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Headquarters</div>
              <div className="font-medium text-gray-900">{company.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Website</div>
              <div className="font-medium text-blue-600">{company.website}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
