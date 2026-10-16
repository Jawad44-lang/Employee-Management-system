import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, Check, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    userProfile,
    searchQuery,
    setSearchQuery,
    setIsProfileModalOpen,
    leaveRequests,
    teamMembers,
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'employees', label: 'Employees', badge: teamMembers.length },
    { id: 'leaves', label: 'Attendance & Leaves', alertBadge: pendingLeavesCount > 0 ? pendingLeavesCount : null },
    { id: 'mytask', label: 'My Task' },
    { id: 'report', label: 'Report' },
    { id: 'payroll', label: 'Employee Payroll' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F8FB]/95 dark:bg-[#0D1117]/95 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3.5 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-[1580px] mx-auto flex items-center justify-between gap-4">
        {/* Left: 4-Diamond Logo & Nav Tabs */}
        <div className="flex items-center gap-5 lg:gap-8 overflow-hidden">
          {/* 4-Diamond Brand Logo */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden p-1 rounded-xl shrink-0"
            title="Siphron Workspace Dashboard"
          >
            <div className="relative w-6 h-6 shrink-0 grid grid-cols-2 gap-1 rotate-45 transform">
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-xs transition-colors"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-xs opacity-90 transition-colors"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-xs opacity-90 transition-colors"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-xs opacity-75 transition-colors"></div>
            </div>
          </motion.button>

          {/* Navigation Links with Liquid Spring Layout Slider */}
          <nav className="flex items-center gap-4 sm:gap-6 lg:gap-7 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative text-xs sm:text-sm tracking-tight transition-colors duration-200 whitespace-nowrap cursor-pointer pb-2 focus:outline-hidden flex items-center gap-1.5 ${
                    isActive
                      ? 'text-slate-950 dark:text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && !item.alertBadge && (
                    <span className="relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                  {item.alertBadge && (
                    <span className="relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                      {item.alertBadge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-950 dark:bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Search, Theme Toggle, Notification Bell, User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 shrink-0">
          {/* Search bar */}
          <div className="relative hidden md:block w-40 lg:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search personnel, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EDEFF6] dark:bg-slate-800/90 border-none rounded-full pl-9 pr-8 py-2 text-xs lg:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Premium Animated Theme Toggle Capsule */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative bg-[#EDEFF6] dark:bg-slate-800 p-1 rounded-full flex items-center border border-slate-200/80 dark:border-slate-700/80 shadow-xs cursor-pointer select-none transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {/* Sliding Thumb */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className={`absolute top-1 bottom-1 w-7 rounded-full shadow-sm transition-colors ${
                theme === 'light'
                  ? 'left-7 bg-white'
                  : 'left-1 bg-slate-900 border border-slate-700'
              }`}
            />

            <div className="relative z-10 w-7 h-7 flex items-center justify-center">
              <Moon
                className={`w-3.5 h-3.5 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-purple-300' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="relative z-10 w-7 h-7 flex items-center justify-center">
              <Sun
                className={`w-3.5 h-3.5 transition-colors duration-200 ${
                  theme === 'light' ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
            </div>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowNotificationsDropdown((prev) => !prev)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-xs cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotificationsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 backdrop-blur-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Workforce & Activity Alerts
                    </h4>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">3 unread</span>
                  </div>
                  <div className="py-2 space-y-2">
                    <div
                      onClick={() => {
                        setActiveTab('leaves');
                        setShowNotificationsDropdown(false);
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs flex gap-3 cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {pendingLeavesCount} Pending Leave Requests
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Requires administrator review & signoff
                        </p>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setActiveTab('payroll');
                        setShowNotificationsDropdown(false);
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs flex gap-3 cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Payroll for August approved
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          $82,450.00 disbursements queued
                        </p>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setActiveTab('employees');
                        setShowNotificationsDropdown(false);
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs flex gap-3 cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Workforce Directory updated
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {teamMembers.length} active employee profiles registered
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
            title="Edit Profile"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm group-hover:ring-purple-400 transition-all cursor-pointer"
            />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
