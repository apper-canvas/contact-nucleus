import React from 'react';
import { motion } from 'framer-motion';
import InvoiceForm from './InvoiceForm';
import ApperIcon from '@/components/ApperIcon';

function InvoiceModal({ invoice, onSave, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {invoice ? 'Edit Invoice' : 'Add New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-2"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <InvoiceForm
            invoice={invoice}
            onSave={onSave}
            onCancel={onClose}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default InvoiceModal;