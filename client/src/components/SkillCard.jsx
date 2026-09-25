import React from 'react';
import { Edit2, Trash2, Send, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const SkillCard = ({
  skill,
  onEdit,
  onDelete,
  onSubmitVerification,
  onViewProof,
  readOnly = false,
}) => {
  const getProficiencyPercentage = (level) => {
    switch (level) {
      case 'Beginner':
        return 25;
      case 'Intermediate':
        return 50;
      case 'Advanced':
        return 75;
      case 'Expert':
        return 100;
      default:
        return 50;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Programming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Web Development':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Database':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Data Science':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'AI/ML':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Cloud':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Tools':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const percent = getProficiencyPercentage(skill.proficiency);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
              skill.category
            )}`}
          >
            {skill.category}
          </span>
          <VerificationBadge status={skill.verificationStatus} size="sm" />
        </div>

        <h4 className="text-lg font-bold text-slate-900 mb-1">{skill.name}</h4>

        {/* Proficiency meter */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1.5">
            <span>Proficiency</span>
            <span className="font-semibold text-slate-700">{skill.proficiency}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : percent >= 75
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                  : percent >= 50
                  ? 'bg-gradient-to-r from-blue-400 to-sky-400'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400'
              }`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Verification remarks */}
        {skill.verificationRemarks && (
          <div className="mt-3 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="italic">{skill.verificationRemarks}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!readOnly && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {skill.proof && (
              <button
                type="button"
                onClick={() => onViewProof(skill.proof, skill.name, 'Skill')}
                className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
                title="View Uploaded Proof"
              >
                <FileCheck className="w-4 h-4" />
              </button>
            )}
            {(skill.verificationStatus === 'Not Submitted' ||
              skill.verificationStatus === 'Rejected') && (
              <button
                type="button"
                onClick={() => onSubmitVerification(skill)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                <Send className="w-3 h-3" /> Submit Verification
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(skill)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Edit Skill"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(skill._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Skill"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillCard;
