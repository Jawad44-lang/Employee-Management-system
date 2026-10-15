import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function PayslipModal() {
  const { selectedPayslipEmployee, setSelectedPayslipEmployee, showNotification } = useApp();

  if (!selectedPayslipEmployee) return null;

  const emp = selectedPayslipEmployee;
  const regularHours = Math.min(emp.hoursWorked, 160);
  const overtimeHours = Math.max(0, emp.hoursWorked - 160);
  const baseSalary = regularHours * emp.hourlyRate;
  const overtimePay = overtimeHours * (emp.hourlyRate * 1.5);
  const grossPay = baseSalary + overtimePay + (emp.bonus || 0);
  const netPay = grossPay - (emp.deductions || 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showNotification(`Payslip for ${emp.name} saved to downloads!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Earnings Statement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pay Period: August 1 - August 31, 2024</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedPayslipEmployee(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Payslip Card Document */}
        <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          {/* Header Info */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Siphron Creative Agency Inc.
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{emp.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{emp.role} · {emp.department}</p>
              <p className="text-xs text-slate-400 mt-1">{emp.email}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                emp.paymentStatus === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {emp.paymentStatus}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">INV-2024-08-{emp.id.replace('emp-', '')}</p>
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="py-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Standard Hours ({regularHours} hrs @ ${emp.hourlyRate}/hr)</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatCurrency(baseSalary)}</span>
            </div>
            {overtimeHours > 0 && (
              <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                <span>Overtime ({overtimeHours} hrs @ ${emp.hourlyRate * 1.5}/hr)</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatCurrency(overtimePay)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Performance & Milestone Bonus</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">+{formatCurrency(emp.bonus || 0)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Tax Withholding & Benefits Deductions</span>
              <span className="font-semibold text-red-500 dark:text-red-400 tabular-nums">-{formatCurrency(emp.deductions || 0)}</span>
            </div>
          </div>

          {/* Net Amount Box */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Net Disbursed</p>
              <p className="text-[11px] text-slate-400">Direct deposit via ACH</p>
            </div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white tabular-nums">
              {formatCurrency(netPay)}
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleDownload}
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
