import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Shield, Heart } from 'lucide-react';

const PublicLayout = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-slate-900">SkillProof</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                The trusted student skill, certificate, and achievement verification platform powering authentic talent discovery.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                For Students
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/register" className="hover:text-rose-600">Create Profile</Link></li>
                <li><Link to="/search" className="hover:text-rose-600">Explore Directory</Link></li>
                <li><Link to="/login" className="hover:text-rose-600">Submit Verification</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                For Verifiers & Recruiters
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/login" className="hover:text-rose-600">Verifier Portal</Link></li>
                <li><Link to="/search" className="hover:text-rose-600">Search Talent</Link></li>
                <li><a href="#how-it-works" className="hover:text-rose-600">Verification Protocol</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                System Info
              </h5>
              <p className="text-xs text-slate-500 mb-2">
                Built with React, Express, MongoDB Atlas, and cryptographic verification badges.
              </p>
              <div className="flex items-center gap-3 text-slate-400 mt-3">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} SkillProof Platform. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Integrity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
