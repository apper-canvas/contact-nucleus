import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function CompanyDetail({ company, onEdit, onDelete, onClose }) {
  if (!company) return null;

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
              {company.name || 'Unnamed Company'}
            </h1>
            {company.city && company.state && (
              <p className="text-sm text-slate-600 mt-1">
                {company.city}, {company.state}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(company)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(company)}
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
            {/* Company Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                    <p className="mt-1 text-sm text-slate-900">
                      {company.name || 'Not specified'}
                    </p>
                  </div>

                  {company.address && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Address</label>
                      <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">
                        {company.address}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {company.city && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">City</label>
                        <p className="mt-1 text-sm text-slate-900">{company.city}</p>
                      </div>
                    )}
                    {company.state && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">State</label>
                        <p className="mt-1 text-sm text-slate-900">{company.state}</p>
                      </div>
                    )}
                  </div>

                  {company.zipCode && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Zip Code</label>
                      <p className="mt-1 text-sm text-slate-900">{company.zipCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {company.tags && company.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag, index) => (
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
                  {company.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Created</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {company.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Last Updated</label>
                      <p className="mt-1 text-sm text-slate-900">
                        {new Date(company.updatedAt).toLocaleDateString()}
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

export default CompanyDetail;