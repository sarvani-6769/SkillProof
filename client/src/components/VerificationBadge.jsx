import React from 'react';
import { CheckCircle2, Clock, XCircle, FileQuestion, ShieldCheck } from 'lucide-react';

const VerificationBadge = ({ status, size = 'md', showIcon = true, className = '' }) => {
  const normalizedStatus = status || 'Not Submitted';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  let config = {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <FileQuestion className={iconSizes[size]} />,
    label: normalizedStatus,
  };

  switch (normalizedStatus) {
    case 'Verified':
      config = {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm ring-1 ring-emerald-500/20',
        icon: <ShieldCheck className={`${iconSizes[size]} text-emerald-600`} />,
        label: 'Verified',
      };
      break;
    case 'Pending':
      config = {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className={`${iconSizes[size]} text-amber-600 animate-pulse`} />,
        label: 'Pending Review',
      };
      break;
    case 'Under Review':
      config = {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <Clock className={`${iconSizes[size]} text-indigo-600`} />,
        label: 'Under Review',
      };
      break;
    case 'Rejected':
      config = {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: <XCircle className={`${iconSizes[size]} text-rose-600`} />,
        label: 'Rejected',
      };
      break;
    case 'Not Submitted':
    default:
      config = {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: <FileQuestion className={`${iconSizes[size]} text-slate-400`} />,
        label: 'Draft / Unsubmitted',
      };
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${sizeClasses[size]} ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default VerificationBadge;
