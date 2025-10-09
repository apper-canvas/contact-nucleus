import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { quoteService } from '@/services/api/quoteService';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

function DeleteQuoteModal({ quote, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await quoteService.delete(quote.Id);
      toast.success('Quote deleted successfully');
      onConfirm(quote);
    } catch (error) {
      toast.error(error.message || 'Failed to delete quote');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">Delete Quote</h3>
              <p className="text-sm text-slate-500">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 mb-6">
            Are you sure you want to delete <strong>{quote.name || 'this quote'}</strong>? 
            This will permanently remove all quote information.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
            >
              {loading && <Loading size="sm" />}
              Delete Quote
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteQuoteModal;