import React, { useState } from 'react';
import {
  Plus,
  Download,
  Pencil,
  Flag,
  Monitor,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  ArrowUpDown,
  SlidersHorizontal,
  MoreVertical,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import FlagIcon from '../components/FlagIcon.jsx';
import { getStatusBadgeStyle } from '../utils/formatters.js';

export default function Dashboard() {
  const {
    userProfile,
    teamMembers,
    recommendedTasks,
    performance,
    timelineEvents,
    setIsNewProjectModalOpen,
    setIsExportModalOpen,
    setIsProfileModalOpen,
    updateTaskStatus,
    statusFilter,
    setStatusFilter,
    sortDirection,
    toggleSort,
    isHideCompleted,
    setIsHideCompleted,
    searchQuery,
    showNotification,
  } = useApp();

  const [performanceRange, setPerformanceRange] = useState('Weekly');
  const [timelineView, setTimelineView] = useState('Day View');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showLeaderboardAll, setShowLeaderboardAll] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);

  // Filter and sort recommended tasks
  const filteredTasks = recommendedTasks.filter((task) => {
    if (isHideCompleted && task.status === 'Completed') return false;
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProject = task.project.toLowerCase().includes(q);
      const matchCategory = task.category?.toLowerCase().includes(q);
      return matchProject || matchCategory;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.project.localeCompare(b.project);
    } else {
      return b.project.localeCompare(a.project);
    }
  });

  const leaderboardUsers = showLeaderboardAll ? teamMembers : teamMembers.slice(0, 4);

  // Smooth SVG Spline Chart Coordinates
  const chartPoints = [
    { x: 30, y: 75, label: 'Mon', val: '25%' },
    { x: 70, y: 65, label: 'Tue', val: '35%' },
    { x: 110, y: 80, label: 'Wed', val: '20%' },
    { x: 150, y: 45, label: 'Thu', val: '55%' },
    { x: 190, y: 15, label: 'Fri', val: '85%' },
    { x: 230, y: 50, label: 'Sat', val: '50%' },
    { x: 270, y: 65, label: 'Sun', val: '35%' },
    { x: 310, y: 35, label: 'Mon+', val: '65%' },
    { x: 350, y: 70, label: 'Tue+', val: '30%', isValley: true },
    { x: 390, y: 25, label: 'Wed+', val: '75%' },
    { x: 420, y: 25, label: 'Thu+', val: '75%' },
  ];

  const pathD = `M 30,75 C 50,65 60,65 70,65 C 90,65 100,80 110,80 C 130,80 135,45 150,45 C 170,45 175,15 190,15 C 210,15 215,50 230,50 C 250,50 255,65 270,65 C 290,65 295,35 310,35 C 330,35 335,70 350,70 C 370,70 380,25 390,25 L 420,25`;
  const areaD = `${pathD} L 420,95 L 30,95 Z`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:space-y-7"
    >
      {/* Header: Greeting + Team stack + Action buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {userProfile.subtitle}
          </p>
          <div className="flex items-center flex-wrap gap-3.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {userProfile.title}
            </h1>

            {/* Team Avatar Stack */}
            <div className="flex items-center">
              <div className="flex -space-x-2 overflow-hidden items-center">
                {teamMembers.slice(0, 3).map((member, idx) => (
                  <motion.img
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    title={member.name}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-xs cursor-pointer"
                  />
                ))}
                <motion.span
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900 cursor-pointer"
                >
                  +{teamMembers.length - 3 > 0 ? teamMembers.length - 3 : 3}
                </motion.span>
              </div>

              {/* Edit Team / Profile Pencil Button */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsProfileModalOpen(true)}
                className="ml-2.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Edit profile & preferences"
              >
                <Pencil className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03, y: -1, boxShadow: '0 10px 25px -5px rgba(127, 86, 217, 0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7F56D9] hover:bg-[#6D42D0] active:scale-[0.99] text-white text-xs lg:text-sm font-semibold rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs lg:text-sm font-semibold rounded-2xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Export Data</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* LEFT COLUMN: 2x2 Metric Cards + Performance Card */}
        <div className="lg:col-span-4 space-y-5">
          {/* 2x2 Metric Cards */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {/* 1. Priority Task */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015, boxShadow: '0 12px 25px -8px rgba(16, 185, 129, 0.15)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-[#F0FAF4] dark:bg-[#062419]/50 border border-emerald-100/80 dark:border-emerald-900/40 p-4 rounded-3xl cursor-pointer relative overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <Flag className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Priority Taks
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                19/25
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                75% Done!
              </p>
            </motion.div>

            {/* 2. Upcoming Task */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015, boxShadow: '0 12px 25px -8px rgba(14, 165, 233, 0.15)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-[#F0F7FD] dark:bg-[#082238]/50 border border-sky-100/80 dark:border-sky-900/40 p-4 rounded-3xl cursor-pointer relative overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                <Monitor className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Upcoming Task
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                12/20
              </h3>
              <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-2">
                50% Ready!
              </p>
            </motion.div>

            {/* 3. Overdue Task */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015, boxShadow: '0 12px 25px -8px rgba(139, 92, 246, 0.15)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-[#F6F4FD] dark:bg-[#1E1238]/50 border border-purple-100/80 dark:border-purple-900/40 p-4 rounded-3xl cursor-pointer relative overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Overdue Task
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                02/30
              </h3>
              <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-2">
                90% Overdue!
              </p>
            </motion.div>

            {/* 4. Pending Task */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015, boxShadow: '0 12px 25px -8px rgba(245, 158, 11, 0.15)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-[#FFF9F0] dark:bg-[#2A1D08]/50 border border-amber-100/80 dark:border-amber-900/40 p-4 rounded-3xl cursor-pointer relative overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Pending Task
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                26/30
              </h3>
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2">
                60% Progress!
              </p>
            </motion.div>
          </div>

          {/* Performance Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Performance</h3>
              <div className="relative">
                <button
                  onClick={() =>
                    setPerformanceRange((prev) => (prev === 'Weekly' ? 'Monthly' : 'Weekly'))
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                >
                  <span>{performanceRange}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total time worked</p>
              <div className="flex items-baseline justify-between mt-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {performance.timeWorkedText}
                </h2>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums cursor-default"
                >
                  {performance.percentageText}
                </motion.span>
              </div>
            </div>

            {/* Smooth Spline Chart with SVG Animation & Interactive Tracker */}
            <div className="relative mt-6 pt-2">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500 tabular-nums select-none">
                <span>100%</span>
                <span>50%</span>
                <span>0.0%</span>
              </div>

              {/* Chart SVG */}
              <div className="ml-9 h-28 w-full relative">
                <svg
                  viewBox="0 0 450 100"
                  preserveAspectRatio="none"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="purpleGradientSmooth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline */}
                  <line
                    x1="20"
                    y1="50"
                    x2="430"
                    y2="50"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800/80"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />

                  {/* Area fill */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    d={areaD}
                    fill="url(#purpleGradientSmooth)"
                  />

                  {/* Animated curve drawing */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    d={pathD}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Active Valley Point Dot (exact matching reference with animated pulse) */}
                  <g className="cursor-pointer">
                    <circle
                      cx="350"
                      cy="70"
                      r="10"
                      className="fill-purple-500/20 animate-ping origin-center"
                      style={{ transformOrigin: '350px 70px' }}
                    />
                    <circle
                      cx="350"
                      cy="70"
                      r="5"
                      className="fill-slate-900 dark:fill-white stroke-2 stroke-white dark:stroke-slate-900 shadow-md"
                      onMouseEnter={() => setHoveredPointIndex(8)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                  </g>

                  {/* Interactive invisible hit targets along curve for smooth hover inspection */}
                  {chartPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="8"
                      className="fill-transparent hover:fill-purple-500/30 cursor-pointer transition-colors"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                  ))}
                </svg>

                {/* Floating Tooltip */}
                <AnimatePresence>
                  {hoveredPointIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        left: `${(chartPoints[hoveredPointIndex].x / 450) * 100}%`,
                        top: `${chartPoints[hoveredPointIndex].y - 28}px`,
                      }}
                      className="absolute -translate-x-1/2 bg-slate-950 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-30"
                    >
                      {chartPoints[hoveredPointIndex].val} ({chartPoints[hoveredPointIndex].label})
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chart Footer Dates and Total */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {performance.dateLabel}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {performance.totalTimeSummary}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Timeline & Leaderboard (Top) + Recommended Task (Bottom) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Top Row: Timeline Project (60%) + Leaderboard (40%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Timeline Project */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Timeline Project
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setTimelineView((prev) => (prev === 'Day View' ? 'Week View' : 'Day View'))
                    }
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>{timelineView}</span>
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  </motion.button>
                </div>

                {/* Time Ruler */}
                <div className="relative pt-2 pb-4">
                  <div className="grid grid-cols-8 text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-center select-none">
                    <span>09:00</span>
                    <span>09:30</span>
                    <span>10:00</span>
                    <span>10:30</span>
                    {/* Active timestamp indicator (11:00) with black capsule */}
                    <div className="flex justify-center items-center">
                      <span className="relative px-2 py-0.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-md text-[10px] font-bold shadow-xs">
                        11:00
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                      </span>
                    </div>
                    <span>11:30</span>
                    <span>12:00</span>
                    <span>12:30</span>
                  </div>

                  {/* Vertical dashed marker line extending from 11:00 */}
                  <div className="relative mt-2 h-40 border-t border-slate-100 dark:border-slate-800">
                    <div className="absolute left-[56.25%] top-0 bottom-0 w-px border-l-2 border-dashed border-slate-900/80 dark:border-white/80 z-10 pointer-events-none"></div>

                    {/* Timeline items bars with hover lift and spring animation */}
                    <div className="space-y-4 pt-4">
                      {/* Item 1: Purple exploration pill */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 20px -4px rgba(139, 92, 246, 0.4)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedTimelineItem({
                              title: 'Exploration UI mobile',
                              time: '09:10 - 10:20',
                              assignee: 'Marc Atenson',
                              status: 'In Progress',
                            })
                          }
                          style={{ marginLeft: '12%', width: '48%' }}
                          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                          title="Click to view details"
                        >
                          <span className="text-[10px] font-bold opacity-80">09:10</span>
                          <span className="truncate">Exploration UI mobile</span>
                        </motion.div>
                      </div>

                      {/* Item 2: Pill tag attached to the marker line at 11:00 */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedTimelineItem({
                              title: 'Mobile UI Concept',
                              time: '09:45 - 11:15',
                              assignee: 'Juan Jose Esteve',
                              status: 'Review',
                            })
                          }
                          style={{ marginLeft: '51%', width: '42%' }}
                          className="bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm z-20 cursor-pointer"
                          title="Click to view details"
                        >
                          <span className="text-[10px] font-bold opacity-80">09:45</span>
                          <span className="truncate">Mobile UI Concept</span>
                        </motion.div>
                      </div>

                      {/* Item 3: Lower dark pill */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedTimelineItem({
                              title: 'Mobile UI Concept',
                              time: '09:45 - 11:30',
                              assignee: 'Athar Malakooti',
                              status: 'Active',
                            })
                          }
                          style={{ marginLeft: '22%', width: '40%' }}
                          className="bg-slate-950 dark:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-xs cursor-pointer"
                          title="Click to view details"
                        >
                          <span className="text-[10px] font-bold opacity-80">09:45</span>
                          <span className="truncate">Mobile UI Concept</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard (12) */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Leaderboard ({teamMembers.length * 2})
                  </h3>
                  <button
                    onClick={() => setShowLeaderboardAll((prev) => !prev)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span>{showLeaderboardAll ? 'Collapse' : 'See All'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Member Ranks List */}
                <div className="space-y-3.5">
                  {leaderboardUsers.map((member, index) => (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      key={member.id}
                      className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-3 text-center">
                          {index + 1}
                        </span>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-100 dark:ring-slate-800"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {member.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      {/* Flag Icon */}
                      <FlagIcon country={member.country} className="w-5 h-5 rounded-full shrink-0 shadow-xs" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row: Recommended Task Card & Table */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended Task
              </h3>

              {/* Table Action Controls: Hide, Sort, Filter, Dots */}
              <div className="flex items-center gap-2">
                {/* Hide / Show Toggle */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setIsHideCompleted((prev) => !prev);
                    showNotification(isHideCompleted ? 'Showing all tasks' : 'Hiding completed tasks');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    isHideCompleted
                      ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                  title="Toggle completed visibility"
                >
                  {isHideCompleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>Hide</span>
                </motion.button>

                {/* Sort Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleSort}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Sort alphabetically"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Short</span>
                </motion.button>

                {/* Filter Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowStatusFilterMenu((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      statusFilter !== 'All'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </motion.button>

                  <AnimatePresence>
                    {showStatusFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30"
                      >
                        {['All', 'In Progress', 'Review', 'Pending'].map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setStatusFilter(st);
                              setShowStatusFilterMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${
                              statusFilter === st ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{st}</span>
                            {statusFilter === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* More options button */}
                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Add Task"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="pb-3.5 font-medium">Projects</th>
                    <th className="pb-3.5 font-medium">Assignee</th>
                    <th className="pb-3.5 font-medium">Start Date</th>
                    <th className="pb-3.5 font-medium">Due Date</th>
                    <th className="pb-3.5 font-medium">Status</th>
                    <th className="pb-3.5 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 dark:divide-slate-800/50 text-xs">
                  {sortedTasks.map((task) => {
                    const assignees = (task.assignees || []).map((id) =>
                      teamMembers.find((m) => m.id === id) || teamMembers[0]
                    );

                    return (
                      <motion.tr
                        key={task.id}
                        whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                        className="group transition-colors"
                      >
                        {/* Project Name */}
                        <td className="py-3.5 font-medium text-slate-900 dark:text-white pr-4">
                          {task.project}
                        </td>

                        {/* Assignee Avatars Stack */}
                        <td className="py-3.5 pr-4">
                          <div className="flex -space-x-1.5 items-center">
                            {assignees.map((assignee, idx) => (
                              <img
                                key={idx}
                                src={assignee.avatar}
                                alt={assignee.name}
                                title={assignee.name}
                                className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 hover:scale-110 transition-transform"
                              />
                            ))}
                          </div>
                        </td>

                        {/* Start Date */}
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap pr-4">
                          {task.startDate}
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap pr-4">
                          {task.dueDate}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold ${getStatusBadgeStyle(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>

                        {/* Actions menu */}
                        <td className="py-3.5 text-right relative whitespace-nowrap">
                          <button
                            onClick={() =>
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)
                            }
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          <AnimatePresence>
                            {activeMenuTaskId === task.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 text-left text-xs"
                              >
                                <button
                                  onClick={() => {
                                    updateTaskStatus(task.id, 'In Progress');
                                    setActiveMenuTaskId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                                >
                                  Mark In Progress
                                </button>
                                <button
                                  onClick={() => {
                                    updateTaskStatus(task.id, 'Review');
                                    setActiveMenuTaskId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                                >
                                  Mark Review
                                </button>
                                <button
                                  onClick={() => {
                                    updateTaskStatus(task.id, 'Completed');
                                    setActiveMenuTaskId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-emerald-600 font-medium"
                                >
                                  Mark Completed
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {sortedTasks.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No matching tasks found. Try adjusting your search or filters.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Selected Timeline Event Quick Inspector Modal */}
      <AnimatePresence>
        {selectedTimelineItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                  Timeline Event
                </span>
                <span className="text-xs font-semibold text-slate-400 tabular-nums">
                  {selectedTimelineItem.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedTimelineItem.title}
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Assignee: <span className="font-semibold text-slate-900 dark:text-white">{selectedTimelineItem.assignee}</span></p>
                <p>Status: <span className="font-semibold text-emerald-600">{selectedTimelineItem.status}</span></p>
              </div>
              <button
                onClick={() => setSelectedTimelineItem(null)}
                className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
