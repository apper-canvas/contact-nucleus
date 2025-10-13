import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function DealDetail({ deal, onEdit, onDelete, onClose }) {
  if (!deal) return null;

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Prospecting':
        return 'bg-blue-100 text-blue-800';
      case 'Qualification':
        return 'bg-purple-100 text-purple-800';
      case 'Needs Analysis':
        return 'bg-yellow-100 text-yellow-800';
      case 'Value Proposition':
        return 'bg-orange-100 text-orange-800';
      case 'Decision Making':
        return 'bg-indigo-100 text-indigo-800';
      case 'Negotiation':
        return 'bg-pink-100 text-pink-800';
      case 'Closed Won':
        return 'bg-green-100 text-green-800';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              {deal.name || 'Unnamed Deal'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {deal.amount > 0 && (
                <span className="text-lg font-semibold text-green-600">
                  ${deal.amount.toLocaleString()}
                </span>
              )}
              {deal.stage && (
                <Badge className={getStageColor(deal.stage)}>
                  {deal.stage}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(deal)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(deal)}
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
            {/* Deal Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Deal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Deal Name</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {deal.name || 'Not specified'}
                    </p>
                  </div>

                  {deal.description && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">
                        {deal.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Amount</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {deal.amount > 0 ? `$${deal.amount.toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Stage</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {deal.stage || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {deal.closeDate && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Expected Close Date</label>
                      <p className="mt-1 text-sm text-slate-900">
{deal.closeDate && !isNaN(new Date(deal.closeDate).getTime())
                          ? new Date(deal.closeDate).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}

                  {deal.company?.Name && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Company</label>
                      <p className="mt-1 text-sm text-slate-900">{deal.company.Name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {deal.tags && deal.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {deal.tags.map((tag, index) => (
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
                  {deal.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Created</label>
<p className="mt-1 text-sm text-slate-900">
                        {deal.createdAt && !isNaN(new Date(deal.createdAt).getTime())
                          ? new Date(deal.createdAt).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  )}
                  {deal.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Last Updated</label>
<p className="mt-1 text-sm text-slate-900">
                        {deal.updatedAt && !isNaN(new Date(deal.updatedAt).getTime())
                          ? new Date(deal.updatedAt).toLocaleDateString()
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

export default DealDetail;