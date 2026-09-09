'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader, AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
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
          href="/student/applications"
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
          href="/student/applications"
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
        href="/student/applications"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      {/* Application Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {application.opportunity?.title || 'Application'}
            </h1>
            <p className="text-gray-600">
              {application.opportunity?.company || 'Company'}
            </p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-bold rounded-lg border inline-block ${getStatusColor(
              application.status
            )}`}
          >
            {formatStatus(application.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Applied On
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {formatDate(application.applied_at)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Last Updated
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {formatDate(application.updated_at)}
            </p>
          </div>
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
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Opportunity Type
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {application.opportunity?.type || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Opportunity Details
        </h2>
        {application.opportunity?.description ? (
          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {application.opportunity.description}
          </p>
        ) : (
          <p className="text-gray-500">No description available</p>
        )}

        {application.opportunity?.location && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Location:</span>{' '}
              {application.opportunity.location}
            </p>
          </div>
        )}

        {application.opportunity?.deadline && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Application Deadline:</span>{' '}
              {formatDate(application.opportunity.deadline)}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      {history && history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Application Timeline
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
