'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader, AlertCircle, Clock, Mail } from 'lucide-react';
import type { Application, ApplicationStatusHistory } from '@/database/types';

interface ApplicationDetailWithHistory extends Application {
  student?: any;
  opportunity?: any;
  history?: ApplicationStatusHistory[];
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<ApplicationDetailWithHistory | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    async function fetchApplicationDetails() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch application details
        const appResponse = await fetch(`/api/applications/${applicationId}`);
        if (!appResponse.ok) {
          throw new Error('Failed to fetch application');
        }
        const appData = await appResponse.json();
        setApplication(appData);
        setSelectedStatus(appData.status);

        // Fetch application history
        const historyResponse = await fetch(
          `/api/applications/${applicationId}/history`
        );
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData);
        }
      } catch (err) {
        console.error('Failed to fetch application details:', err);
        setError('Unable to load application details');
      } finally {
        setIsLoading(false);
      }
    }

    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!application) return;

    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApp = await response.json();
      setApplication({ ...application, ...updatedApp });
      setSelectedStatus(newStatus);
      setRejectionReason('');

      // Refresh history
      const historyResponse = await fetch(
        `/api/applications/${applicationId}/history`
      );
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatStatus = (s: string) =>
    s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'interview':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'applied':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link
          href="/industry/applications"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-600 animate-spin mr-3" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link
          href="/industry/applications"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            {error || 'Application not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link
        href="/industry/applications"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Candidate Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {application.student?.name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2) || 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {application.student?.name || 'Unknown Student'}
              </h1>
              <p className="text-gray-600">
                Applying for:{' '}
                <span className="font-semibold">
                  {application.opportunity?.title}
                </span>
              </p>
              {application.student?.email && (
                <a
                  href={`mailto:${application.student.email}`}
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 mt-2"
                >
                  <Mail className="w-4 h-4" />
                  {application.student.email}
                </a>
              )}
            </div>
          </div>
          <span
            className={`px-4 py-2 text-sm font-bold rounded-lg border inline-block ${getStatusColor(
              application.status
            )}`}
          >
            {formatStatus(application.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          {application.student?.college && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                College
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {application.student.college}
              </p>
            </div>
          )}
          {application.student?.branch && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Branch
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {application.student.branch}
              </p>
            </div>
          )}
          {application.student?.cgpa && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                CGPA
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {application.student.cgpa}
              </p>
            </div>
          )}
          {application.match_score !== null &&
            application.match_score !== undefined && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Match Score
                </p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {application.match_score}%
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Candidate Profile Summary */}
      {application.student?.bio && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700">{application.student.bio}</p>
        </div>
      )}

      {/* Status Management */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Manage Application Status
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Update Status:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'applied',
                'under_review',
                'shortlisted',
                'interview',
                'accepted',
                'rejected',
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  disabled={isUpdating}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                    selectedStatus === status
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  } disabled:opacity-50`}
                >
                  {formatStatus(status)}
                </button>
              ))}
            </div>
          </div>

          {selectedStatus === 'rejected' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide feedback to the candidate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
              />
            </div>
          )}

          <button
            onClick={() => handleStatusUpdate(selectedStatus)}
            disabled={
              isUpdating || selectedStatus === application.status
            }
            className={`w-full px-4 py-2.5 font-bold rounded-lg transition-all ${
              isUpdating || selectedStatus === application.status
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isUpdating ? (
              <>
                <Loader className="w-4 h-4 inline mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              `Update to ${formatStatus(selectedStatus)}`
            )}
          </button>
        </div>
      </div>

      {/* Timeline */}
      {history && history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Application History
          </h2>

          <div className="space-y-6">
            {history.map((event, idx) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  {idx < history.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200"></div>
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {formatStatus(event.new_status)}
                    </span>
                    {event.old_status && (
                      <span className="text-xs text-gray-500">
                        from {formatStatus(event.old_status)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(event.changed_at)}
                  </p>
                  {event.notes && (
                    <p className="text-sm text-gray-700 mt-2">{event.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
