import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import FlagIcon from '../components/FlagIcon.jsx';
import { formatCurrency, getStatusBadgeStyle } from '../utils/formatters.js';

export default function Employees() {
  const {
    teamMembers,
    setIsAddEmployeeModalOpen,
    setSelectedEmployeeForDrawer,
    searchQuery,
    setSearchQuery,
    departments,
    auditLogs,
  } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter employees
  const filteredEmployees = teamMembers.filter((emp) => {
    if (selectedDept !== 'All' && emp.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && emp.status !== selectedStatus) return false;
    if (selectedType !== 'All' && emp.employmentType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        (emp.skills && emp.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Workforce stats
  const activeCount = teamMembers.filter((m) => m.status === 'Active').length;
  const onLeaveCount = teamMembers.filter((m) => m.status === 'On Leave').length;
  const totalSalaries = teamMembers.reduce((sum, m) => sum + (m.annualSalary || m.hourlyRate * 1920), 0);
  const avgHourly = Math.round(teamMembers.reduce((sum, m) => sum + m.hourlyRate, 0) / (teamMembers.length || 1));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Employee Management Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
              {teamMembers.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Admin console for personnel records, department assignments, status lifecycle, and profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl flex items-center shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1, boxShadow: '0 10px 25px -5px rgba(127, 86, 217, 0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7F56D9] hover:bg-[#6D42D0] text-white text-xs lg:text-sm font-semibold rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </motion.button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Workforce</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {activeCount} Active <span className="text-xs font-normal text-slate-400">/ {teamMembers.length}</span>
          </h2>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            {onLeaveCount} team member on approved leave
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Annual Payroll Run</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalSalaries)}
          </h2>
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1">
            Annualized total company compensation
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Base Rate</span>
            <span className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            ${avgHourly}.00 <span className="text-xs font-normal text-slate-400">/ hr</span>
          </h2>
          <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
            Blended senior talent rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Departments Active</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {departments.length} Units
          </h2>
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
            Design, Engineering, Product
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Design">Design Department</option>
            <option value="Engineering">Engineering Department</option>
            <option value="Product">Product & Strategy</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>

          {/* Employment Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Work Types</option>
            <option value="Full-time">Full-time Staff</option>
            <option value="Contractor">Contractors</option>
          </select>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filteredEmployees.length} of {teamMembers.length} employees
        </span>
      </div>

      {/* Main View: Table vs Card Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3.5 font-medium">Employee</th>
                  <th className="pb-3.5 font-medium">Role & Department</th>
                  <th className="pb-3.5 font-medium">Type</th>
                  <th className="pb-3.5 font-medium">Status</th>
                  <th className="pb-3.5 font-medium">Today</th>
                  <th className="pb-3.5 font-medium">Compensation</th>
                  <th className="pb-3.5 font-medium">Manager</th>
                  <th className="pb-3.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 dark:divide-slate-800/50 text-xs">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployeeForDrawer(emp)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors duration-150 cursor-pointer group"
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {emp.name}
                            </span>
                            <FlagIcon country={emp.country} className="w-3.5 h-3.5 rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {emp.employeeCode || 'EMP-1001'} · {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.role}</p>
                      <p className="text-[11px] text-slate-400">{emp.department}</p>
                    </td>

                    {/* Employment Type */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                        {emp.employmentType || 'Full-time'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${getStatusBadgeStyle(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Today Attendance */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {emp.attendanceToday || 'Present'}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">{emp.clockIn || '09:00 AM'}</p>
                    </td>

                    {/* Hourly/Annual Compensation */}
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">${emp.hourlyRate}/hr</span>
                      <p className="text-[10px] text-slate-400">{formatCurrency(emp.annualSalary || emp.hourlyRate * 1920)}/yr</p>
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 pr-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {emp.manager || 'Siphron'}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeForDrawer(emp);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.06)' }}
              key={emp.id}
              onClick={() => setSelectedEmployeeForDrawer(emp)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs cursor-pointer space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <FlagIcon country={emp.country} className="w-4 h-4 rounded-full shadow-xs" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{emp.employeeCode || 'EMP-1001'}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(emp.status)}`}>
                  {emp.status}
                </span>
              </div>

              <div className="text-xs space-y-1.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{emp.department} · {emp.employmentType}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-mono">
                  <span className="text-slate-400 text-[11px]">Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">${emp.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span>Manager: {emp.manager}</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">View File →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Admin Audit Trail Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span>Recent Administrative Audit Events</span>
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {log.category}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</p>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
