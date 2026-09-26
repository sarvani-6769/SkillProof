import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Mail, Lock, LogIn, ArrowRight, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isVerifier } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered')) {
      const emailParam = searchParams.get('email');
      if (emailParam) {
        setFormData((prev) => ({ ...prev, email: emailParam }));
      }
      setSuccessMsg('Account registered successfully! Please sign in with your credentials to access your dashboard.');
    }
    if (searchParams.get('session_expired')) {
      toast.warning('Your session has expired. Please sign in again.');
    }
    if (isAuthenticated) {
      navigate(isVerifier ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isVerifier, navigate, searchParams, toast]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await login(formData.email, formData.password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'verifier' || res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
        toast.error(res.message || 'Login failed');
      }
    } catch (err) {
      let msg = err.response?.data?.message || err.response?.data?.error?.message;
      if (!msg) {
        if (!err.response || err.code === 'ERR_NETWORK' || err.response?.status === 404) {
          msg = 'Cannot connect to backend server. Please verify Render backend is online.';
        } else if (err.response?.status === 401 && err.response?.data?.protection) {
          msg = 'Vercel Deployment Protection is blocking requests. Please disable Deployment Protection in your Vercel Project Settings.';
        } else {
          msg = 'Invalid email or password.';
        }
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick filler
  const fillDemo = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900">SkillProof</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your verified profile and verification workspace
          </p>
        </div>

        {/* Demo Accounts Quick-Select Card */}
        <div className="mb-6 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
          <p className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-rose-600" />
            Instant Demo Logins (Click to Auto-fill)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('alex@skillproof.edu', 'password123')}
              className="px-2.5 py-1.5 bg-white text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white transition shadow-xs"
            >
              🎓 Alex (Student)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('priya@skillproof.edu', 'password123')}
              className="px-2.5 py-1.5 bg-white text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white transition shadow-xs"
            >
              ⏳ Priya (Pending)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('verifier@skillproof.edu', 'admin123')}
              className="px-2.5 py-1.5 bg-white text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-600 hover:text-white transition shadow-xs"
            >
              🛡️ Dr. Marcus (Verifier)
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-rose-600 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
