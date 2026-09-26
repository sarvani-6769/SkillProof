import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import VerificationBadge from '../components/VerificationBadge';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { FileCheck, Clock, CheckCircle2, XCircle, AlertCircle, FileText, Calendar, UserCheck } from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Verified', 'Rejected'];

const VerificationTrackerPage = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Proof viewer modal
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
      const res = await api.get('/verification/my-requests');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching verification requests:', err);
      toast.error('Failed to load verification tracker data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    filter === 'All'
      ? requests
      : requests.filter((r) => r.status === filter);

  const getStatusCount = (status) => {
    if (status === 'All') return requests.length;
    return requests.filter((r) => r.status === status).length;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verification Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your credential verification submissions, reviewer audit statuses, and feedback remarks
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {STATUS_TABS.map((tab) => {
          const count = getStatusCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab
                    ? 'bg-rose-700 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {loading ? (
        <LoadingSpinner message="Loading verification history..." />
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60">
                    {req.itemType}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{req.itemTitle}</h4>
                </div>
                <VerificationBadge status={req.status} size="md" />
              </div>

              {/* Submission Date & Review Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 py-3 border-y border-slate-100 my-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>

                {req.reviewedBy && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      Reviewed by: <strong className="text-slate-700">{req.reviewedBy?.name}</strong>
                    </span>
                  </div>
                )}

                {req.reviewedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audited: {new Date(req.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Remarks Box */}
              {req.remarks ? (
                <div
                  className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 ${
                    req.status === 'Verified'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : req.status === 'Rejected'
                      ? 'bg-rose-50 border border-rose-200 text-rose-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {req.status === 'Rejected' ? 'Rejection Reason / Required Changes: ' : 'Evaluator Remarks: '}
                    </span>
                    <span>{req.remarks}</span>
                  </div>
                </div>
              ) : (
                req.status === 'Pending' && (
                  <p className="text-xs text-slate-400 italic mt-1">
                    Awaiting verification review by an authorized evaluator.
                  </p>
                )
              )}

              {/* Action */}
              {req.proof && (
                <div className="mt-3 flex justify-end">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Submitted Proof</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck}
          title={filter === 'All' ? 'No Verification Requests Yet' : `No ${filter} Requests`}
          description="Submit your skills, certificates, projects, or achievements for official audit."
        />
      )}

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

export default VerificationTrackerPage;
