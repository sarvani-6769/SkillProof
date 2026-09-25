import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Search,
  GraduationCap,
  ShieldCheck,
  Code2,
  ExternalLink,
  MapPin,
  Sparkles,
  Filter,
} from 'lucide-react';

const POPULAR_FILTERS = [
  { label: 'React.js', key: 'skill', value: 'React' },
  { label: 'Python', key: 'skill', value: 'Python' },
  { label: 'Kubernetes', key: 'skill', value: 'Kubernetes' },
  { label: 'Cloud Architecture', key: 'skill', value: 'Cloud' },
  { label: 'Stanford', key: 'college', value: 'Stanford' },
  { label: 'Berkeley', key: 'college', value: 'Berkeley' },
];

const SearchProfilesPage = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/search', {
        params: {
          q: searchTerm,
          skill: skillFilter,
          college: collegeFilter,
          technology: techFilter,
          limit: 24,
        },
      });
      if (res.data.success) {
        setProfiles(res.data.profiles);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Error searching profiles:', err);
      toast.error('Search query failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [skillFilter, collegeFilter, techFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

  const handleChipClick = (item) => {
    if (item.key === 'skill') {
      setSkillFilter((prev) => (prev === item.value ? '' : item.value));
    } else if (item.key === 'college') {
      setCollegeFilter((prev) => (prev === item.value ? '' : item.value));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
    setCollegeFilter('');
    setTechFilter('');
    setTimeout(fetchProfiles, 10);
  };

  const hasActiveFilters = searchTerm || skillFilter || collegeFilter || techFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Talent Discovery & Verification Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Verified Student Profiles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Search candidate portfolios across universities, verified technical skills, and project technologies.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, college, degree, or skill..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-indigo-500/20"
          >
            Search
          </button>
        </form>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          {POPULAR_FILTERS.map((chip, i) => {
            const isSelected =
              (chip.key === 'skill' && skillFilter === chip.value) ||
              (chip.key === 'college' && collegeFilter === chip.value);

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-rose-600 font-semibold hover:underline ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500 font-semibold">
        <span>Found {total} Verified Student Profiles</span>
        <span>Showing authentic, reviewed records</span>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <LoadingSpinner message="Searching verified candidates..." size="lg" />
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  {p.profilePhoto ? (
                    <img
                      src={p.profilePhoto}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/10 shadow-xs group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-100 shrink-0">
                      {p.name.charAt(0)}
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-slate-900 truncate leading-snug group-hover:text-indigo-600 transition">
                        {p.name}
                      </h3>
                      {p.verifiedSkillsCount > 0 && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-indigo-600 font-semibold">@{p.username}</p>
                    {p.location && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Academic Institution */}
                {p.college && (
                  <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      {p.college}
                    </p>
                    {p.branch && (
                      <p className="text-[11px] text-slate-500 mt-0.5 ml-5 truncate">
                        {p.degree ? `${p.degree}, ` : ''}
                        {p.branch}
                        {p.graduationYear ? ` ('${p.graduationYear})` : ''}
                      </p>
                    )}
                  </div>
                )}

                {/* Short bio */}
                {p.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {p.bio}
                  </p>
                )}

                {/* Verified Skills Preview */}
                {p.skills && p.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Highlighted Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            s.verificationStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified tally stats */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-slate-100 text-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {p.verifiedSkillsCount || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Verified Skills</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {p.verifiedCertificatesCount || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Verified Certs</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {p.totalProjectsCount || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Projects</span>
                  </div>
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  to={`/profile/${p.username}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Verified Profile</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No Students Matched"
          description="Try broadening your search query or selecting a different skill filter."
          actionText="Clear Search"
          onAction={clearAllFilters}
        />
      )}
    </div>
  );
};

export default SearchProfilesPage;
