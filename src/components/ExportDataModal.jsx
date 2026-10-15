import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Table } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.jsx';

export default function ExportDataModal() {
  const { isExportModalOpen, setIsExportModalOpen, recommendedTasks, myTasks, teamMembers, showNotification } = useApp();
  const [format, setFormat] = useState('csv'); // 'csv' | 'json'
  const [dataType, setDataType] = useState('tasks'); // 'tasks' | 'payroll' | 'summary'
  const [isExporting, setIsExporting] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      let dataString = '';
      let filename = `siphron-${dataType}-${Date.now()}.${format}`;

      if (dataType === 'tasks') {
        if (format === 'json') {
          dataString = JSON.stringify(recommendedTasks, null, 2);
        } else {
          const headers = 'ID,Project,Category,Status,Priority,StartDate,DueDate\n';
          const rows = recommendedTasks
            .map((t) => `"${t.id}","${t.project}","${t.category}","${t.status}","${t.priority}","${t.startDate}","${t.dueDate}"`)
            .join('\n');
          dataString = headers + rows;
        }
      } else if (dataType === 'payroll') {
        if (format === 'json') {
          dataString = JSON.stringify(teamMembers, null, 2);
        } else {
          const headers = 'EmployeeID,Name,Role,Department,HourlyRate,HoursWorked,Status\n';
          const rows = teamMembers
            .map((m) => `"${m.id}","${m.name}","${m.role}","${m.department}",${m.hourlyRate},${m.hoursWorked},"${m.paymentStatus}"`)
            .join('\n');
          dataString = headers + rows;
        }
      } else {
        const summary = {
          exportDate: new Date().toISOString(),
          totalProjects: recommendedTasks.length,
          totalEmployees: teamMembers.length,
          activeTasks: myTasks.length,
        };
        dataString = format === 'json' ? JSON.stringify(summary, null, 2) : `TotalProjects,${recommendedTasks.length}\nTotalEmployees,${teamMembers.length}`;
      }

      const blob = new Blob([dataString], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setIsExportModalOpen(false);
      showNotification(`Exported ${filename} successfully!`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-7"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Workspace Data</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download formatted files</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Select Dataset
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDataType('tasks')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  dataType === 'tasks'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Task Board</span>
              </button>
              <button
                type="button"
                onClick={() => setDataType('payroll')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  dataType === 'payroll'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Payroll</span>
              </button>
              <button
                type="button"
                onClick={() => setDataType('summary')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  dataType === 'summary'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Summary</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>Spreadsheet (.CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  format === 'json'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>JSON Document (.JSON)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={isExporting}
            onClick={handleDownload}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Download File'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
