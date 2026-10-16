import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_TEAM_MEMBERS,
  INITIAL_RECOMMENDED_TASKS,
  MY_TASKS_BOARD,
  TIMELINE_EVENTS,
  PERFORMANCE_DATA,
  AVATARS,
  INITIAL_DEPARTMENTS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from '../services/mockData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation: 'dashboard' | 'employees' | 'leaves' | 'mytask' | 'report' | 'payroll'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Theme: light / dark
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('siphron_theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('siphron_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // User Profile (Admin)
  const [userProfile, setUserProfile] = useState({
    name: 'Siphron',
    title: 'Welcome back, Siphron',
    subtitle: 'Monday, 18 August, 2024',
    avatar: AVATARS.siphron,
    role: 'Managing Director & HR Admin',
    email: 'siphron.director@agency.co',
  });

  // EMS Core Data States
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Projects & Tasks States
  const [recommendedTasks, setRecommendedTasks] = useState(INITIAL_RECOMMENDED_TASKS);
  const [myTasks, setMyTasks] = useState(MY_TASKS_BOARD);
  const [timelineEvents, setTimelineEvents] = useState(TIMELINE_EVENTS);
  const [performance] = useState(PERFORMANCE_DATA);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [isHideCompleted, setIsHideCompleted] = useState(false);

  // Modals & Drawers
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForDrawer, setSelectedEmployeeForDrawer] = useState(null);
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setActiveNotification({ message, type });
    setTimeout(() => {
      setActiveNotification(null);
    }, 3500);
  };

  // Employee Management Admin Actions
  const addEmployee = (newEmployeeData) => {
    const id = `emp-${Date.now()}`;
    const codeNumber = teamMembers.length + 1001;
    const rate = Number(newEmployeeData.hourlyRate) || 75;
    const newEmp = {
      id,
      employeeCode: `EMP-${codeNumber}`,
      name: newEmployeeData.name,
      email: newEmployeeData.email,
      phone: newEmployeeData.phone || '+1 (555) 000-0000',
      role: newEmployeeData.role,
      department: newEmployeeData.department || 'Design',
      employmentType: newEmployeeData.employmentType || 'Full-time',
      status: 'Active',
      country: newEmployeeData.country || 'US',
      countryName: newEmployeeData.countryName || 'United States',
      flag: newEmployeeData.country === 'US' ? '🇺🇸' : newEmployeeData.country === 'GB' ? '🇬🇧' : '🌐',
      avatar: AVATARS.marc, // default pleasant avatar
      score: 90,
      tasksDone: 0,
      hoursWorked: 0,
      hourlyRate: rate,
      annualSalary: rate * 1920,
      bonus: 0,
      deductions: Math.round(rate * 0.08 * 160),
      paymentStatus: 'Pending',
      payDate: '2024-08-30',
      attendanceToday: 'Present',
      clockIn: '09:00 AM',
      clockOut: '05:30 PM',
      joinDate: newEmployeeData.joinDate || new Date().toISOString().split('T')[0],
      location: newEmployeeData.location || 'Remote',
      manager: newEmployeeData.manager || 'Siphron',
      skills: typeof newEmployeeData.skills === 'string'
        ? newEmployeeData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : ['General'],
      leaveBalance: { annual: 20, usedAnnual: 0, sick: 10, usedSick: 0 },
      emergencyContact: {
        name: newEmployeeData.emergencyName || 'Family Contact',
        relation: 'Emergency',
        phone: newEmployeeData.emergencyPhone || '+1 (555) 000-1122',
      },
    };

    setTeamMembers((prev) => [newEmp, ...prev]);

    // Add Audit Log
    const log = {
      id: `log-${Date.now()}`,
      category: 'ONBOARDING',
      action: 'New Employee Profile Created',
      details: `${newEmp.name} onboarded into ${newEmp.department} (${newEmp.role})`,
      timestamp: 'Just now',
    };
    setAuditLogs((prev) => [log, ...prev]);

    showNotification(`Employee ${newEmp.name} onboarded successfully!`);
  };

  const updateEmployee = (employeeId, updates) => {
    setTeamMembers((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const updated = { ...emp, ...updates };
          if (updates.hourlyRate) {
            updated.annualSalary = Number(updates.hourlyRate) * 1920;
          }
          return updated;
        }
        return emp;
      })
    );

    // Also update selectedEmployeeForDrawer if currently open
    setSelectedEmployeeForDrawer((prev) => (prev && prev.id === employeeId ? { ...prev, ...updates } : prev));

    const log = {
      id: `log-${Date.now()}`,
      category: 'PERSONNEL',
      action: 'Employee Record Updated',
      details: `Updated information for employee ID ${employeeId}`,
      timestamp: 'Just now',
    };
    setAuditLogs((prev) => [log, ...prev]);

    showNotification('Employee record updated successfully.');
  };

  const terminateEmployee = (employeeId) => {
    updateEmployee(employeeId, { status: 'Terminated', attendanceToday: 'Inactive' });
    showNotification('Employee record moved to Terminated status.', 'alert');
  };

  // Leave Administration
  const approveLeaveRequest = (requestId) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Approved', adminNotes: 'Approved by Administrator' } : req))
    );

    // Mark employee as on leave if starts now
    const req = leaveRequests.find((r) => r.id === requestId);
    if (req) {
      updateEmployee(req.employeeId, { status: 'On Leave', attendanceToday: 'On Leave' });
      const log = {
        id: `log-${Date.now()}`,
        category: 'LEAVE',
        action: 'Leave Request Approved',
        details: `${req.employeeName} approved for ${req.daysCount} days of ${req.leaveType}`,
        timestamp: 'Just now',
      };
      setAuditLogs((prev) => [log, ...prev]);
    }

    showNotification('Leave request approved.');
  };

  const rejectLeaveRequest = (requestId, reason) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Rejected', adminNotes: reason } : req))
    );

    const req = leaveRequests.find((r) => r.id === requestId);
    if (req) {
      const log = {
        id: `log-${Date.now()}`,
        category: 'LEAVE',
        action: 'Leave Request Rejected',
        details: `${req.employeeName} leave petition declined: ${reason}`,
        timestamp: 'Just now',
      };
      setAuditLogs((prev) => [log, ...prev]);
    }

    showNotification('Leave request declined.', 'alert');
  };

  // Project & Task Actions
  const addProject = (newProject) => {
    const createdTask = {
      id: `rec-${Date.now()}`,
      project: newProject.name,
      category: newProject.category || 'General',
      assignees: newProject.assignees || ['emp-1'],
      startDate: newProject.startDate || 'Today',
      dueDate: newProject.dueDate || '30 August, 2024',
      status: newProject.status || 'In Progress',
      priority: newProject.priority || 'Medium',
      progress: 0,
      description: newProject.description || '',
    };
    setRecommendedTasks((prev) => [createdTask, ...prev]);

    const boardTask = {
      id: `task-${Date.now()}`,
      title: newProject.name,
      project: newProject.name,
      status: 'To Do',
      priority: newProject.priority || 'Medium',
      assignee: newProject.assignees?.[0] || 'emp-1',
      dueDate: newProject.dueDate || '2024-09-01',
      subtasks: { total: 3, completed: 0 },
      tags: [newProject.category || 'Project'],
    };
    setMyTasks((prev) => [boardTask, ...prev]);
    showNotification(`Project "${newProject.name}" created successfully!`);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setRecommendedTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setMyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showNotification(`Task status updated to ${newStatus}`);
  };

  const updateMyTaskColumn = (taskId, newColumn) => {
    setMyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newColumn } : t))
    );
    showNotification(`Moved task to "${newColumn}"`);
  };

  const addMyTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      project: taskData.project || 'General Workspace',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      assignee: taskData.assignee || 'emp-1',
      dueDate: taskData.dueDate || '2024-08-30',
      subtasks: { total: taskData.subtasksCount || 3, completed: 0 },
      tags: taskData.tags || ['Design'],
    };
    setMyTasks((prev) => [newTask, ...prev]);
    showNotification(`Added new task: "${newTask.title}"`);
  };

  const updateEmployeePayrollStatus = (employeeId, status) => {
    setTeamMembers((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, paymentStatus: status } : emp))
    );
    showNotification(`Payroll status updated for employee.`);
  };

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        userProfile,
        setUserProfile,
        teamMembers,
        setTeamMembers,
        departments,
        setDepartments,
        leaveRequests,
        setLeaveRequests,
        auditLogs,
        setAuditLogs,
        addEmployee,
        updateEmployee,
        terminateEmployee,
        approveLeaveRequest,
        rejectLeaveRequest,
        recommendedTasks,
        setRecommendedTasks,
        myTasks,
        setMyTasks,
        timelineEvents,
        performance,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sortDirection,
        toggleSort,
        isHideCompleted,
        setIsHideCompleted,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAddEmployeeModalOpen,
        setIsAddEmployeeModalOpen,
        selectedEmployeeForDrawer,
        setSelectedEmployeeForDrawer,
        selectedPayslipEmployee,
        setSelectedPayslipEmployee,
        activeNotification,
        showNotification,
        addProject,
        updateTaskStatus,
        updateMyTaskColumn,
        addMyTask,
        updateEmployeePayrollStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
