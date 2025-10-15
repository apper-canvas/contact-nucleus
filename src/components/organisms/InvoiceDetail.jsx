import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function InvoiceDetail({ invoice, onEdit, onDelete, onClose }) {
  if (!invoice) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'void':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-white"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {invoice.invoiceNumber || 'No Invoice Number'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {invoice.amountDue > 0 && (
                <span className="text-lg font-semibold text-green-600">
                  ${invoice.amountDue.toLocaleString()}
                </span>
              )}
              {invoice.status && (
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(invoice)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(invoice)}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Invoice Number</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {invoice.invoiceNumber || 'Not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {invoice.invoiceDate && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Invoice Date</label>
                        <p className="mt-1 text-sm text-slate-900">
                          {invoice.invoiceDate && !isNaN(new Date(invoice.invoiceDate).getTime())
                            ? new Date(invoice.invoiceDate).toLocaleDateString()
                            : 'Not set'}
                        </p>
                      </div>
                    )}
                    {invoice.dueDate && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Due Date</label>
                        <p className="mt-1 text-sm text-slate-900">
                          {invoice.dueDate && !isNaN(new Date(invoice.dueDate).getTime())
                            ? new Date(invoice.dueDate).toLocaleDateString()
                            : 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Amount Due</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {invoice.amountDue > 0 ? `$${invoice.amountDue.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {invoice.status || 'Not specified'}
                    </p>
                  </div>

                  {invoice.contact?.Name && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Contact</label>
                      <p className="mt-1 text-sm text-slate-900">{invoice.contact.Name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {invoice.tags && invoice.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {invoice.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h2>
                <div className="space-y-4">
                  {invoice.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Created</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {invoice.createdAt && !isNaN(new Date(invoice.createdAt).getTime())
                          ? new Date(invoice.createdAt).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}
                  {invoice.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Last Updated</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {invoice.updatedAt && !isNaN(new Date(invoice.updatedAt).getTime())
                          ? new Date(invoice.updatedAt).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InvoiceDetail;