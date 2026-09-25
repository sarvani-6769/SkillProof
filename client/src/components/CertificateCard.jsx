import React from 'react';
import { Award, ExternalLink, Calendar, Key, FileText, Edit2, Trash2, Send, AlertCircle } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const CertificateCard = ({
  certificate,
  onEdit,
  onDelete,
  onSubmitVerification,
  onViewProof,
  readOnly = false,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                {certificate.organization}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition">
                {certificate.title}
              </h4>
            </div>
          </div>
          <VerificationBadge status={certificate.verificationStatus} size="sm" />
        </div>

        {/* Metadata items */}
        <div className="space-y-1.5 mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Issued: {formatDate(certificate.issueDate)}</span>
          </div>

          {certificate.credentialId && (
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-slate-700 font-medium truncate">
                ID: {certificate.credentialId}
              </span>
            </div>
          )}

          {certificate.description && (
            <p className="text-slate-500 pt-2 line-clamp-2 leading-relaxed">
              {certificate.description}
            </p>
          )}
        </div>

        {/* External Credential URL */}
        {certificate.credentialUrl && (
          <div className="mt-3">
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Verify on Issuer Portal
            </a>
          </div>
        )}

        {/* Verification feedback */}
        {certificate.verificationRemarks && (
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Remarks: </span>
              <span className="italic">{certificate.verificationRemarks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {certificate.proof && (
            <button
              type="button"
              onClick={() =>
                onViewProof(
                  certificate.proof,
                  certificate.title,
                  'Certificate',
                  certificate.verificationRemarks
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" /> View Proof
            </button>
          )}

          {!readOnly &&
            (certificate.verificationStatus === 'Not Submitted' ||
              certificate.verificationStatus === 'Rejected') && (
              <button
                type="button"
                onClick={() => onSubmitVerification(certificate)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                <Send className="w-3 h-3" /> Submit Verification
              </button>
            )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(certificate)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Edit Certificate"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(certificate._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Certificate"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
