import React from 'react';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

function CompanyCard({ company, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-200'
          : 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
      onClick={() => onSelect(company)}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6">
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(company);
            }}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            title="Edit company"
          >
            <ApperIcon name="Edit" className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(company);
            }}
            className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
            title="Delete company"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl">
          <ApperIcon name="Building" className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
          {company.name || 'Unnamed Company'}
        </h3>
        
        {company.city && company.state && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4" />
            <span className="truncate">{company.city}, {company.state}</span>
          </div>
        )}

        {company.tags && company.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {company.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {company.tags.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{company.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyCard;