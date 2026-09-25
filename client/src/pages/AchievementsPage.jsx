import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import AchievementCard from '../components/AchievementCard';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Trophy, Plus, Upload } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Hackathons',
  'Coding Competitions',
  'Workshops',
  'Awards',
  'Publications',
  'Academic Achievements',
  'Other',
];

const AchievementsPage = () => {
  const toast = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathons',
    description: '',
    organization: '',
    date: '',
    credentialUrl: '',
    autoSubmit: false,
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit Verification Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAch, setSelectedAch] = useState(null);
  const [verificationProofFile, setVerificationProofFile] = useState(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Proof Viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: 'Achievement',
    remarks: '',
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements');
      if (res.data.success) {
        setAchievements(res.data.achievements);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleOpenAdd = () => {
    setEditingAch(null);
    setFormData({
      title: '',
      category: activeCategory !== 'All' ? activeCategory : 'Hackathons',
      description: '',
      organization: '',
      date: '',
      credentialUrl: '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      category: ach.category,
      description: ach.description || '',
      organization: ach.organization || '',
      date: ach.date ? ach.date.split('T')[0] : '',
      credentialUrl: ach.credentialUrl || '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Title and date are required');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('organization', formData.organization.trim());
      data.append('date', formData.date);
      data.append('credentialUrl', formData.credentialUrl.trim());
      data.append('autoSubmit', formData.autoSubmit);

      if (proofFile) {
        data.append('proof', proofFile);
      }

      if (editingAch) {
        const res = await api.put(`/achievements/${editingAch._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Achievement updated successfully');
          fetchAchievements();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/achievements', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success(res.data.message || 'Achievement added successfully');
          fetchAchievements();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/achievements/${deleteId}`);
      if (res.data.success) {
        toast.success('Achievement deleted');
        fetchAchievements();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      toast.error('Failed to delete achievement');
    }
  };

  const handleOpenSubmitModal = (ach) => {
    setSelectedAch(ach);
    setVerificationProofFile(null);
    setIsSubmitModalOpen(true);
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      if (verificationProofFile) {
        data.append('proof', verificationProofFile);
      }

      const res = await api.post(`/achievements/${selectedAch._id}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Achievement submitted for verification!');
        fetchAchievements();
        setIsSubmitModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAchievements =
    activeCategory === 'All'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Achievements & Honors
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase hackathon wins, competitive programming medals, publications, and awards
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your achievements..." />
      ) : filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map((ach) => (
            <AchievementCard
              key={ach._id}
              achievement={ach}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                setDeleteId(id);
                setIsDeleteOpen(true);
              }}
              onSubmitVerification={handleOpenSubmitModal}
              onViewProof={(url, title, type, remarks) =>
                setProofViewer({ isOpen: true, proofUrl: url, title, itemType: type, remarks })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title={activeCategory === 'All' ? 'No Achievements Added Yet' : `No ${activeCategory} Achievements`}
          description="Add hackathon victories, coding medals, or research papers."
          actionText="Add Achievement"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Achievement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAch ? 'Edit Achievement' : 'Add New Achievement'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveAchievement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Achievement Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. 1st Place – Silicon Valley Collegiate Hackathon 2025"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date Awarded *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Host Organization / Body
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, organization: e.target.value }))
                }
                placeholder="e.g. Silicon Valley Tech Council, IEEE, ACM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description / Result
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your solution, ranking out of how many teams, or research summary..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Credential / Press Release URL
              </label>
              <input
                type="url"
                value={formData.credentialUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Certificate / Trophy Proof
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {!editingAch && (
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoSubmit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, autoSubmit: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Immediately submit this achievement for official verification
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              {submitting ? 'Saving...' : editingAch ? 'Save Changes' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Verification Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Achievement for Verification"
        description={`Submit "${selectedAch?.title}" for verification review`}
      >
        <form onSubmit={handleSubmitVerification} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach official proof such as award certificates, press release link, or event winner verification letter.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Proof File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
              onChange={(e) => setVerificationProofFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              {submitting ? 'Submitting...' : 'Submit to Verifier'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Achievement"
        message="Are you sure you want to remove this achievement from your profile?"
        confirmText="Delete Achievement"
      />

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

export default AchievementsPage;
