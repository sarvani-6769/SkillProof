import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isVerifier, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-rose-600 transition">
                Skill<span className="text-rose-600">Proof</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200/60">
                Verified
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
          <Link
            to="/search"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              isActive('/search')
                ? 'text-rose-600 bg-rose-50/80'
                : 'hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search Profiles</span>
          </Link>

          {isAuthenticated ? (
            <>
              {isStudent && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/dashboard')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/certificates"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/certificates')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Certificates
                  </Link>
                  <Link
                    to="/projects"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/projects')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Projects
                  </Link>
                  <Link
                    to="/verification-requests"
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl transition ${
                      isActive('/verification-requests')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <FileCheck className="w-4 h-4 text-slate-400" />
                    <span>Verifications</span>
                  </Link>
                </>
              )}

              {isVerifier && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/admin')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Verifier Dashboard
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/admin/requests')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Review Queue
                  </Link>
                  <Link
                    to="/admin/students"
                    className={`px-3 py-2 rounded-xl transition ${
                      isActive('/admin/students')
                        ? 'text-rose-600 bg-rose-50/80'
                        : 'hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Students Directory
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <a
                href="#features"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/70 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/70 transition"
              >
                Verification Flow
              </a>
            </>
          )}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-white"
              >
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-semibold text-rose-600 uppercase mt-0.5">
                    {user?.role}
                  </p>
                </div>
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-up">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {user?.role === 'verifier' ? 'Official Verifier' : 'Student'}
                    </span>
                  </div>

                  {isStudent && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Edit Profile
                      </Link>
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/50 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Public Profile
                      </Link>
                    </>
                  )}

                  {isVerifier && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Verifier Console
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-500/20 transition-all hover:scale-[1.02]"
              >
                Get Verified
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-slide-in">
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Search Profiles
          </Link>

          {isAuthenticated ? (
            <>
              {isStudent && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/skills"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Skills
                  </Link>
                  <Link
                    to="/certificates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Certificates
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Internships
                  </Link>
                  <Link
                    to="/achievements"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Achievements
                  </Link>
                  <Link
                    to="/verification-requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Verification Tracker
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Public Profile
                  </Link>
                </>
              )}

              {isVerifier && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review Queue
                  </Link>
                  <Link
                    to="/admin/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Students Directory
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-white bg-rose-600 rounded-xl"
              >
                Get Verified
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
