import React from 'react';

/**
 * LoadingSpinner Component
 * Supports standard spinner indicator as well as skeleton loaders for cards and tables.
 */
const LoadingSpinner = ({ type = 'spinner', rows = 5 }) => {
  if (type === 'table-skeleton') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        {/* Table header skeleton */}
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
        {/* Table rows skeleton */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex space-x-4 items-center py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/12" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card-skeleton') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-slate-100 dark:border-slate-800" />
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
