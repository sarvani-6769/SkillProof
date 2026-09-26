import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import VerificationBadge from '../components/VerificationBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ProofViewerModal from '../components/ProofViewerModal';
import Modal from '../components/Modal';
import {
  ShieldCheck,
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' or 'reject'
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

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/verification/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      toast.error('Failed to load verifier dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification update failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading verifier console..." size="lg" />;
  }

  const { stats, recentSubmissions } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-400/20">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Official Verification Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verifier & Administration Console
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Logged in as <span className="font-bold text-white">{user?.name}</span> • Reviewing student credentials
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-900/30"
            >
              <Clock className="w-4 h-4" />
              <span>Open Review Queue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtext="Registered students"
          icon={Users}
          color="rose"
        />
        <StatCard
          title="Submissions"
          value={stats?.totalSubmissions || 0}
          subtext="Lifetime requests"
          icon={FileCheck}
          color="amber"
        />
        <StatCard
          title="Pending Action"
          value={stats?.pendingRequests || 0}
          subtext="Requires verification"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Verified"
          value={stats?.verifiedSubmissions || 0}
          subtext="Approved credentials"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejectedSubmissions || 0}
          subtext="Feedback sent"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Recent Submissions Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Verification Submissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluate student documents, check authenticity, and issue verified status
            </p>
          </div>
          <Link
            to="/admin/requests"
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <span>View all in queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Student</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Item Title</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Proof</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSubmissions.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {req.userId?.profilePhoto ? (
                          <img
                            src={req.userId.profilePhoto}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                            {req.userId?.name?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 leading-none">{req.userId?.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{req.userId?.college || req.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] px-2 py-0.5 bg-slate-100 rounded-md">
                        {req.itemType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                      {req.itemTitle}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      {req.proof ? (
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
                          className="inline-flex items-center gap-1 text-rose-600 font-semibold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> View
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <VerificationBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReview(req, 'approve')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-xs"
                            title="Approve & Mark Verified"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(req, 'reject')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition shadow-xs"
                            title="Reject Submission"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            No submissions in the database yet.
          </p>
        )}
      </div>

      {/* Review Modal (Approve or Reject) */}
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
                <strong className="text-slate-700">Proof Document:</strong>{' '}
                <a
                  href={selectedReq.proof}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-600 underline"
                >
                  Open in New Window
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
                  ? 'e.g. Credential confirmed via issuer registry.'
                  : 'Please state why the submission could not be verified (e.g. illegible document, expired link)...'
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

export default AdminDashboard;
