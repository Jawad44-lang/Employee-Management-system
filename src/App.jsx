import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import AttendanceAndLeaves from './pages/AttendanceAndLeaves.jsx';
import MyTask from './pages/MyTask.jsx';
import Report from './pages/Report.jsx';
import EmployeePayroll from './pages/EmployeePayroll.jsx';
import NewProjectModal from './components/NewProjectModal.jsx';
import ExportDataModal from './components/ExportDataModal.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import PayslipModal from './components/PayslipModal.jsx';
import AddEmployeeModal from './components/AddEmployeeModal.jsx';
import EmployeeProfileDrawer from './components/EmployeeProfileDrawer.jsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function MainLayout() {
  const { activeTab, activeNotification } = useApp();

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 relative overflow-x-hidden selection:bg-purple-500 selection:text-white transition-colors duration-200">
      {/* Subtle organic light wave texture matching the screenshot top background */}
      <div className="absolute top-0 left-1/4 right-0 h-96 pointer-events-none opacity-40 dark:opacity-10 overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover text-purple-200 dark:text-purple-900"
        >
          <path
            d="M0 80 C 300 180, 700 20, 1000 120 L 1000 0 L 0 0 Z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <path
            d="M0 140 C 400 20, 600 220, 1000 160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <main className="relative z-10 max-w-[1580px] mx-auto px-6 lg:px-10 py-6 lg:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'employees' && <Employees />}
            {activeTab === 'leaves' && <AttendanceAndLeaves />}
            {activeTab === 'mytask' && <MyTask />}
            {activeTab === 'report' && <Report />}
            {activeTab === 'payroll' && <EmployeePayroll />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals & Drawers */}
      <NewProjectModal />
      <ExportDataModal />
      <EditProfileModal />
      <PayslipModal />
      <AddEmployeeModal />
      <EmployeeProfileDrawer />

      {/* Floating Notification Toast with Spring Animation */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200"
          >
            {activeNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
            )}
            <span className="text-xs font-semibold">{activeNotification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
