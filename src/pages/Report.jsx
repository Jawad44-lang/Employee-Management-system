import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
  Download,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import { formatNumber } from '../utils/formatters.js';

export default function Report() {
  const { teamMembers, recommendedTasks, showNotification, setIsExportModalOpen } = useApp();
  const [reportPeriod, setReportPeriod] = useState('August 2024');

  const categories = [
    { name: 'UI & Visual Design', hours: 245, percent: 38, color: 'bg-[#7C3AED]' },
    { name: 'Frontend Architecture', hours: 190, percent: 30, color: 'bg-[#0284C7]' },
    { name: 'User Research & Journey', hours: 115, percent: 18, color: 'bg-[#10B981]' },
    { name: 'Design QA & Prototyping', hours: 80, percent: 14, color: 'bg-[#F59E0B]' },
  ];

  const weeklyVelocity = [
    { week: 'Week 1 (Aug 1-7)', planned: 28, completed: 26, rate: '92%' },
    { week: 'Week 2 (Aug 8-14)', planned: 32, completed: 31, rate: '97%' },
    { week: 'Week 3 (Aug 15-21)', planned: 30, completed: 28, rate: '93%' },
    { week: 'Week 4 (Aug 22-28)', planned: 35, completed: 33, rate: '94%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Executive Productivity Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Performance analytics, team velocity, and milestone delivery distribution.
          </p>
        </div>

        {/* Timeframe & Export */}
        <div className="flex items-center gap-3">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs focus:outline-hidden"
          >
            <option value="August 2024">August 2024 (Current)</option>
            <option value="July 2024">July 2024</option>
            <option value="Q3 2024">Q3 2024 (Full Quarter)</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-2xl shadow-xs transition-all cursor-pointer hover:bg-slate-800"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Hours Logged</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">630 hr 52 min</h2>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs previous period
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Milestone Delivery</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">19 / 25 Tasks</h2>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            76.0% On-target completion rate
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Sprint Velocity</span>
            <span className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">94.2%</h2>
          <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
            4.8 pt ahead of baseline schedule
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Team Utilization</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">89.4%</h2>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            6 Active contributors
          </p>
        </motion.div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Time Distribution by Discipline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Allocation across creative design, coding, and review.
            </p>

            {/* Segmented bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex shadow-xs mb-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percent}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className={`${cat.color}`}
                  title={`${cat.name}: ${cat.percent}%`}
                />
              ))}
            </div>

            {/* Legend and stats */}
            <div className="space-y-3.5">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono tabular-nums">{cat.hours} hrs</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums w-8 text-right">
                      {cat.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Design lead oversight by Siphron and Marc Atenson.
          </div>
        </div>

        {/* Weekly Velocity Progression (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Weekly Sprint Delivery Rate
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Target delivery vs actual deliverables handed off to staging.
          </p>

          <div className="space-y-4">
            {weeklyVelocity.map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{w.week}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                    {w.rate} achieved
                  </span>
                </div>
                {/* Dual bar with animated expansion */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: w.rate }}
                    transition={{ duration: 1.2, delay: idx * 0.15, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-purple-500 to-[#7F56D9] h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Planned: {w.planned} items</span>
                  <span>Completed: {w.completed} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Progress Overview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Core Project Milestones Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white truncate">{task.project}</span>
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">{task.progress}%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{task.category}</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="bg-[#7F56D9] h-full rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Due {task.dueDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
