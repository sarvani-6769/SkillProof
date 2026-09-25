import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import VerificationBadge from '../components/VerificationBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Code2,
  Award,
  Layers,
  Briefcase,
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." size="lg" />;
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  const { stats, recentActivity } = data || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Student Credential Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              {user?.college ? `${user.college} • ` : ''}
              {user?.degree ? `${user.degree} ${user?.branch ? `(${user.branch})` : ''}` : 'Manage your verified credentials'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.username && (
              <Link
                to={`/profile/${user.username}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Profile</span>
              </Link>
            )}
            <Link
              to="/certificates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition shadow-md shadow-indigo-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Credential</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-xs font-semibold text-slate-300">
              Profile Completeness: <span className="text-white font-bold">{stats?.profileCompletion || 0}%</span>
            </div>
            <div className="w-48 sm:w-64 h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${stats?.profileCompletion || 0}%` }}
              ></div>
            </div>
          </div>
          {stats?.profileCompletion < 100 && (
            <Link
              to="/profile"
              className="text-xs text-indigo-300 hover:text-white font-medium flex items-center gap-1 transition"
            >
              <span>Complete remaining details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Skills"
          value={stats?.totalSkills || 0}
          subtext={`${stats?.verifiedSkills || 0} Verified`}
          icon={Code2}
          color="indigo"
        />
        <StatCard
          title="Certificates"
          value={stats?.totalCertificates || 0}
          subtext={`${stats?.verifiedCertificates || 0} Verified`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Projects"
          value={stats?.totalProjects || 0}
          subtext={`${stats?.verifiedProjects || 0} Verified`}
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Internships"
          value={stats?.totalInternships || 0}
          subtext={`${stats?.verifiedInternships || 0} Verified`}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Achievements"
          value={stats?.totalAchievements || 0}
          subtext={`${stats?.verifiedAchievements || 0} Verified`}
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="In Review"
          value={stats?.pendingRequests || 0}
          subtext="Pending Verifications"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/certificates"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Upload Certificate
            </h4>
            <p className="text-xs text-slate-500">Attach proof & submit</p>
          </div>
        </Link>

        <Link
          to="/projects"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Add Project
            </h4>
            <p className="text-xs text-slate-500">Showcase code & demos</p>
          </div>
        </Link>

        <Link
          to="/skills"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Manage Skills
            </h4>
            <p className="text-xs text-slate-500">Update proficiency levels</p>
          </div>
        </Link>

        <Link
          to="/verification-requests"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Verification Tracker
            </h4>
            <p className="text-xs text-slate-500">Check review remarks</p>
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Recent Verification Queue & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Status Activity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verification Requests</h3>
                <p className="text-xs text-slate-500">Status of your submitted proof reviews</p>
              </div>
              <Link
                to="/verification-requests"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentActivity?.requests && recentActivity.requests.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.requests.map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {req.itemType}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {req.itemTitle}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <VerificationBadge status={req.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No active verification requests.</p>
                <Link
                  to="/certificates"
                  className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Submit a certificate for review →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Added Credentials */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Credentials</h3>
                <p className="text-xs text-slate-500">Latest certificates & achievements</p>
              </div>
              <Link
                to="/certificates"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentActivity?.certificates && recentActivity.certificates.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{cert.title}</h5>
                        <p className="text-[11px] text-slate-500 truncate">{cert.organization}</p>
                      </div>
                    </div>
                    <VerificationBadge status={cert.verificationStatus} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No certificates added yet.</p>
                <Link
                  to="/certificates"
                  className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Add your first certificate →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
