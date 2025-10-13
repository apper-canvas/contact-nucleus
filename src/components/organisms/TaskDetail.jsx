import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function TaskDetail({ task, onEdit, onDelete, onBack }) {
  if (!task) return null;

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
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not set';
    return date.toLocaleDateString();
  }

function formatDateTime(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not set';
    return date.toLocaleString();
  }

function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return false;
    return due < today;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 bg-white overflow-y-auto"
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-4 lg:p-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={onBack}
            className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            Back
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-slate-900">Task Details</h1>
            <p className="text-slate-600 mt-1">View and manage task information</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => onEdit(task)}
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(task)}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(task.status)}`}>
            {task.status || 'Open'}
          </Badge>
          <Badge className={`${getPriorityColor(task.priority)}`}>
            {task.priority || 'Medium'} Priority
          </Badge>
          {task.dueDate && isOverdue(task.dueDate) && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5" />
                Task Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Name</label>
                  <p className="text-slate-900">{task.name}</p>
                </div>

                {task.description && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                    <p className="text-slate-900 whitespace-pre-wrap">{task.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                    <p className="text-slate-900">{task.status || 'Open'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Priority</label>
                    <p className="text-slate-900">{task.priority || 'Medium'}</p>
                  </div>
                </div>

                {task.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Due Date</label>
                    <p className={`${isOverdue(task.dueDate) ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate) && (
                        <span className="ml-2 text-red-600 text-sm font-medium">
                          (Overdue)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {task.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Assigned To</label>
                    <p className="text-slate-900">{task.assignedTo?.Name || 'Unassigned'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Info" className="w-5 h-5" />
                System Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Created</label>
                  <p className="text-slate-600">{formatDateTime(task.createdAt)}</p>
                </div>

                {task.modifiedAt && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Last Modified</label>
                    <p className="text-slate-600">{formatDateTime(task.modifiedAt)}</p>
                  </div>
                )}

                {task.owner && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Owner</label>
                    <p className="text-slate-600">{task.owner.Name || 'Not set'}</p>
                  </div>
                )}

                {task.createdBy && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Created By</label>
                    <p className="text-slate-600">{task.createdBy.Name || 'Not set'}</p>
                  </div>
                )}

                {task.modifiedBy && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Modified By</label>
                    <p className="text-slate-600">{task.modifiedBy.Name || 'Not set'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskDetail;