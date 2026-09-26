import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Code2,
  Sparkles,
  Lock,
  ExternalLink,
  Cpu,
} from 'lucide-react';

const HolographicVerificationBadge = () => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-rose-600/30 to-amber-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10 animate-pulse"></div>

      {/* Holographic Card Container */}
      <div
        ref={cardRef}
        className="relative rounded-3xl p-6 sm:p-7 glass-kage-card border border-white/10 shadow-2xl transition-transform duration-200 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Light Leak Reflection Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(224,35,28,0.08) 35%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-400 p-0.5 shadow-lg shadow-red-600/20">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[14px] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wide text-white">SkillProof</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Cryptographic Credential ID: #SKP-8829-AZ</p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition">
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Student Credential Body */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-white text-lg ring-2 ring-white/10 shrink-0">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white truncate">Ananya Kumar</h4>
                <span className="text-[11px] text-slate-400">B.Tech Computer Science</span>
              </div>
              <p className="text-xs text-slate-400 truncate">Stanford University &bull; Class of 2026</p>
            </div>
          </div>

          {/* Verified Highlights Chips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Full-Stack Skill</p>
                <p className="text-xs font-semibold text-white truncate">React &bull; Node &bull; Python</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">AWS Solutions</p>
                <p className="text-xs font-semibold text-white truncate">Audited Certificate</p>
              </div>
            </div>
          </div>

          {/* Audit Verification Proof Status Bar */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Proof Document Validated
              </span>
              <span className="text-emerald-400 font-bold">100% Verified</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Verified by Department Reviewer & Industry Evaluator with cryptographic tamper-resistant hash.
            </p>
          </div>
        </div>

        {/* Footer info & Watermark */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            JWT Encrypted Authenticity
          </span>
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            Live Portfolio <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HolographicVerificationBadge;
