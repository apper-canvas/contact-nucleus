import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { activityService } from "@/services/api/activityService";
import ActivityCard from "@/components/molecules/ActivityCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

function ActivityList({ selectedActivityId, onSelectActivity, onEditActivity, onDeleteActivity }) {
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
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {activities.length === 0 ? (
        <Empty
          icon="Activity"
          title="No activities found"
          description="Start by adding your first activity"
          actionLabel="Add Activity"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ActivityCard
                activity={activity}
                isSelected={selectedActivityId === activity.id}
                onSelect={onSelectActivity}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ActivityList;