import React from 'react';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const getStageColor = (stage) => {
  const colors = {
    'Prospecting': 'bg-blue-100 text-blue-800 border-blue-200',
    'Qualification': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Proposal': 'bg-purple-100 text-purple-800 border-purple-200',
    'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
    'Closed Won': 'bg-green-100 text-green-800 border-green-200',
    'Closed Lost': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[stage] || 'bg-slate-100 text-slate-800 border-slate-200';
};

function DealCard({ deal, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
          : 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
      onClick={() => onSelect(deal)}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6">
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            title="Edit deal"
          >
            <ApperIcon name="Edit" className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal);
            }}
            className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
            title="Delete deal"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl">
          <ApperIcon name="TrendingUp" className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
          {deal.name || 'Unnamed Deal'}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {deal.amount > 0 && (
            <span className="text-sm font-medium text-green-600">
              ${deal.amount.toLocaleString()}
            </span>
          )}
          {deal.stage && (
            <Badge className={getStageColor(deal.stage)} size="sm">
              {deal.stage}
            </Badge>
          )}
        </div>

        {deal.company?.Name && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <ApperIcon name="Building" className="w-4 h-4" />
            <span className="truncate">{deal.company.Name}</span>
          </div>
        )}

        {deal.closeDate && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>Close: {new Date(deal.closeDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DealCard;