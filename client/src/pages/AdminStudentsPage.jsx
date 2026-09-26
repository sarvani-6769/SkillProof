import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Users, Search, ExternalLink, GraduationCap, ShieldCheck, Mail, MapPin } from 'lucide-react';

const AdminStudentsPage = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get('/users/students', {
        params: { search: query },
      });
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to load students directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents(search);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registered student roster, verified records overview, and institutional profiles
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, email, or university..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Search
        </button>
      </form>

      {/* Students Grid */}
      {loading ? (
        <LoadingSpinner message="Loading student records..." />
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-4">
                  {student.profilePhoto ? (
                    <img
                      src={student.profilePhoto}
                      alt={student.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/10 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg border border-rose-100 shrink-0">
                      {student.name?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-slate-900 truncate leading-snug">
                      {student.name}
                    </h3>
                    <p className="text-xs text-rose-600 font-mono">@{student.username}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{student.email}</p>
                  </div>
                </div>

                {/* Academic meta */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {student.college && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.college}</span>
                    </div>
                  )}
                  {student.branch && (
                    <div className="text-[11px] text-slate-500 ml-5">
                      {student.degree ? `${student.degree} in ` : ''}
                      {student.branch}
                      {student.graduationYear ? ` ('${student.graduationYear})` : ''}
                    </div>
                  )}
                  {student.location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{student.location}</span>
                    </div>
                  )}
                </div>

                {/* Counters */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-4 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-900">
                      {student.verifiedSkillsCount || 0}/{student.skillsCount || 0}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Skills</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-900">
                      {student.verifiedCertificatesCount || 0}/{student.certificatesCount || 0}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Certs</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <p className="text-xs font-bold text-amber-800">
                      {student.pendingRequestsCount || 0}
                    </p>
                    <p className="text-[10px] text-amber-700 uppercase tracking-wider">Pending</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  to={`/profile/${student.username}`}
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Public Profile</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Students Found"
          description={
            search
              ? `No student matching "${search}" was found.`
              : 'There are no registered students yet.'
          }
        />
      )}
    </div>
  );
};

export default AdminStudentsPage;
