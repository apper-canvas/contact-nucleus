import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ActivityForm from '@/components/organisms/ActivityForm';
import ApperIcon from '@/components/ApperIcon';

function ActivityModal({ activity, onSave, onCancel }) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <ActivityForm
            activity={activity}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default ActivityModal;