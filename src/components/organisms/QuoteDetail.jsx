import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function QuoteDetail({ quote, onEdit, onDelete, onClose }) {
  if (!quote) return null;

  const isExpired = (expirationDate) => {
    return expirationDate && new Date(expirationDate) <= new Date();
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
              {quote.name || 'Unnamed Quote'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {quote.amount > 0 && (
                <span className="text-lg font-semibold text-green-600">
                  ${quote.amount.toLocaleString()}
                </span>
              )}
              {quote.expirationDate && (
                <Badge 
                  className={isExpired(quote.expirationDate) ? 
                    'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }
                >
                  {isExpired(quote.expirationDate) ? 'Expired' : 'Active'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(quote)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(quote)}
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
            {/* Quote Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quote Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Quote Name</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {quote.name || 'Not specified'}
                    </p>
                  </div>

                  {quote.description && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">
                        {quote.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-slate-700">Amount</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {quote.amount > 0 ? `$${quote.amount.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {quote.issueDate && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Issue Date</label>
                        <p className="mt-1 text-sm text-slate-900">
                          {new Date(quote.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {quote.expirationDate && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Expiration Date</label>
                        <p className="mt-1 text-sm text-slate-900">
                          {new Date(quote.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {quote.company?.Name && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Company</label>
                      <p className="mt-1 text-sm text-slate-900">{quote.company.Name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {quote.tags && quote.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {quote.tags.map((tag, index) => (
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
                  {quote.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Created</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {quote.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Last Updated</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(quote.updatedAt).toLocaleDateString()}
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

export default QuoteDetail;