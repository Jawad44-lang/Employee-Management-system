import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  X,
  Filter,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import FlagIcon from '../components/FlagIcon.jsx';
import { getStatusBadgeStyle } from '../utils/formatters.js';

export default function AttendanceAndLeaves() {
  const {
    teamMembers,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    searchQuery,
    showNotification,
  } = useApp();

  const [activeSection, setActiveSection] = useState('requests'); // 'requests' | 'attendance' | 'balances'
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending');
  const pastRequests = leaveRequests.filter((r) => r.status !== 'Pending');

  const handleConfirmReject = (id) => {
    rejectLeaveRequest(id, rejectReason || 'Administrative schedule conflict');
    setRejectingRequestId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Attendance & Leave Administration
            </h1>
            {pendingRequests.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold animate-pulse">
                {pendingRequests.length} Needs Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review time-off petitions, manage employee balances, and audit daily clock records.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl flex items-center shadow-xs">
          <button
            onClick={() => setActiveSection('requests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'requests'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Leave Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveSection('attendance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'attendance'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Daily Clock Logs
          </button>
          <button
            onClick={() => setActiveSection('balances')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'balances'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Staff Leave Balances
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Approvals</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {pendingRequests.length} Requests
          </h2>
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
            Awaiting administrator sign-off
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Present Today</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            5 / 6 Staff (83.3%)
          </h2>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            4 Office, 1 Remote, 1 On Leave
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">On Leave Today</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            1 Employee
          </h2>
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1">
            Elena Rostova (Personal Leave)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Monthly Overtime</span>
            <span className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            14.2 Hours
          </h2>
          <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
            Approved & factored into payroll
          </p>
        </div>
      </div>

      {/* SECTION 1: LEAVE REQUESTS APPROVAL QUEUE */}
      {activeSection === 'requests' && (
        <div className="space-y-6">
          {/* Pending Approval Queue */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pending Leave Approval Queue</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {pendingRequests.length}
                </span>
              </h3>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    layout
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-purple-500/30"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {req.employeeName}
                          </h4>
                          <span className="text-[11px] text-slate-400">({req.department})</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {req.leaveType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {req.reason}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {req.startDate} to {req.endDate} ({req.daysCount} days)
                          </span>
                          <span>·</span>
                          <span>Submitted {req.submittedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveLeaveRequest(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Leave</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRejectingRequestId(req.id)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-700 dark:text-slate-300 hover:text-red-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                All incoming leave requests have been reviewed. No pending queue items.
              </div>
            )}
          </div>

          {/* Past Leave Requests History */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Historical Leave Decisions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Leave Type</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Admin Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pastRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-default">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{req.employeeName}</td>
                      <td className="py-3 text-slate-500">{req.leaveType}</td>
                      <td className="py-3 font-mono">{req.daysCount} days</td>
                      <td className="py-3 text-slate-500">{req.startDate} to {req.endDate}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400 text-[11px]">{req.adminNotes || 'Processed by Siphron'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DAILY ATTENDANCE CLOCK LOGS */}
      {activeSection === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Clock In / Out Records (August 18, 2024)
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
              Live Office Tracker
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <th className="pb-3">Staff Member</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Clock In</th>
                  <th className="pb-3">Clock Out</th>
                  <th className="pb-3">Total Hours</th>
                  <th className="pb-3">Attendance Mode</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teamMembers.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-default">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{emp.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-500">{emp.department}</td>
                    <td className="py-3.5 font-mono tabular-nums">{emp.clockIn || '09:00 AM'}</td>
                    <td className="py-3.5 font-mono tabular-nums">{emp.clockOut || '05:30 PM'}</td>
                    <td className="py-3.5 font-mono tabular-nums font-bold">8.5 hrs</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">
                      {emp.attendanceToday === 'Remote' ? '🏠 Remote' : emp.attendanceToday === 'On Leave' ? '🏖️ On Leave' : '🏢 In Office'}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.attendanceToday === 'Present' || emp.attendanceToday === 'Remote'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {emp.attendanceToday}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: STAFF LEAVE BALANCES */}
      {activeSection === 'balances' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Employee PTO & Sick Leave Balances Ledger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((emp) => (
              <div
                key={emp.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{emp.name}</h4>
                    <p className="text-[11px] text-slate-400">{emp.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-medium">Annual Vacation</p>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {emp.leaveBalance?.annual || 20} <span className="text-[10px] font-normal text-slate-400">days</span>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-medium">Sick Leave</p>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {emp.leaveBalance?.sick || 10} <span className="text-[10px] font-normal text-slate-400">days</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      <AnimatePresence>
        {rejectingRequestId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Decline Leave Request</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide an administrative note explaining why this leave cannot be accommodated at this time.
              </p>
              <textarea
                rows={3}
                placeholder="e.g. High client delivery volume scheduled during this sprint period."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectingRequestId(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmReject(rejectingRequestId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Confirm Decline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
