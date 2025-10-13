import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { taskService } from '@/services/api/taskService';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function DeleteTaskModal({ task, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);
      const success = await taskService.delete(task.id);
      if (success) {
        onConfirm(task);
      }
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Delete Task</h3>
              <p className="text-slate-600 text-sm">This action cannot be undone</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-slate-700">
              Are you sure you want to delete the task <strong>"{task.name}"</strong>?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Delete Task
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteTaskModal;