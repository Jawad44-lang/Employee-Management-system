import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  Award,
  Shield,
  UserCheck,
  UserX,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import FlagIcon from './FlagIcon.jsx';
import { formatCurrency, getStatusBadgeStyle } from '../utils/formatters.js';

export default function EmployeeProfileDrawer() {
  const {
    selectedEmployeeForDrawer,
    setSelectedEmployeeForDrawer,
    updateEmployee,
    terminateEmployee,
    setSelectedPayslipEmployee,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'compensation' | 'leaves'
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editedRole, setEditedRole] = useState('');
  const [editedDepartment, setEditedDepartment] = useState('');

  if (!selectedEmployeeForDrawer) return null;

  const emp = selectedEmployeeForDrawer;

  const handleSaveRole = () => {
    updateEmployee(emp.id, {
      role: editedRole || emp.role,
      department: editedDepartment || emp.department,
    });
    setIsEditingRole(false);
  };

  const startEdit = () => {
    setEditedRole(emp.role);
    setEditedDepartment(emp.department);
    setIsEditingRole(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative">
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1">
                <FlagIcon country={emp.country} className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {emp.employeeCode || `EMP-${emp.id.replace('emp-', '100')}`}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeStyle(emp.status)}`}>
                  {emp.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                {emp.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {emp.role} · <span className="text-purple-600 dark:text-purple-400 font-semibold">{emp.department}</span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedEmployeeForDrawer(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-100 dark:border-slate-800 gap-6 text-xs font-semibold bg-white dark:bg-slate-900">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'compensation', label: 'Compensation & Payroll' },
            { id: 'leaves', label: 'Time Off & Leaves' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Job Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Employment Details
                  </h4>
                  {!isEditingRole ? (
                    <button
                      onClick={startEdit}
                      className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveRole}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Save
                    </button>
                  )}
                </div>

                {!isEditingRole ? (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">Employment Type</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{emp.employmentType || 'Full-time'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Reporting Manager</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{emp.manager || 'Siphron (MD)'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Join Date</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{emp.joinDate || '2022-03-15'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Work Location</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{emp.location || 'Remote'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Job Title</label>
                      <input
                        type="text"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Department</label>
                      <select
                        value={editedDepartment}
                        onChange={(e) => setEditedDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Design">Design</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Contact Information
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{emp.phone || '+1 (555) 234-8901'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{emp.location || 'San Francisco, CA'} ({emp.countryName})</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {emp.emergencyContact && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Emergency Contact
                  </h4>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {emp.emergencyContact.name} ({emp.emergencyContact.relation})
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">{emp.emergencyContact.phone}</p>
                </div>
              )}

              {/* Skills Badges */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Skills & Proficiencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(emp.skills || ['General', 'Leadership']).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compensation' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/50">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Base Compensation Rate</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ${emp.hourlyRate}.00 <span className="text-sm font-medium text-slate-500">/ hour</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    ~{formatCurrency(emp.annualSalary || emp.hourlyRate * 1920)} / yr
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Payroll Cycle (August 2024)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span>Logged Hours This Month</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{emp.hoursWorked} hrs</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span>Base Earnings</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatCurrency(emp.hoursWorked * emp.hourlyRate)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span>Approved Milestone Bonus</span>
                    <span className="font-semibold text-emerald-600 tabular-nums">+{formatCurrency(emp.bonus || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span>Deductions & Withholding</span>
                    <span className="font-semibold text-red-500 tabular-nums">-{formatCurrency(emp.deductions || 0)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Estimated Net Pay</span>
                  <span className="text-lg font-black text-slate-950 dark:text-white tabular-nums">
                    {formatCurrency(emp.hoursWorked * emp.hourlyRate + (emp.bonus || 0) - (emp.deductions || 0))}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayslipEmployee(emp)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View Full Earnings Statement & Payslip</span>
              </button>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Annual Vacation Days</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                    {emp.leaveBalance?.annual || 20} <span className="text-xs font-normal text-slate-500">remaining</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{emp.leaveBalance?.usedAnnual || 0} days used this year</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/50">
                  <p className="text-xs font-medium text-sky-700 dark:text-sky-300">Sick & Medical Leave</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                    {emp.leaveBalance?.sick || 10} <span className="text-xs font-normal text-slate-500">remaining</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{emp.leaveBalance?.usedSick || 0} days used this year</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Today's Attendance Status
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Current Presence</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {emp.attendanceToday || 'Present'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Clocked In At</span>
                  <span className="font-mono">{emp.clockIn || '09:00 AM'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Expected Clock Out</span>
                  <span className="font-mono">{emp.clockOut || '05:30 PM'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Admin Actions Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3">
          {emp.status !== 'Terminated' ? (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to terminate ${emp.name}?`)) {
                  terminateEmployee(emp.id);
                  setSelectedEmployeeForDrawer(null);
                }
              }}
              className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Deactivate Employee</span>
            </button>
          ) : (
            <span className="text-xs text-red-500 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Account Inactive
            </span>
          )}

          <button
            onClick={() => {
              updateEmployee(emp.id, {
                status: emp.status === 'Active' ? 'On Leave' : 'Active',
              });
            }}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            {emp.status === 'Active' ? 'Mark On Leave' : 'Reactivate Status'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
