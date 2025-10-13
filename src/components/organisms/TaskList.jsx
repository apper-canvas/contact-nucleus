import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { taskService } from '@/services/api/taskService';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

function TaskList({ onSelectTask, onEditTask, onDeleteTask, selectedTaskId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  function getPriorityColor(priority) {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'open':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  if (tasks.length === 0) return <Empty message="No tasks found" />;

  return (
    <div className="divide-y divide-slate-200">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors duration-200 ${
            selectedTaskId === task.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
          onClick={() => onSelectTask(task)}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-slate-900 truncate flex-1 mr-2">
              {task.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task);
                }}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}>
              {task.status || 'Open'}
            </Badge>
            <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
              {task.priority || 'Medium'}
            </Badge>
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue(task.dueDate) ? 'text-red-600' : 'text-slate-500'
            }`}>
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>Due: {formatDate(task.dueDate)}</span>
              {isOverdue(task.dueDate) && (
                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-1 py-0.5 ml-1">
                  Overdue
                </Badge>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default TaskList;