import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function ActivityDetail({ activity, onEdit, onDelete, onBack }) {
  if (!activity) return null;

  function getActivityTypeColor(type) {
    switch (type?.toLowerCase()) {
      case 'call':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'email':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'meeting':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'planned':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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

  function isOverdue(dueDate, status) {
    if (!dueDate || status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'cancelled') return false;
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
            <h1 className="text-2xl font-bold text-slate-900">Activity Details</h1>
            <p className="text-slate-600 mt-1">View and manage activity information</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => onEdit(activity)}
              className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(activity)}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`${getActivityTypeColor(activity.activityType)}`}>
            {activity.activityType || 'Call'}
          </Badge>
          <Badge className={`${getStatusColor(activity.status)}`}>
            {activity.status || 'Planned'}
          </Badge>
          {activity.dueDate && isOverdue(activity.dueDate, activity.status) && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5" />
                Activity Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Subject</label>
                  <p className="text-slate-900">{activity.subject}</p>
                </div>

                {activity.description && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                    <p className="text-slate-900 whitespace-pre-wrap">{activity.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Activity Type</label>
                    <p className="text-slate-900">{activity.activityType || 'Call'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                    <p className="text-slate-900">{activity.status || 'Planned'}</p>
                  </div>
                </div>

                {activity.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Due Date</label>
                    <p className={`${isOverdue(activity.dueDate, activity.status) ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatDateTime(activity.dueDate)}
                      {isOverdue(activity.dueDate, activity.status) && (
                        <span className="ml-2 text-red-600 text-sm font-medium">
                          (Overdue)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {activity.tags && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Tags</label>
                    <p className="text-slate-900">{activity.tags}</p>
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
                  <p className="text-slate-600">{formatDateTime(activity.createdOn)}</p>
                </div>

                {activity.modifiedOn && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Last Modified</label>
                    <p className="text-slate-600">{formatDateTime(activity.modifiedOn)}</p>
                  </div>
                )}

                {activity.owner && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Owner</label>
                    <p className="text-slate-600">{activity.owner.Name || 'Not set'}</p>
                  </div>
                )}

                {activity.createdBy && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Created By</label>
                    <p className="text-slate-600">{activity.createdBy.Name || 'Not set'}</p>
                  </div>
                )}

                {activity.modifiedBy && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Modified By</label>
                    <p className="text-slate-600">{activity.modifiedBy.Name || 'Not set'}</p>
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

export default ActivityDetail;