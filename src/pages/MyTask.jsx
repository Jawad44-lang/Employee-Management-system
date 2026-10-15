import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Calendar,
  Filter,
  CheckSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';
import { getStatusBadgeStyle } from '../utils/formatters.js';

export default function MyTask() {
  const { myTasks, teamMembers, updateMyTaskColumn, addMyTask, searchQuery } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Branding, visual identy');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskAssignee, setNewTaskAssignee] = useState('emp-1');

  const columns = ['To Do', 'In Progress', 'Review', 'Completed'];

  // Filter tasks
  const filteredTasks = myTasks.filter((task) => {
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
    if (filterAssignee !== 'All' && task.assignee !== filterAssignee) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.project.toLowerCase().includes(q) ||
        (task.tags && task.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addMyTask({
      title: newTaskTitle.trim(),
      project: newTaskProject,
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      status: 'To Do',
      subtasksCount: 3,
      tags: ['Sprint 34'],
    });

    setNewTaskTitle('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Task Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track individual workstreams, assignees, subtasks, and sprint deliverables.
          </p>
        </div>

        {/* View Toggle & Add Task */}
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl flex items-center shadow-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1, boxShadow: '0 10px 25px -5px rgba(127, 86, 217, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7F56D9] hover:bg-[#6D42D0] text-white text-xs font-semibold rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pr-2">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          {['All', 'High', 'Medium', 'Normal'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterPriority === p
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {p === 'All' ? 'All Priorities' : p}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        {/* Assignee Filter */}
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-hidden text-xs"
        >
          <option value="All">All Assignees</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col);

            return (
              <div
                key={col}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {col}
                    </h3>
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3.5 flex-1">
                  {colTasks.map((task) => {
                    const assignee = teamMembers.find((m) => m.id === task.assignee) || teamMembers[0];

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -3, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.06)' }}
                        key={task.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                            {task.project}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'High'
                                ? 'text-red-600 bg-red-50 dark:bg-red-950/40'
                                : task.priority === 'Medium'
                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                                : 'text-slate-600 bg-slate-100 dark:bg-slate-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        {/* Subtasks info */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>
                            {task.subtasks?.completed || 0}/{task.subtasks?.total || 3} subtasks
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60">
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={assignee.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-slate-700"
                            />
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Quick Column Shift Controls */}
                          <div className="flex items-center gap-1">
                            {col !== 'To Do' && (
                              <button
                                onClick={() => {
                                  const prevColIndex = columns.indexOf(col) - 1;
                                  if (prevColIndex >= 0) updateMyTaskColumn(task.id, columns[prevColIndex]);
                                }}
                                className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 cursor-pointer"
                                title="Move left"
                              >
                                ←
                              </button>
                            )}
                            {col !== 'Completed' && (
                              <button
                                onClick={() => {
                                  const nextColIndex = columns.indexOf(col) + 1;
                                  if (nextColIndex < columns.length) updateMyTaskColumn(task.id, columns[nextColIndex]);
                                }}
                                className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 cursor-pointer"
                                title="Move right"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-medium">Task</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Assignee</th>
                <th className="pb-3 font-medium">Due Date</th>
                <th className="pb-3 text-right font-medium">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredTasks.map((task) => {
                const assignee = teamMembers.find((m) => m.id === task.assignee) || teamMembers[0];
                return (
                  <tr key={task.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white pr-4">
                      {task.title}
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 pr-4">
                      {task.project}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${getStatusBadgeStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 pr-4">
                      {task.priority}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{assignee.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 pr-4">
                      {task.dueDate}
                    </td>
                    <td className="py-3.5 text-right">
                      <select
                        value={task.status}
                        onChange={(e) => updateMyTaskColumn(task.id, e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Add Task Modal */}
      <AnimatePresence>
        {isNewTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Task to Board</h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit typography kerning"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <input
                    type="text"
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Assignee
                    </label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewTaskOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7F56D9] text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
