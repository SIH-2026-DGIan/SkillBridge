'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, Clock, Award, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';
import type { Application } from '@/database/types';

type FilterStatus = 'all' | 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';

interface ApplicationWithDetails extends Application {
  student?: any;
  opportunity?: any;
  studentName?: string;
  studentEmail?: string;
}

export default function IndustryApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Unable to load applications. Please try again.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const filtered = 
    filter === 'all' 
      ? applications 
      : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string, rejectionReason?: string) => {
    try {
      setUpdatingId(applicationId);

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: rejectionReason || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApp = await response.json();

      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === applicationId
            ? { ...app, status: updatedApp.status }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatStatus = (s: string) => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'interview':
        return 'bg-amber-100 text-amber-700';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-700';
      case 'under_review':
        return 'bg-blue-100 text-blue-700';
      case 'applied':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Received Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and manage student applications</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(['all', 'applied', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filter === tab
                ? 'bg-purple-600 text-white border-purple-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {tab === 'all' 
              ? `All Applications (${counts.all})` 
              : `${formatStatus(tab)} (${counts[tab as keyof typeof counts]})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-600 animate-spin mr-3" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No applications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                    {app.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'S'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-base truncate">{app.studentName || 'Unknown Student'}</h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${getStatusColor(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Applied for: <span className="font-semibold text-gray-700">{app.opportunity?.title || 'Unknown Role'}</span>
                      {app.student?.college && ` · ${app.student.college}`}
                      {app.student?.branch && ` (${app.student.branch})`}
                    </p>
                    {app.student?.cgpa && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">CGPA:</span> {app.student.cgpa}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <div className="text-right">
                    {app.match_score !== null && app.match_score !== undefined && (
                      <>
                        <div className="text-lg font-extrabold text-green-600">{app.match_score}%</div>
                        <div className="text-xs text-gray-400">Match Score</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Update Status:</p>
                <div className="flex gap-2 flex-wrap">
                  {(['under_review', 'shortlisted', 'interview', 'accepted', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(app.id, status)}
                      disabled={updatingId === app.id || app.status === status}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        app.status === status
                          ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-default'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingId === app.id ? (
                        <>
                          <Loader className="w-3 h-3 inline mr-1 animate-spin" />
                          {formatStatus(status)}
                        </>
                      ) : (
                        formatStatus(status)
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <Link
                  href={`/industry/applications/${app.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                >
                  View Full Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
