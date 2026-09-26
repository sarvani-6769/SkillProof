import React from 'react';

const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'rose', // rose, emerald, amber, purple
  trend,
  className = '',
  onClick,
}) => {
  const colorStyles = {
    rose: {
      bg: 'bg-rose-50/70 text-rose-600',
      border: 'hover:border-rose-300',
      glow: 'hover:shadow-rose-500/10',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600',
      border: 'hover:border-emerald-300',
      glow: 'hover:shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600',
      border: 'hover:border-amber-300',
      glow: 'hover:shadow-amber-500/10',
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-600',
      border: 'hover:border-purple-300',
      glow: 'hover:shadow-purple-500/10',
    },
  };

  const style = colorStyles[color] || colorStyles.rose;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        style.border
      } ${style.glow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.bg} shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
