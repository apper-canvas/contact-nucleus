import React from 'react';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const getActivityTypeColor = (type) => {
  const colors = {
    'Call': 'bg-blue-100 text-blue-800 border-blue-200',
    'Email': 'bg-purple-100 text-purple-800 border-purple-200',
    'Meeting': 'bg-green-100 text-green-800 border-green-200',
    'Task': 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colors[type] || 'bg-slate-100 text-slate-800 border-slate-200';
};

const getStatusColor = (status) => {
  const colors = {
    'Planned': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-slate-100 text-slate-800 border-slate-200'
  };
  return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
};

const isOverdue = (dueDate, status) => {
  if (status === 'Completed' || status === 'Cancelled') return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function ActivityCard({ activity, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
          : 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
      onClick={() => onSelect(activity)}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6">
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(activity);
            }}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            title="Edit activity"
          >
            <ApperIcon name="Edit" className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(activity);
            }}
            className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
            title="Delete activity"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl">
          <ApperIcon name="Activity" className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
          {activity.subject}
        </h3>
        
        {activity.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {activity.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <Badge className={getActivityTypeColor(activity.activityType)} size="sm">
            {activity.activityType || 'Call'}
          </Badge>
          <Badge className={getStatusColor(activity.status)} size="sm">
            {activity.status || 'Planned'}
          </Badge>
        </div>

        {activity.dueDate && (
          <div className={cn(
            'flex items-center gap-2 text-xs mt-3',
            isOverdue(activity.dueDate, activity.status) ? 'text-red-600' : 'text-slate-500'
          )}>
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>Due: {formatDate(activity.dueDate)}</span>
            {isOverdue(activity.dueDate, activity.status) && (
              <Badge className="bg-red-100 text-red-700 border-red-200 ml-1" size="sm">
                Overdue
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;