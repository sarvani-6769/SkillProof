import React from 'react';
import { X, ExternalLink, FileText, Download, ShieldCheck } from 'lucide-react';

const ProofViewerModal = ({ isOpen, onClose, proofUrl, title, itemType, remarks }) => {
  if (!isOpen) return null;

  const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
      if (!isLocal && !window.location.host.includes('onrender.com')) {
        return 'https://skillproof-1-auvm.onrender.com';
      }
    }
    return '';
  };

  const backendUrl = getBackendUrl();
  const resolvedUrl = proofUrl
    ? proofUrl.startsWith('http://') || proofUrl.startsWith('https://') || proofUrl.startsWith('blob:') || proofUrl.startsWith('data:')
      ? proofUrl
      : `${backendUrl}${proofUrl.startsWith('/') ? '' : '/'}${proofUrl}`
    : '';

  const isPdf = resolvedUrl?.toLowerCase().endsWith('.pdf');
  const isImage = resolvedUrl?.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                {title || 'Proof Documentation'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {itemType ? `${itemType} Verification Document` : 'Submitted Proof'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto flex flex-col items-center justify-center bg-slate-100/60 min-h-[300px]">
          {resolvedUrl ? (
            isImage ? (
              <div className="w-full flex flex-col items-center">
                <img
                  src={resolvedUrl}
                  alt={title || 'Proof Document'}
                  className="max-h-[60vh] max-w-full rounded-lg shadow-md border border-slate-200 object-contain bg-white"
                />
              </div>
            ) : isPdf ? (
              <iframe
                src={resolvedUrl}
                title="Proof PDF"
                className="w-full h-[60vh] rounded-lg border border-slate-200 bg-white"
              />
            ) : (
              <div className="text-center py-10">
                <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-3" />
                <p className="text-slate-700 font-medium mb-1">Document attached</p>
                <p className="text-xs text-slate-500 mb-4">{resolvedUrl}</p>
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  <ExternalLink className="w-4 h-4" /> Open in New Tab
                </a>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-medium">No document proof file uploaded.</p>
              <p className="text-xs text-slate-400 mt-1">
                The student may have provided an external verification link instead.
              </p>
            </div>
          )}

          {remarks && (
            <div className="mt-4 w-full p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Verification Remarks:</span>
              {remarks}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">SkillProof Integrity Engine</div>
          <div className="flex items-center gap-2">
            {resolvedUrl && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Full Screen
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofViewerModal;
