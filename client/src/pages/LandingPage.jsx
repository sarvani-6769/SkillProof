import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Award,
  Code2,
  Briefcase,
  Trophy,
  Search,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Share2,
  Sparkles,
  Lock,
  GraduationCap,
  Building,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  FileText,
  BadgeCheck,
  Check,
  UserCheck,
} from 'lucide-react';
import SkillProofThreeScene from '../components/SkillProofThreeScene';
import HolographicVerificationBadge from '../components/HolographicVerificationBadge';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedSkillTab, setSelectedSkillTab] = useState('tech');
  const [selectedAchievementTab, setSelectedAchievementTab] = useState('cert');

  // Track active section for floating chapter rail
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'achievements', 'verification', 'profile', 'recruiters', 'cta'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const chapters = [
    { id: 'hero', num: '01', title: 'Hero' },
    { id: 'about', num: '02', title: 'About' },
    { id: 'skills', num: '03', title: 'Skills' },
    { id: 'achievements', num: '04', title: 'Achievements' },
    { id: 'verification', num: '05', title: 'Verification' },
    { id: 'profile', num: '06', title: 'Profile' },
    { id: 'recruiters', num: '07', title: 'Recruiters' },
    { id: 'cta', num: '08', title: 'Get Started' },
  ];

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 font-onest selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* 3D Three.js Interactive Constellation & Mesh Canvas */}
      <SkillProofThreeScene />

      {/* Floating Kage-Inspired Chapter Rail on the Right */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3.5 pointer-events-auto"
        aria-label="Chapter Rail"
      >
        {chapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => scrollToSection(ch.id)}
            className="group flex items-center gap-3 text-right cursor-pointer"
          >
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                activeSection === ch.id ? 'text-red-400 opacity-100' : 'text-slate-400'
              }`}
            >
              {ch.num} {ch.title}
            </span>
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === ch.id
                  ? 'bg-red-500 scale-150 shadow-[0_0_12px_#e0231c]'
                  : 'bg-white/20 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060913]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-400 p-0.5 shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center text-white">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-red-400 transition">
                  Skill<span className="text-red-500">Proof</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-950/60 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  Verified
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">Student Verification</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-slate-300">
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('skills')}
              className="hover:text-white transition cursor-pointer"
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('achievements')}
              className="hover:text-white transition cursor-pointer"
            >
              Achievements
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('verification')}
              className="hover:text-white transition cursor-pointer"
            >
              Verification
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('profile')}
              className="hover:text-white transition cursor-pointer"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('recruiters')}
              className="hover:text-white transition cursor-pointer"
            >
              Recruiters
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 border border-white/15 rounded-full hover:border-red-500/60 hover:text-white hover:bg-white/5 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg shadow-red-600/30 transition-all hover:scale-[1.03]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 space-y-36 pb-28">
        {/* ======================================================== 1. HERO */}
        <section id="hero" className="relative pt-12 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
            {/* Left Column: Heading, Copy, CTAs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-semibold text-white">SkillProof</span>
                <span className="text-slate-400">&bull;</span>
                <span>Student Skill &amp; Achievement Verification Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
                Prove Your Skills.{' '}
                <span className="bg-gradient-to-r from-red-500 via-rose-400 to-rose-400 bg-clip-text text-transparent">
                  Showcase Your Achievements.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-light">
                Build a trusted digital profile of your skills, projects, certifications, internships, and achievements — all in one place. Every claim is validated by authorized academic and industry evaluators.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 hover:bg-red-700 hover:scale-[1.02] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/15 text-slate-200 font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Explore Platform</span>
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-full text-slate-400 hover:text-white text-sm font-medium transition"
                >
                  Sign In &rarr;
                </Link>
              </div>

              {/* Quick Jump Chapter Pills */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Jump To Chapter</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    01 About
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('skills')}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    02 Skills
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('achievements')}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    03 Achievements
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('verification')}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    04 Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('profile')}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    05 Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Holographic Verification Badge Centerpiece */}
            <div className="lg:col-span-5 flex justify-center">
              <HolographicVerificationBadge />
            </div>
          </div>
        </section>

        {/* ======================================================== 2. ABOUT SKILLPROOF */}
        <section id="about" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="glass-kage rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden">
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Chapter 02 &bull; The Verification Dilemma Solved</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                Your Skills. Your Proof.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-6">
                Students have skills, certificates, projects, internships, achievements and other accomplishments, but these are often scattered across different platforms and difficult for recruiters or institutions to verify.
              </p>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-10">
                SkillProof provides a centralized platform where students can maintain their verified skills and achievements and organizations can review credible student profiles with instant proof inspection and cryptographic audit trails.
              </p>
            </div>

            {/* 4 Metric Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-500 font-mono">100%</span>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Tamper-Proof</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Audited by reviewers</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">1-Click</span>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Proof Inspection</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct document audit</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">360&deg;</span>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Student Profile</p>
                <p className="text-[11px] text-slate-500 mt-0.5">All credentials unified</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Zero</span>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Fake Claims</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Eliminates resume fluff</p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== 3. SKILLS */}
        <section id="skills" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
              Chapter 03 &bull; Competency Framework
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Show What You Can Do
            </h2>
            <p className="text-slate-400 mt-4 text-base font-light">
              Organize and validate your technical, programming, and core competencies with standardized proficiency ratings.
            </p>

            {/* Category Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-full bg-white/5 border border-white/10 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedSkillTab('tech')}
                className={`px-5 py-2 rounded-full transition font-semibold cursor-pointer ${
                  selectedSkillTab === 'tech' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Technical &amp; Systems
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkillTab('web')}
                className={`px-5 py-2 rounded-full transition font-semibold cursor-pointer ${
                  selectedSkillTab === 'web' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Web Development
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkillTab('ai')}
                className={`px-5 py-2 rounded-full transition font-semibold cursor-pointer ${
                  selectedSkillTab === 'ai' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Data &amp; AI
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkillTab('soft')}
                className={`px-5 py-2 rounded-full transition font-semibold cursor-pointer ${
                  selectedSkillTab === 'soft' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Leadership
              </button>
            </div>
          </div>

          {/* 3 Interactive Cards with Kage-style Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-kage-card rounded-3xl p-7 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Technical &amp; Programming</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                  Fundamental algorithms, object-oriented design, systems programming, and high-performance computing.
                </p>
                <div className="space-y-2">
                  {['Python (Advanced)', 'C++ & Algorithms (Expert)', 'Java Enterprise (Intermediate)', 'Cloud Architecture (Advanced)'].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/5">
                      <span className="text-slate-200">{s.split('(')[0]}</span>
                      <span className="text-[10px] font-bold text-rose-400">{s.split('(')[1].replace(')', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified with GitHub &amp; Exams</span>
                <BadgeCheck className="w-4 h-4 text-rose-400" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-kage-card rounded-3xl p-7 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Web Development &amp; Full-Stack</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                  Modern client &amp; server application architecture, responsive design, REST/GraphQL APIs, and state management.
                </p>
                <div className="space-y-2">
                  {['React.js & Next.js (Expert)', 'Node.js & Express (Advanced)', 'PostgreSQL & MongoDB (Advanced)', 'Tailwind CSS (Expert)'].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/5">
                      <span className="text-slate-200">{s.split('(')[0]}</span>
                      <span className="text-[10px] font-bold text-red-400">{s.split('(')[1].replace(')', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified with Live Repositories</span>
                <BadgeCheck className="w-4 h-4 text-red-400" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-kage-card rounded-3xl p-7 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Data, AI &amp; Professional Skills</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                  Machine learning pipelines, data visualization, technical documentation, and cross-functional team leadership.
                </p>
                <div className="space-y-2">
                  {['Machine Learning Models (Intermediate)', 'Data Analytics & SQL (Advanced)', 'Technical Communication (Advanced)', 'Agile Teamwork (Expert)'].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/5">
                      <span className="text-slate-200">{s.split('(')[0]}</span>
                      <span className="text-[10px] font-bold text-amber-400">{s.split('(')[1].replace(')', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified with Peer &amp; Mentor Review</span>
                <BadgeCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== 4. ACHIEVEMENTS */}
        <section id="achievements" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
              Chapter 04 &bull; Verified Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Every Achievement Matters
            </h2>
            <p className="text-slate-400 mt-4 text-base font-light">
              From academic honors to production software and corporate internships, validate every milestone with official artifacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                id: 'cert',
                title: 'Certifications',
                desc: 'Upload multi-page PDFs with credential IDs and issuing registry links.',
                icon: Award,
                tag: 'Official Proof',
              },
              {
                id: 'proj',
                title: 'Projects',
                desc: 'Showcase repositories, live demo URLs, architectural docs, and team roles.',
                icon: Code2,
                tag: 'Live Deployed',
              },
              {
                id: 'intern',
                title: 'Internships',
                desc: 'Validate work terms, corporate roles, technologies used, and manager completion letters.',
                icon: Briefcase,
                tag: 'Work Term',
              },
              {
                id: 'hack',
                title: 'Hackathons',
                desc: 'Highlight coding competitions, winning demos, and technical symposium workshops.',
                icon: Trophy,
                tag: 'Merit Honors',
              },
              {
                id: 'acad',
                title: 'Awards & Academic',
                desc: 'Scholastic achievements, institutional scholarships, publications, and dean’s list citations.',
                icon: GraduationCap,
                tag: 'Accredited',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="glass-kage-card rounded-2xl p-6 flex flex-col justify-between group hover:border-red-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center text-[11px] text-red-400 font-semibold gap-1">
                    <span>Explore details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== 5. VERIFICATION */}
        <section id="verification" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="glass-kage rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
                Chapter 05 &bull; Authenticity Protocol
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Make Your Achievements Trustworthy
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                SkillProof is designed around verification so achievements can be supported by credible evidence rather than simply self-claimed information. Every entry carries an auditable trail.
              </p>
            </div>

            {/* 4-Step Verification Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Student Submission',
                  desc: 'Input achievement details, certificate IDs, repository links, and upload supporting document PDFs.',
                  icon: UploadCloud,
                  color: 'text-rose-400',
                },
                {
                  step: '02',
                  title: 'Official Proof Audit',
                  desc: 'Document authenticity is verified against issuing authority registries and supervisor completion letters.',
                  icon: FileCheck2,
                  color: 'text-amber-400',
                },
                {
                  step: '03',
                  title: 'Authorized Review',
                  desc: 'University verifiers and institutional evaluators review evidence, record comments, and approve claims.',
                  icon: ShieldCheck,
                  color: 'text-red-400',
                },
                {
                  step: '04',
                  title: 'Cryptographic Badge',
                  desc: 'The student receives an immutable verified badge on their public profile, instantly inspectable by recruiters.',
                  icon: BadgeCheck,
                  color: 'text-emerald-400',
                },
              ].map((st, i) => {
                const Icon = st.icon;
                return (
                  <div key={i} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`p-2.5 rounded-xl bg-white/5 ${st.color}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="font-mono text-2xl font-black text-slate-500">{st.step}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{st.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== 6. STUDENT PROFILE */}
        <section id="profile" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 block">
                Chapter 06 &bull; Centralized Portfolio
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                One Profile. Everything That Matters.
              </h2>
              <p className="text-base text-slate-300 font-light leading-relaxed">
                Replace fragmented resumes and outdated LinkedIn links with a single authenticated digital portfolio showcasing your complete academic and professional journey.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Personal Information & Verified Identity',
                  'Skills Matrix with Proficiency Levels',
                  'Audited Certifications with Document Viewer',
                  'Verified Software & Hardware Projects',
                  'Work Terms & Internship Endorsements',
                  'Cryptographic Verification Status Badge',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition"
                >
                  <span>Build Your Profile Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Profile Interactive Mockup */}
            <div className="lg:col-span-7">
              <div className="glass-kage rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
                {/* Header Mockup */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center font-bold text-white text-xl ring-2 ring-white/10">
                      SK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">Sathuluri Keerthana</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Software Engineering &bull; Roll: #2022-CS-108</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                      Public URL: /profile/keerthana
                    </span>
                  </div>
                </div>

                {/* Profile Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Verified Skills</p>
                    <p className="text-lg font-bold text-white mt-1">12 Mastered</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">&bull; 4 Expert Ratings</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Certificates</p>
                    <p className="text-lg font-bold text-white mt-1">6 Audited</p>
                    <p className="text-[11px] text-amber-400 mt-0.5">&bull; Proof Docs Attached</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Work Terms</p>
                    <p className="text-lg font-bold text-white mt-1">2 Internships</p>
                    <p className="text-[11px] text-rose-400 mt-0.5">&bull; Corporate Endorsed</p>
                  </div>
                </div>

                {/* Audit Trail Badge */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Cryptographic Verification Active</p>
                      <p className="text-[11px] text-slate-400">Institutional Review Complete with Verification Remarks</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Audit Passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== 7. RECRUITER / ORGANIZATION */}
        <section id="recruiters" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="glass-kage rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block">
                  Chapter 07 &bull; Organization Portal
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Discover Verified Talent
                </h2>
                <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                  Recruiters and academic organizations can review student profiles and evaluate skills and achievements more efficiently. Eliminate hours wasted cross-referencing claims.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="font-bold text-white text-sm mb-1">1-Click Proof Inspection</h4>
                    <p className="text-xs text-slate-400 font-light">Inspect original certificates, completion letters, and repos instantly.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="font-bold text-white text-sm mb-1">Search Student Directory</h4>
                    <p className="text-xs text-slate-400 font-light">Filter by technical skill, college, graduation year, or verified status.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Student Directory</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-red-950/40 border border-white/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-slate-300 uppercase">Verifier Queue</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Live Queue
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">AWS Cloud Practitioner</p>
                        <p className="text-[10px] text-slate-400">PDF &amp; ID Validated</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">Approved</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Full-Stack E-Commerce</p>
                        <p className="text-[10px] text-slate-400">GitHub Verified</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">Approved</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Google Summer of Code</p>
                        <p className="text-[10px] text-slate-400">Completion Letter Attached</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== 8. FINAL CTA */}
        <section id="cta" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16">
          <div className="glass-kage rounded-3xl p-10 sm:p-16 border border-white/15 text-center relative overflow-hidden shadow-2xl">
            {/* Ambient Red Bloom */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

            <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 block">
              Chapter 08 &bull; Final Step
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto">
              Build Your Proof. Build Your Future.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of university students showcasing their authenticated engineering and leadership achievements to top employers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 hover:bg-red-700 hover:scale-[1.03] transition-all"
              >
                <span>Create Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Colophon */}
      <footer className="relative z-10 border-t border-white/10 bg-[#04060c] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-white">SkillProof</span>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                The trusted student skill, certificate, and achievement verification platform powering authentic career discovery.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                Platform Chapters
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400 font-light">
                <li><button type="button" onClick={() => scrollToSection('about')} className="hover:text-white transition cursor-pointer">About SkillProof</button></li>
                <li><button type="button" onClick={() => scrollToSection('skills')} className="hover:text-white transition cursor-pointer">Skills Matrix</button></li>
                <li><button type="button" onClick={() => scrollToSection('achievements')} className="hover:text-white transition cursor-pointer">Achievements</button></li>
                <li><button type="button" onClick={() => scrollToSection('verification')} className="hover:text-white transition cursor-pointer">Verification Flow</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                For Students &amp; Recruiters
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400 font-light">
                <li><Link to="/register" className="hover:text-white transition">Create Profile</Link></li>
                <li><Link to="/search" className="hover:text-white transition">Search Directory</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Student Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Verifier Console</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                Verification Architecture
              </h5>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-3">
                Engineered with React, Node.js, Express, MongoDB Atlas, Three.js and cryptographic audit trails.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Verification Core Operational</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} SkillProof Platform. All rights reserved.</p>
            <p>Built for Academic &amp; Professional Integrity</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
