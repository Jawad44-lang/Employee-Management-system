/**
 * Utility functions for currency, time, date, and visual formatting.
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'in progress':
      return 'bg-[#EBF9F1] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50';
    case 'review':
    case 'in review':
      return 'bg-[#EBF5FE] text-[#0284C7] dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50';
    case 'pending':
      return 'bg-[#FFF7EB] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50';
    case 'completed':
    case 'paid':
      return 'bg-[#EBF9F1] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50';
    case 'processing':
      return 'bg-[#EBF5FE] text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50';
    case 'overdue':
    case 'rejected':
      return 'bg-[#FDF2F2] text-[#DC2626] dark:bg-red-950/40 dark:text-red-400 border border-red-200/60 dark:border-red-800/50';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  }
};
