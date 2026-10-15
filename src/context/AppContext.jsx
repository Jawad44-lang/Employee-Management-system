import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_TEAM_MEMBERS,
  INITIAL_RECOMMENDED_TASKS,
  MY_TASKS_BOARD,
  TIMELINE_EVENTS,
  PERFORMANCE_DATA,
  AVATARS,
} from '../services/mockData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation: 'dashboard' | 'mytask' | 'report' | 'payroll'
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
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('siphron_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Siphron',
    title: 'Welcome back, Siphron',
    subtitle: 'Monday, 18 August, 2024',
    avatar: AVATARS.siphron,
    role: 'Creative Director',
    email: 'siphron.director@agency.co',
  });

  // Data states
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [recommendedTasks, setRecommendedTasks] = useState(INITIAL_RECOMMENDED_TASKS);
  const [myTasks, setMyTasks] = useState(MY_TASKS_BOARD);
  const [timelineEvents, setTimelineEvents] = useState(TIMELINE_EVENTS);
  const [performance] = useState(PERFORMANCE_DATA);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [isHideCompleted, setIsHideCompleted] = useState(false);

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setActiveNotification({ message, type });
    setTimeout(() => {
      setActiveNotification(null);
    }, 3500);
  };

  // Actions
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

    // Also add to My Tasks board if applicable
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
