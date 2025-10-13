import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { activityService } from '@/services/api/activityService';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

function ActivityList({ onSelectActivity, onEditActivity, onDeleteActivity, selectedActivityId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function isOverdue(dueDate, status) {
    if (!dueDate || status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'cancelled') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;
  if (activities.length === 0) return <Empty message="No activities found" />;

  return (
    <div className="divide-y divide-slate-200">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors duration-200 ${
            selectedActivityId === activity.id ? 'bg-purple-50 border-r-2 border-purple-500' : ''
          }`}
          onClick={() => onSelectActivity(activity)}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-slate-900 truncate flex-1 mr-2">
              {activity.subject}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditActivity(activity);
                }}
                className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteActivity(activity);
                }}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activity.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {activity.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs px-2 py-1 ${getActivityTypeColor(activity.activityType)}`}>
              {activity.activityType || 'Call'}
            </Badge>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(activity.status)}`}>
              {activity.status || 'Planned'}
            </Badge>
          </div>

          {activity.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue(activity.dueDate, activity.status) ? 'text-red-600' : 'text-slate-500'
            }`}>
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>Due: {formatDate(activity.dueDate)}</span>
              {isOverdue(activity.dueDate, activity.status) && (
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

export default ActivityList;