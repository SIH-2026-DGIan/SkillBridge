'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Building2, Layers, Users } from 'lucide-react';
import { toast } from 'sonner';
import { setSession, type UserRole } from '@/lib/user-session';

const ROLE_PRESETS = [
  { role: 'student' as UserRole, name: 'Tanushri Sharma', label: 'Student', icon: GraduationCap, color: 'text-indigo-600' },
  { role: 'industry' as UserRole, name: 'Rohan Mehta', label: 'Recruiter', icon: Building2, color: 'text-rose-600' },
  { role: 'institution' as UserRole, name: 'Dr. Priya Nair', label: 'College TPO', icon: Layers, color: 'text-emerald-600' },
  { role: 'academician' as UserRole, name: 'Prof. Amit Gupta', label: 'Faculty', icon: Users, color: 'text-amber-600' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('tanushri@skillbridge.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Try Supabase Auth if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasSupabase = supabaseUrl && supabaseUrl !== 'your_supabase_project_url';

      let userName = ROLE_PRESETS.find((r) => r.role === selectedRole)?.name ?? 'User';

      if (hasSupabase) {
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error && data?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, role')
              .eq('user_id', data.user.id)
              .single();
            if (profile?.name) userName = profile.name;
          }
        } catch (supaErr) {
          console.warn('Supabase sign in skipped/fallback:', supaErr);
        }
      }

      // 2. Set Session & Route
      const session = setSession({
        id: `user-${Date.now()}`,
        name: userName,
        email,
        role: selectedRole,
      });

      toast.success(`Welcome back, ${session.name}!`);
      router.push(`/${selectedRole}/dashboard`);
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-playful flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="SkillBridge" width={130} height={34} className="h-8 w-auto object-contain" />
            </Link>

          <Link
            href="/signup"
            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 shadow-sm transition-colors"
          >
            Create Free Account →
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-black mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Secure Role-Based Access
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Select your role to continue to your dashboard.
            </p>
          </div>

          {/* Quick Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-4 p-1.5 bg-slate-200/80 rounded-2xl">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.role}
                type="button"
                onClick={() => setSelectedRole(preset.role)}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  selectedRole === preset.role
                    ? 'bg-white text-slate-900 shadow-md font-extrabold scale-100'
                    : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                <preset.icon className={`w-4 h-4 mx-auto mb-1 ${preset.color}`} />
                <span className="text-[11px] block truncate">{preset.label}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={handleLogin}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-4"
          >
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@domain.edu"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 bouncy-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to {ROLE_PRESETS.find((r) => r.role === selectedRole)?.label} Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center space-y-3">
            <p className="text-xs text-slate-500 font-semibold">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-bold">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <Link
              href="/demo"
              className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-2xl hover:bg-amber-100 transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              Explore Sandbox Lounge (Instant Demo)
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-4 bg-white text-center text-xs text-slate-500 font-semibold">
        SkillBridge · AI Skill Intelligence Platform
      </footer>
    </div>
  );
}
