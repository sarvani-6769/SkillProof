import React from 'react';
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
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-sky-200/30 to-purple-200/40 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>The Next Generation Student Credential Verification Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.15]">
          Turn Your Achievements into{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
            Verifiable Career Proof
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          SkillProof empowers students to aggregate skills, certificates, projects, internships, and awards in one authenticated portfolio. Every claim is backed by uploaded proof and verified by authorized academic and industry reviewers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-indigo-500/35 hover:scale-[1.02] transition-all"
          >
            <span>Create Verified Profile</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-700 font-bold text-base border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Search className="w-5 h-5 text-slate-400" />
            <span>Search Student Directory</span>
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-base hover:bg-slate-200 transition-all"
          >
            <span>Demo Logins</span>
          </Link>
        </div>

        {/* Floating Verified Trust Badges */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto flex flex-wrap items-center justify-around gap-6 text-slate-600 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Cryptographic Verified Badges</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-500" />
            <span>Document & Proof Review</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-500" />
            <span>JWT Secure Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <span>Recruiter-Ready Profiles</span>
          </div>
        </div>
      </section>

      {/* What is SkillProof Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 block">
              The Credential Dilemma Solved
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
              What is SkillProof?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              In modern hiring, resumes often suffer from exaggerated skills and unverified certificates. SkillProof bridges this gap by establishing an authentic, tamper-resistant skill repository where every certificate, internship, project, and coding achievement can be verified by authorized evaluators.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">For Students</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Stand out with verifiable credentials that give recruiters instant confidence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">For Recruiters</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Eliminate false claims with 1-click proof inspection and verifiable credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            End-To-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SkillProof Verification Works
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            From initial student submission to authorized review and public shareable badge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Add Skills & Records',
              desc: 'Enter your technical skills, certificates, software projects, internships, and awards.',
              icon: Code2,
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              step: '02',
              title: 'Upload Official Proof',
              desc: 'Attach PDF certificates, completion letters, repo links, or verification credential IDs.',
              icon: UploadCloud,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              step: '03',
              title: 'Authorized Verification',
              desc: 'Verifier reviews the documentation, audits authenticity, and approves with remarks.',
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              step: '04',
              title: 'Share Verified Profile',
              desc: 'Get your verified public portfolio URL with verifiable badges to share with top recruiters.',
              icon: Share2,
              color: 'text-purple-600 bg-purple-50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`p-3 rounded-2xl ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            Comprehensive Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Transparency and Academic Rigor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Skills Matrix with Proficiency Levels',
              desc: 'Categorize your skills across Web Dev, AI/ML, Cloud, Databases, and Soft Skills with Beginner to Expert ratings.',
              icon: Code2,
            },
            {
              title: 'Certificates with Proof Document Storage',
              desc: 'Upload multi-page PDFs or image credentials with credential IDs and issuer registry links.',
              icon: Award,
            },
            {
              title: 'Verified Project Portfolios',
              desc: 'Showcase repositories, live demo URLs, project roles, duration, and architectural documentation.',
              icon: Shield,
            },
            {
              title: 'Internship & Work Experience Tracking',
              desc: 'Validate work terms, company roles, technologies used, and official completion letters.',
              icon: Briefcase,
            },
            {
              title: 'Hackathons & Award Recognition',
              desc: 'Highlight coding competitions, publications, and scholastic achievements with verifiable proofs.',
              icon: Trophy,
            },
            {
              title: 'Verifier & Admin Console',
              desc: 'Dedicated workflow for institutional verifiers to inspect submissions, verify proofs, and leave remarks.',
              icon: ShieldCheck,
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dual Benefits Section: Students vs Verifiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Benefits Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Benefits for Students</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>One unified home for all professional accomplishments</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Distinct verified badges that make your resume stand out</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Shareable public profile link for LinkedIn, CV, and recruiter emails</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Transparent feedback and rejection remarks if proof needs updating</span>
              </li>
            </ul>
          </div>

          {/* Recruiter / Verifier Benefits Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="inline-flex p-3 rounded-2xl bg-sky-50 text-sky-600 mb-6">
              <Building className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Benefits for Recruiters & Verifiers</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>Zero fake credentials — inspect original uploaded proofs directly</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>Powerful talent search by student name, college, skill, or technology</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>Streamlined 1-click verification queue with audit trails</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>Confidence in candidate ability before scheduling interviews</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Build Your Verified Skill Profile?
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Join thousands of university students showcasing their authenticated engineering and leadership achievements to top employers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-slate-50 transition"
            >
              Get Started for Free
            </Link>
            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-950/40 text-white font-semibold rounded-xl border border-indigo-400/30 hover:bg-indigo-950/60 transition"
            >
              Explore Public Profiles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
