import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

function TaskList({ selectedTaskId, onSelectTask, onEditTask, onDeleteTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
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
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {tasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description="Start by adding your first task"
          actionLabel="Add Task"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                isSelected={selectedTaskId === task.id}
                onSelect={onSelectTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;