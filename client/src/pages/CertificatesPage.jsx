import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import CertificateCard from '../components/CertificateCard';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Award, Plus, Upload, Filter } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Verified', 'Pending', 'Not Submitted', 'Rejected'];

const CertificatesPage = () => {
  const toast = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    autoSubmit: false,
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit Verification Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [verificationProofFile, setVerificationProofFile] = useState(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Proof Viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: 'Certificate',
    remarks: '',
  });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates');
      if (res.data.success) {
        setCertificates(res.data.certificates);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      organization: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      organization: cert.organization,
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      description: cert.description || '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSaveCertificate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.organization || !formData.issueDate) {
      toast.error('Please complete title, issuing organization, and issue date');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('organization', formData.organization.trim());
      data.append('issueDate', formData.issueDate);
      data.append('credentialId', formData.credentialId.trim());
      data.append('credentialUrl', formData.credentialUrl.trim());
      data.append('description', formData.description.trim());
      data.append('autoSubmit', formData.autoSubmit);

      if (proofFile) {
        data.append('proof', proofFile);
      }

      if (editingCert) {
        const res = await api.put(`/certificates/${editingCert._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Certificate updated successfully');
          fetchCertificates();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/certificates', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success(res.data.message || 'Certificate added successfully');
          fetchCertificates();
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
      const res = await api.delete(`/certificates/${deleteId}`);
      if (res.data.success) {
        toast.success('Certificate deleted');
        fetchCertificates();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      toast.error('Failed to delete certificate');
    }
  };

  const handleOpenSubmitModal = (cert) => {
    setSelectedCert(cert);
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

      const res = await api.post(`/certificates/${selectedCert._id}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Certificate submitted for verification!');
        fetchCertificates();
        setIsSubmitModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCerts =
    statusFilter === 'All'
      ? certificates
      : certificates.filter((c) => c.verificationStatus === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Certificates & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store academic, cloud, and industry certifications with verifiable proof
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
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

      {/* Certificates Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your certificates..." />
      ) : filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCerts.map((cert) => (
            <CertificateCard
              key={cert._id}
              certificate={cert}
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
          icon={Award}
          title={statusFilter === 'All' ? 'No Certificates Added Yet' : `No ${statusFilter} Certificates`}
          description="Upload your diplomas, course credentials, or vendor certificates to stand out."
          actionText="Add Certificate"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveCertificate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Certificate Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. AWS Solutions Architect Associate, Google Cloud Engineer"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, organization: e.target.value }))
                }
                placeholder="e.g. Amazon Web Services, Coursera, Meta"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Credential ID <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credentialId: e.target.value }))
                }
                placeholder="e.g. AWS-99482-ARCH"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Verification URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.credentialUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))
                }
                placeholder="https://credly.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description / Skills Covered
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Briefly describe what this certificate represents..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Certificate Proof (PDF, JPG, PNG, SVG)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {!editingCert && (
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
                    Immediately submit this certificate for official verification
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
              {submitting ? 'Saving...' : editingCert ? 'Save Changes' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Verification Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Certificate for Verification"
        description={`Submit "${selectedCert?.title}" for evaluator review`}
      >
        <form onSubmit={handleSubmitVerification} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach official proof document or ensure credential URL is present for verification.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attach Certificate Proof (PDF or Image)
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
        title="Delete Certificate"
        message="Are you sure you want to remove this certificate? This will also remove any active verification request for it."
        confirmText="Delete Certificate"
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

export default CertificatesPage;
