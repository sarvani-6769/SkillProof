import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import SkillCard from '../components/SkillCard';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Code2, Plus, Upload, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Database',
  'Data Science',
  'AI/ML',
  'Cloud',
  'Tools',
  'Soft Skills',
];

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillsPage = () => {
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    proficiency: 'Intermediate',
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit Verification Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedSkillToSubmit, setSelectedSkillToSubmit] = useState(null);
  const [verificationProofFile, setVerificationProofFile] = useState(null);

  // Delete Dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Proof Viewer state
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: 'Skill',
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/skills');
      if (res.data.success) {
        setSkills(res.data.skills);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      toast.error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: activeCategory !== 'All' ? activeCategory : 'Programming',
      proficiency: 'Intermediate',
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      data.append('proficiency', formData.proficiency);

      if (proofFile) {
        data.append('proof', proofFile);
      }

      if (editingSkill) {
        const res = await api.put(`/skills/${editingSkill._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Skill updated successfully');
          fetchSkills();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/skills', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Skill added to your profile');
          fetchSkills();
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
      const res = await api.delete(`/skills/${deleteId}`);
      if (res.data.success) {
        toast.success('Skill deleted');
        fetchSkills();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const handleOpenSubmitModal = (skill) => {
    setSelectedSkillToSubmit(skill);
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

      const res = await api.post(`/skills/${selectedSkillToSubmit._id}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Skill submitted for verification!');
        fetchSkills();
        setIsSubmitModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skills & Proficiencies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your technical stack and submit them for authorized verification
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
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

      {/* Skill Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your skills..." />
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                setDeleteId(id);
                setIsDeleteOpen(true);
              }}
              onSubmitVerification={handleOpenSubmitModal}
              onViewProof={(url, title, type) =>
                setProofViewer({ isOpen: true, proofUrl: url, title, itemType: type })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Code2}
          title={activeCategory === 'All' ? 'No Skills Added Yet' : `No ${activeCategory} Skills`}
          description="Add your languages, frameworks, or tools to highlight your competencies."
          actionText="Add First Skill"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. React.js, Python, PostgreSQL, AWS"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
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
                Proficiency Level
              </label>
              <select
                value={formData.proficiency}
                onChange={(e) => setFormData((prev) => ({ ...prev, proficiency: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Supporting Proof Document <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
              onChange={(e) => setProofFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
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
              {submitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Skill for Verification Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Skill for Verification"
        description={`Submit ${selectedSkillToSubmit?.name} for official review`}
      >
        <form onSubmit={handleSubmitVerification} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach a certificate, assessment score, repository link, or project proof that validates your proficiency in{' '}
            <span className="font-bold text-slate-900">{selectedSkillToSubmit?.name}</span>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Proof File (PDF, PNG, JPG, SVG)
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
        title="Delete Skill"
        message="Are you sure you want to remove this skill from your profile?"
        confirmText="Delete Skill"
      />

      {/* Proof Viewer Modal */}
      <ProofViewerModal
        isOpen={proofViewer.isOpen}
        onClose={() => setProofViewer((prev) => ({ ...prev, isOpen: false }))}
        proofUrl={proofViewer.proofUrl}
        title={proofViewer.title}
        itemType={proofViewer.itemType}
      />
    </div>
  );
};

export default SkillsPage;
