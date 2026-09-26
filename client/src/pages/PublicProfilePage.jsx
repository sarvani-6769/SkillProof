import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import VerificationBadge from '../components/VerificationBadge';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheck,
  Award,
  Code2,
  Briefcase,
  Trophy,
  Layers,
  GraduationCap,
  MapPin,
  Globe,
  Share2,
  CheckCircle2,
  ExternalLink,
  Printer,
  Sparkles,
  FileText,
  Calendar,
  Key,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';

const PublicProfilePage = () => {
  const { username } = useParams();
  const toast = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'verified_only'

  // Proof viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: '',
    remarks: '',
  });

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/users/${username}`);
        if (res.data.success) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError(err.response?.data?.message || 'Profile not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Public profile URL copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message={`Loading @${username}'s verified portfolio...`} size="lg" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-md">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Student Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'No verified profile matches this username.'}</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Explore All Student Profiles
        </Link>
      </div>
    );
  }

  const { user, stats, skills, certificates, projects, internships, achievements, verifiedOnly } =
    profileData;

  const displayedSkills = activeTab === 'verified_only' ? verifiedOnly.skills : skills;
  const displayedCerts = activeTab === 'verified_only' ? verifiedOnly.certificates : certificates;
  const displayedProjects = activeTab === 'verified_only' ? verifiedOnly.projects : projects;
  const displayedInternships = activeTab === 'verified_only' ? verifiedOnly.internships : internships;
  const displayedAchievements = activeTab === 'verified_only' ? verifiedOnly.achievements : achievements;

  const totalVerifiedCount =
    (stats?.verifiedSkills || 0) +
    (stats?.verifiedCertificates || 0) +
    (stats?.verifiedProjects || 0) +
    (stats?.verifiedInternships || 0) +
    (stats?.verifiedAchievements || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Verification Shield Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        {/* Accent Banner background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 -z-0"></div>

        <div className="relative z-10 pt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div className="relative">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-rose-600 text-white flex items-center justify-center font-black text-4xl ring-4 ring-white shadow-xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <div
                className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-xl shadow-md ring-2 ring-white"
                title="SkillProof Authenticated Profile"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Student
                </span>
              </div>

              <p className="text-xs font-mono text-rose-600 font-semibold mb-2">
                @{user.username}
              </p>

              {user.college && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <strong>{user.college}</strong>
                  </span>
                  {user.degree && (
                    <span>
                      {user.degree} {user.branch ? `in ${user.branch}` : ''}
                      {user.graduationYear ? ` ('${user.graduationYear})` : ''}
                    </span>
                  )}
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {user.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Socials & Share / Export Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 self-center sm:self-end">
            <div className="flex items-center gap-2">
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 transition"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {user.portfolio && (
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-600 transition"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200/60"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {user.bio}
            </p>
          </div>
        )}

        {/* Authenticated Verification Tally Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-rose-50/50 to-slate-50 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                SkillProof Verified Index
              </h4>
              <p className="text-xs text-slate-500">
                {totalVerifiedCount} credentials cryptographically verified by authorized evaluators
              </p>
            </div>
          </div>

          {/* Toggle between All Items and Verified Only */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verified_only')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                activeTab === 'verified_only'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Skills Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Technical & Core Skills ({displayedSkills.length})
            </h2>
          </div>
        </div>

        {displayedSkills.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedSkills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {skill.category}
                  </span>
                  <VerificationBadge status={skill.verificationStatus} size="sm" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{skill.name}</h4>
                <p className="text-xs text-rose-600 font-semibold mt-1">{skill.proficiency}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skills listed under current filter.</p>
        )}
      </section>

      {/* Verified Certificates Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Certifications & Credentials ({displayedCerts.length})
            </h2>
          </div>
        </div>

        {displayedCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedCerts.map((cert) => (
              <div
                key={cert._id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        {cert.organization}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{cert.title}</h4>
                    </div>
                    <VerificationBadge status={cert.verificationStatus} size="sm" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 mt-3">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    {cert.credentialId && (
                      <p className="flex items-center gap-1.5 font-mono text-slate-700">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.description && (
                      <p className="text-slate-600 pt-1 leading-relaxed">{cert.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Issuer Registry
                    </a>
                  ) : (
                    <span></span>
                  )}

                  {cert.proof && (
                    <button
                      type="button"
                      onClick={() =>
                        setProofViewer({
                          isOpen: true,
                          proofUrl: cert.proof,
                          title: cert.title,
                          itemType: 'Certificate',
                          remarks: cert.verificationRemarks,
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-rose-600"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Proof
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No certificates listed under current filter.</p>
        )}
      </section>

      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Projects & Implementations ({displayedProjects.length})
            </h2>
          </div>
        </div>

        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedProjects.map((p) => (
              <div
                key={p._id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-base font-bold text-slate-900">{p.title}</h4>
                    <VerificationBadge status={p.verificationStatus} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {p.description}
                  </p>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black"
                    >
                      <GithubIcon className="w-3.5 h-3.5" /> Code
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No projects listed under current filter.</p>
        )}
      </section>

      {/* Internships & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Internships */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Work & Internships ({displayedInternships.length})
            </h2>
          </div>

          {displayedInternships.length > 0 ? (
            <div className="space-y-3">
              {displayedInternships.map((intern) => (
                <div
                  key={intern._id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        {intern.company}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{intern.role}</h4>
                    </div>
                    <VerificationBadge status={intern.verificationStatus} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {new Date(intern.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} –{' '}
                    {intern.currentlyWorking ? 'Present' : new Date(intern.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  {intern.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{intern.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No internships listed under current filter.</p>
          )}
        </section>

        {/* Achievements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Honors & Awards ({displayedAchievements.length})
            </h2>
          </div>

          {displayedAchievements.length > 0 ? (
            <div className="space-y-3">
              {displayedAchievements.map((ach) => (
                <div
                  key={ach._id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        {ach.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{ach.title}</h4>
                      {ach.organization && (
                        <p className="text-xs text-slate-500">{ach.organization}</p>
                      )}
                    </div>
                    <VerificationBadge status={ach.verificationStatus} size="sm" />
                  </div>
                  {ach.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2">{ach.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No achievements listed under current filter.</p>
          )}
        </section>
      </div>

      {/* Proof Viewer */}
      <ProofViewerModal
        isOpen={proofViewer.isOpen}
        onClose={() => setProofViewer((prev) => ({ ...prev, isOpen: false }))}
        proofUrl={proofViewer.proofUrl}
        title={proofViewer.title}
        itemType={proofViewer.itemType}
        remarks={proofViewer.remarks}
      />
    </div>
  );
};

export default PublicProfilePage;
