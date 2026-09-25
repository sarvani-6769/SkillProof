import React from 'react';
import { Briefcase, Calendar, ExternalLink, FileText, Edit2, Trash2, Send, AlertCircle } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const InternshipCard = ({
  internship,
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
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/60 text-sky-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {internship.company}
              </span>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition leading-snug">
                {internship.role}
              </h4>
            </div>
          </div>
          <VerificationBadge status={internship.verificationStatus} size="sm" />
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-xs text-slate-500 my-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {formatDate(internship.startDate)} –{' '}
            {internship.currentlyWorking ? (
              <span className="text-emerald-600 font-semibold">Present</span>
            ) : (
              formatDate(internship.endDate)
            )}
          </span>
        </div>

        {/* Description */}
        {internship.description && (
          <p className="text-xs text-slate-600 my-2.5 leading-relaxed line-clamp-3">
            {internship.description}
          </p>
        )}

        {/* Technologies */}
        {internship.technologies && internship.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-3">
            {internship.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Company link */}
        {internship.companyUrl && (
          <div className="mt-2">
            <a
              href={internship.companyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Company Website
            </a>
          </div>
        )}

        {/* Verification feedback */}
        {internship.verificationRemarks && (
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Remarks: </span>
              <span className="italic">{internship.verificationRemarks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {internship.proof && (
            <button
              type="button"
              onClick={() =>
                onViewProof(
                  internship.proof,
                  `${internship.role} at ${internship.company}`,
                  'Internship',
                  internship.verificationRemarks
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" /> Completion Proof
            </button>
          )}

          {!readOnly &&
            (internship.verificationStatus === 'Not Submitted' ||
              internship.verificationStatus === 'Rejected') && (
              <button
                type="button"
                onClick={() => onSubmitVerification(internship)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
              >
                <Send className="w-3 h-3" /> Submit Verification
              </button>
            )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(internship)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Edit Internship"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(internship._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Internship"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
