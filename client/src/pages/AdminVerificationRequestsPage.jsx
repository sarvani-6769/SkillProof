import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import VerificationBadge from '../components/VerificationBadge';
import ProofViewerModal from '../components/ProofViewerModal';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  FileCheck,
  Filter,
  Check,
  X,
  FileText,
  Calendar,
  User,
  GraduationCap,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

const ITEM_TYPES = ['All', 'Certificate', 'Project', 'Internship', 'Skill', 'Achievement'];
const STATUS_OPTIONS = ['Pending', 'Verified', 'Rejected', 'All'];

const AdminVerificationRequestsPage = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [typeFilter, setTypeFilter] = useState('All');

  // Review Modal
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionType, setActionType] = useState('approve');
  const [remarks, setRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Proof Viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: '',
    remarks: '',
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/verification/all', {
        params: {
          status: statusFilter,
          itemType: typeFilter,
          limit: 50,
        },
      });
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching verification requests:', err);
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, typeFilter]);

  const handleOpenReview = (req, type) => {
    setSelectedReq(req);
    setActionType(type);
    setRemarks(type === 'approve' ? 'Approved after review' : '');
    setIsReviewModalOpen(true);
  };

  const handleProcessReview = async (e) => {
    e.preventDefault();
    if (actionType === 'reject' && !remarks.trim()) {
      toast.error('Please enter rejection feedback or reason for student');
      return;
    }

    try {
      setSubmittingReview(true);
      const url =
        actionType === 'approve'
          ? `/verification/${selectedReq._id}/approve`
          : `/verification/${selectedReq._id}/reject`;

      const res = await api.put(url, { remarks: remarks.trim() });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsReviewModalOpen(false);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification update failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verification Review Queue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Examine submitted student evidence, review credentials, and make authoritative verification determinations
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Item Type Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Category:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none bg-white text-slate-700"
          >
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <LoadingSpinner message="Fetching review queue..." />
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Student Details & Item Details */}
              <div className="flex items-start gap-4">
                {req.userId?.profilePhoto ? (
                  <img
                    src={req.userId.profilePhoto}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/10 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-base border border-rose-100 shrink-0">
                    {req.userId?.name?.charAt(0) || 'S'}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                      {req.itemType}
                    </span>
                    <VerificationBadge status={req.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {req.itemTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {req.userId?.name}
                    </span>
                    {req.userId?.college && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {req.userId?.college}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {req.remarks && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 max-w-xl">
                      <span className="font-semibold text-slate-800">Review remarks: </span>
                      <span className="italic">{req.remarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Proof and Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                {req.proof && (
                  <button
                    type="button"
                    onClick={() =>
                      setProofViewer({
                        isOpen: true,
                        proofUrl: req.proof,
                        title: req.itemTitle,
                        itemType: req.itemType,
                        remarks: req.remarks,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Proof Document</span>
                  </button>
                )}

                {req.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(req, 'approve')}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenReview(req, 'reject')}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    Decision: {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck}
          title="No Requests in this View"
          description={`There are currently no verification requests with status "${statusFilter}" in category "${typeFilter}".`}
        />
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Verification' : 'Reject Verification'}
        description={`Audit for ${selectedReq?.userId?.name}'s ${selectedReq?.itemType}`}
      >
        <form onSubmit={handleProcessReview} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p>
              <strong className="text-slate-700">Student:</strong> {selectedReq?.userId?.name} (
              {selectedReq?.userId?.email})
            </p>
            <p>
              <strong className="text-slate-700">Item:</strong> {selectedReq?.itemTitle}
            </p>
            {selectedReq?.proof && (
              <p>
                <strong className="text-slate-700">Proof:</strong>{' '}
                <a
                  href={selectedReq.proof}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-600 underline font-medium"
                >
                  Inspect Uploaded Document
                </a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {actionType === 'approve' ? 'Verification Remarks' : 'Rejection Reason *'}
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                actionType === 'approve'
                  ? 'e.g. Credential confirmed via issuer register with matching serial number.'
                  : 'Please explain the rejection reason so the student can rectify it...'
              }
              required={actionType === 'reject'}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-xs transition ${
                actionType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submittingReview
                ? 'Processing...'
                : actionType === 'approve'
                ? 'Confirm & Verify'
                : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>

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

export default AdminVerificationRequestsPage;
