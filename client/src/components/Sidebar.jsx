import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  Award,
  Briefcase,
  Trophy,
  FileCheck,
  User,
  ExternalLink,
  Users,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isStudent, isVerifier } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skills', path: '/skills', icon: Code2 },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Projects', path: '/projects', icon: Layers },
    { name: 'Internships', path: '/internships', icon: Briefcase },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Verifications', path: '/verification-requests', icon: FileCheck },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  const verifierLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Review Queue', path: '/admin/requests', icon: Clock },
    { name: 'Verified Records', path: '/admin/records', icon: CheckCircle },
    { name: 'Students Directory', path: '/admin/students', icon: Users },
  ];

  const links = isVerifier ? verifierLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden lg:flex">
      <div>
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/60 mb-6">
          <div className="flex items-center gap-3">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">
                {user?.name}
              </h4>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>

          {isStudent && user?.profileCompletion !== undefined && (
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Profile Completion</span>
                <span className="text-indigo-600">{user.profileCompletion}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${user.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/dashboard' || link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Public profile quick link */}
      {isStudent && user?.username && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <NavLink
            to={`/profile/${user.username}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-100/60 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Portfolio View
            </span>
            <span className="text-[10px] bg-indigo-200/60 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
              LIVE
            </span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
