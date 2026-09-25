import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Globe,
  Upload,
  Save,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/BrandIcons';

const StudentProfilePage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profilePhoto: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          const u = res.data.user;
          setFormData({
            name: u.name || '',
            email: u.email || '',
            username: u.username || '',
            phone: u.phone || '',
            college: u.college || '',
            degree: u.degree || '',
            branch: u.branch || '',
            graduationYear: u.graduationYear || '',
            location: u.location || '',
            bio: u.bio || '',
            linkedin: u.linkedin || '',
            github: u.github || '',
            portfolio: u.portfolio || '',
            profilePhoto: u.profilePhoto || '',
          });
          if (u.profilePhoto) {
            setPhotoPreview(u.profilePhoto);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      if (photoFile) {
        submitData.append('profilePhoto', photoFile);
      }

      const res = await api.put('/users/profile', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading profile..." size="lg" />;
  }

  // Calculate profile completeness locally
  const fields = [
    formData.name,
    formData.email,
    formData.college,
    formData.degree,
    formData.branch,
    formData.graduationYear,
    formData.phone,
    formData.location,
    formData.bio,
    formData.linkedin,
    formData.github,
    formData.profilePhoto || photoPreview,
  ];
  const filledCount = fields.filter((f) => f && f.toString().trim().length > 0).length;
  const completionPercentage = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Student Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your academic and professional details accurate for verified portfolio views.
          </p>
        </div>

        {formData.username && (
          <a
            href={`/profile/${formData.username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200/60 shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Profile</span>
          </a>
        )}
      </div>

      {/* Profile Completion Indicator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Profile Completeness</h4>
          </div>
          <span className="text-sm font-black text-indigo-600">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Profiles with &gt; 90% completeness receive significantly higher credibility from recruiters.
        </p>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Photo Upload Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Profile Photo
          </label>
          <div className="flex items-center gap-6">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl border border-indigo-200/60 shadow-xs">
                  {formData.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Photo</span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                JPG, PNG or WEBP up to 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6"></div>

        {/* Basic Personal Information */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Public Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location / City</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Short Professional Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              placeholder="Tell recruiters about your engineering passion and career objectives..."
              className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            ></textarea>
            <p className="text-[11px] text-slate-400 text-right mt-1">
              {formData.bio.length} / 500 characters
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6"></div>

        {/* Academic Details */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. Stanford University"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. Bachelor of Science"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Major / Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="e.g. 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6"></div>

        {/* Social and Portfolio Links */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
          Online Presence & Social Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">LinkedIn Profile</label>
            <div className="relative">
              <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">GitHub Profile</label>
            <div className="relative">
              <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Portfolio Website</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfilePage;
