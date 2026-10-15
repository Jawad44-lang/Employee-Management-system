import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  FileText,
  CreditCard,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import FlagIcon from '../components/FlagIcon.jsx';
import { formatCurrency, getStatusBadgeStyle } from '../utils/formatters.js';

export default function EmployeePayroll() {
  const {
    teamMembers,
    setSelectedPayslipEmployee,
    updateEmployeePayrollStatus,
    showNotification,
    setIsExportModalOpen,
  } = useApp();

  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payrollSearch, setPayrollSearch] = useState('');

  // Calculations
  const totalPayroll = teamMembers.reduce((sum, emp) => {
    const regular = Math.min(emp.hoursWorked, 160) * emp.hourlyRate;
    const ot = Math.max(0, emp.hoursWorked - 160) * (emp.hourlyRate * 1.5);
    const gross = regular + ot + (emp.bonus || 0);
    const net = gross - (emp.deductions || 0);
    return sum + net;
  }, 0);

  const totalPaid = teamMembers
    .filter((emp) => emp.paymentStatus === 'Paid')
    .reduce((sum, emp) => {
      const regular = Math.min(emp.hoursWorked, 160) * emp.hourlyRate;
      const ot = Math.max(0, emp.hoursWorked - 160) * (emp.hourlyRate * 1.5);
      return sum + (regular + ot + (emp.bonus || 0) - (emp.deductions || 0));
    }, 0);

  const totalPending = totalPayroll - totalPaid;

  const filteredEmployees = teamMembers.filter((emp) => {
    if (departmentFilter !== 'All' && emp.department !== departmentFilter) return false;
    if (statusFilter !== 'All' && emp.paymentStatus !== statusFilter) return false;
    if (payrollSearch.trim()) {
      const q = payrollSearch.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProcessAll = () => {
    teamMembers.forEach((emp) => {
      if (emp.paymentStatus !== 'Paid') {
        updateEmployeePayrollStatus(emp.id, 'Paid');
      }
    });
    showNotification('All pending payrolls processed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Employee Payroll Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated timesheet calculations, tax withholdings, bonuses, and disbursement receipts.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-2xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Payroll CSV</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1, boxShadow: '0 10px 25px -5px rgba(127, 86, 217, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleProcessAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#7F56D9] hover:bg-[#6D42D0] text-white text-xs font-semibold rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Disburse Pending</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Month Payroll</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalPayroll)}
          </h2>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            August 2024 billing cycle
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Disbursed</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCurrency(totalPaid)}
          </h2>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Transferred via ACH Direct
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Authorization</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
            {formatCurrency(totalPending)}
          </h2>
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
            Awaiting final approval
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Roster</span>
            <span className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {teamMembers.length} Employees
          </h2>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            100% Timesheets submitted
          </p>
        </motion.div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search team or role..."
              value={payrollSearch}
              onChange={(e) => setPayrollSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="pb-3.5 font-medium">Employee</th>
                <th className="pb-3.5 font-medium">Role & Dept</th>
                <th className="pb-3.5 font-medium">Hours</th>
                <th className="pb-3.5 font-medium">Rate</th>
                <th className="pb-3.5 font-medium">Gross</th>
                <th className="pb-3.5 font-medium">Bonus</th>
                <th className="pb-3.5 font-medium">Deductions</th>
                <th className="pb-3.5 font-medium">Net Pay</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 text-right font-medium">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 dark:divide-slate-800/50 text-xs">
              {filteredEmployees.map((emp) => {
                const regular = Math.min(emp.hoursWorked, 160) * emp.hourlyRate;
                const ot = Math.max(0, emp.hoursWorked - 160) * (emp.hourlyRate * 1.5);
                const gross = regular + ot;
                const net = gross + (emp.bonus || 0) - (emp.deductions || 0);

                return (
                  <motion.tr
                    key={emp.id}
                    whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                    className="transition-colors"
                  >
                    {/* Employee Profile & Flag */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {emp.name}
                            </span>
                            <FlagIcon country={emp.country} className="w-3.5 h-3.5 rounded-full" />
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.role}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">{emp.department}</p>
                    </td>

                    {/* Hours */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {emp.hoursWorked} hrs
                    </td>

                    {/* Hourly Rate */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      ${emp.hourlyRate}/hr
                    </td>

                    {/* Gross */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(gross)}
                    </td>

                    {/* Bonus */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      +${emp.bonus || 0}
                    </td>

                    {/* Deductions */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums text-red-500 dark:text-red-400">
                      -${emp.deductions || 0}
                    </td>

                    {/* Net */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(net)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const nextStatus =
                            emp.paymentStatus === 'Paid'
                              ? 'Pending'
                              : emp.paymentStatus === 'Pending'
                              ? 'Processing'
                              : 'Paid';
                          updateEmployeePayrollStatus(emp.id, nextStatus);
                        }}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-transform ${getStatusBadgeStyle(
                          emp.paymentStatus
                        )}`}
                        title="Click to toggle status"
                      >
                        {emp.paymentStatus}
                      </motion.button>
                    </td>

                    {/* Actions: View Payslip */}
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPayslipEmployee(emp)}
                        className="px-3 py-1 bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/40 text-slate-700 hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Payslip</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No employee payroll records match the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
