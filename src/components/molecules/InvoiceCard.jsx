import React from 'react';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function InvoiceCard({ invoice, isSelected, onSelect, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'void':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
          : 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
      onClick={() => onSelect(invoice)}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6">
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(invoice);
            }}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            title="Edit invoice"
          >
            <ApperIcon name="Edit" className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(invoice);
            }}
            className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
            title="Delete invoice"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl">
          <ApperIcon name="FileText" className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
          {invoice.invoiceNumber || 'No Invoice Number'}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {invoice.amountDue > 0 && (
            <span className="text-sm font-medium text-green-600">
              ${invoice.amountDue.toLocaleString()}
            </span>
          )}
          {invoice.status && (
            <Badge 
              className={getStatusColor(invoice.status)} 
              size="sm"
            >
              {invoice.status}
            </Badge>
          )}
        </div>

        {invoice.contact?.Name && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <ApperIcon name="User" className="w-4 h-4" />
            <span className="truncate">{invoice.contact.Name}</span>
          </div>
        )}

        <div className="space-y-1 mt-3">
          {invoice.invoiceDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>Invoice: {new Date(invoice.invoiceDate).toLocaleDateString()}</span>
            </div>
          )}
          {invoice.dueDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ApperIcon name="Clock" className="w-3 h-3" />
              <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceCard;