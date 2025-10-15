import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Filter...",
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to extract label from option (handles both string and object formats)
  const getOptionLabel = (option) => {
    if (typeof option === 'object' && option !== null) {
      return option.label || option.value || '';
    }
    return option;
  };
// Helper to extract value from option
  const getOptionValue = (option) => {
    if (typeof option === 'object' && option !== null) {
      return option.value || option.label || '';
    }
    return option;
  };

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between min-w-[140px] bg-white shadow-sm hover:shadow-md"
      >
<span className="truncate">
          {value ? getOptionLabel(value) : placeholder}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "w-4 h-4 ml-2 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
        />
      </Button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white rounded-lg border border-slate-200 shadow-xl py-1 max-h-48 overflow-auto">
            <button
              onClick={() => handleSelect("")}
              className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 transition-colors duration-150"
            >
              All
            </button>
{options.map((option) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              
              return (
                <button
                  key={optionValue}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors duration-150",
                    value === optionValue
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;