import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import InternshipCard from '../components/InternshipCard';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Briefcase, Plus, Upload } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Verified', 'Pending', 'Not Submitted', 'Rejected'];

const InternshipsPage = () => {
  const toast = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    technologies: '',
    companyUrl: '',
    autoSubmit: false,
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit Verification Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [verificationProofFile, setVerificationProofFile] = useState(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Proof Viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: 'Internship',
    remarks: '',
  });

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/internships');
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleOpenAdd = () => {
    setEditingInternship(null);
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      technologies: '',
      companyUrl: '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingInternship(item);
    setFormData({
      company: item.company,
      role: item.role,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      currentlyWorking: item.currentlyWorking || false,
      description: item.description || '',
      technologies: item.technologies ? item.technologies.join(', ') : '',
      companyUrl: item.companyUrl || '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSaveInternship = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.startDate) {
      toast.error('Company, role, and start date are required');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('company', formData.company.trim());
      data.append('role', formData.role.trim());
      data.append('startDate', formData.startDate);
      if (!formData.currentlyWorking && formData.endDate) {
        data.append('endDate', formData.endDate);
      }
      data.append('currentlyWorking', formData.currentlyWorking);
      data.append('description', formData.description.trim());
      data.append('technologies', formData.technologies);
      data.append('companyUrl', formData.companyUrl.trim());
      data.append('autoSubmit', formData.autoSubmit);

      if (proofFile) {
        data.append('proof', proofFile);
      }

      if (editingInternship) {
        const res = await api.put(`/internships/${editingInternship._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Internship updated successfully');
          fetchInternships();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/internships', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success(res.data.message || 'Internship added successfully');
          fetchInternships();
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
      const res = await api.delete(`/internships/${deleteId}`);
      if (res.data.success) {
        toast.success('Internship record deleted');
        fetchInternships();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      toast.error('Failed to delete internship');
    }
  };

  const handleOpenSubmitModal = (item) => {
    setSelectedInternship(item);
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

      const res = await api.post(`/internships/${selectedInternship._id}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Internship submitted for verification!');
        fetchInternships();
        setIsSubmitModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInternships =
    statusFilter === 'All'
      ? internships
      : internships.filter((i) => i.verificationStatus === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Internships & Work Experience
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain industry apprenticeships with verified completion proof
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Internship</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Internships Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your internships..." />
      ) : filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map((intern) => (
            <InternshipCard
              key={intern._id}
              internship={intern}
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
          icon={Briefcase}
          title={statusFilter === 'All' ? 'No Internships Added Yet' : `No ${statusFilter} Internships`}
          description="Add your company internships, co-ops, or apprentice roles with completion certificates."
          actionText="Add Internship"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Internship Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInternship ? 'Edit Internship' : 'Add New Internship'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveInternship} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. Stripe, Datadog, Microsoft"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role / Title *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Software Engineering Intern"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                disabled={formData.currentlyWorking}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.currentlyWorking}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, currentlyWorking: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  I am currently working in this role
                </span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Description / Accomplishments
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Systems worked on, quantifiable impact, and learnings..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Technologies & Tools Used (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, technologies: e.target.value }))
                }
                placeholder="e.g. Go, Docker, AWS, Kubernetes, Redis"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Website URL
              </label>
              <input
                type="url"
                value={formData.companyUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyUrl: e.target.value }))
                }
                placeholder="https://company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Internship Completion Letter / Offer Proof
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {!editingInternship && (
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
                    Immediately submit this internship for official verification
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
              {submitting ? 'Saving...' : editingInternship ? 'Save Changes' : 'Create Internship'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Verification Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Internship for Verification"
        description={`Submit "${selectedInternship?.role} at ${selectedInternship?.company}"`}
      >
        <form onSubmit={handleSubmitVerification} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach official proof such as an internship completion certificate, signed letter, or corporate verification email.
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
        title="Delete Internship"
        message="Are you sure you want to remove this internship record?"
        confirmText="Delete Internship"
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

export default InternshipsPage;
