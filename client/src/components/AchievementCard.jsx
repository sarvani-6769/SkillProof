import React from 'react';
import { Trophy, Calendar, ExternalLink, FileText, Edit2, Trash2, Send, AlertCircle, Building2 } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const AchievementCard = ({
  achievement,
  onEdit,
  onDelete,
  onSubmitVerification,
  onViewProof,
  readOnly = false,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Hackathons':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Coding Competitions':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Awards':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Publications':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Workshops':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
              achievement.category
            )}`}
          >
            {achievement.category}
          </span>
          <VerificationBadge status={achievement.verificationStatus} size="sm" />
        </div>

        <div className="flex items-start gap-3 mt-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug">
              {achievement.title}
            </h4>
            {achievement.organization && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{achievement.organization}</span>
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 my-2.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(achievement.date)}</span>
        </div>

        {/* Description */}
        {achievement.description && (
          <p className="text-xs text-slate-600 my-2.5 leading-relaxed line-clamp-3">
            {achievement.description}
          </p>
        )}

        {/* Credential / News URL */}
        {achievement.credentialUrl && (
          <div className="mt-2">
            <a
              href={achievement.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Official Award / Publication Link
            </a>
          </div>
        )}

        {/* Verification feedback */}
        {achievement.verificationRemarks && (
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Remarks: </span>
              <span className="italic">{achievement.verificationRemarks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {achievement.proof && (
            <button
              type="button"
              onClick={() =>
                onViewProof(
                  achievement.proof,
                  achievement.title,
                  'Achievement',
                  achievement.verificationRemarks
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" /> View Proof
            </button>
          )}

          {!readOnly &&
            (achievement.verificationStatus === 'Not Submitted' ||
              achievement.verificationStatus === 'Rejected') && (
              <button
                type="button"
                onClick={() => onSubmitVerification(achievement)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
              >
                <Send className="w-3 h-3" /> Submit Verification
              </button>
            )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(achievement)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Edit Achievement"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(achievement._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Achievement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
