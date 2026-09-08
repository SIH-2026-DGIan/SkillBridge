import { FileText, ArrowRight, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: 'applied' | 'in-review' | 'accepted' | 'rejected' | 'interview';
  appliedDate: string;
}

export function ApplicationsPreview({ applications }: { applications: Application[] }) {
  const activeApps = applications.slice(0, 3);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          Your Applications
        </h2>
        {applications.length > 0 && (
          <Link href="/student/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View All
          </Link>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        {activeApps.length === 0 ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">No active applications</div>
              <div className="text-xs text-slate-500 mt-1">Applications you submit will appear here so you can track your progress.</div>
            </div>
            <Link href="/student/opportunities" className="inline-flex items-center justify-center w-full px-4 py-2 mt-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
              Explore Opportunities &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeApps.map((app) => (
              <Link key={app.id} href="/student/applications" className="block group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {app.role}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {app.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold text-[10px] capitalize">
                      {app.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            <Link href="/student/applications" className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors">
              Track {applications.length} Applications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
