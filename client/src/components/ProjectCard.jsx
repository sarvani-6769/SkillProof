import { Code2, ExternalLink, Clock, UserCheck, FileText, Edit2, Trash2, Send, AlertCircle } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import VerificationBadge from './VerificationBadge';

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onSubmitVerification,
  onViewProof,
  readOnly = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                {project.title}
              </h4>
              {(project.projectRole || project.projectDuration) && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  {project.projectRole && <span>{project.projectRole}</span>}
                  {project.projectRole && project.projectDuration && <span>•</span>}
                  {project.projectDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {project.projectDuration}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <VerificationBadge status={project.verificationStatus} size="sm" />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 my-3 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Technologies badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-3">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-3 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black transition"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              Source Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
        </div>

        {/* Verification feedback */}
        {project.verificationRemarks && (
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Remarks: </span>
              <span className="italic">{project.verificationRemarks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.proof && (
            <button
              type="button"
              onClick={() =>
                onViewProof(
                  project.proof,
                  project.title,
                  'Project',
                  project.verificationRemarks
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" /> Proof
            </button>
          )}

          {!readOnly &&
            (project.verificationStatus === 'Not Submitted' ||
              project.verificationStatus === 'Rejected') && (
              <button
                type="button"
                onClick={() => onSubmitVerification(project)}
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
              onClick={() => onEdit(project)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Edit Project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
