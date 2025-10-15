import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* Simple Spinner Icon */}
      <div className="w-6 h-6 border-3 border-slate-300 border-t-primary-500 rounded-full animate-spin"></div>
      
      {/* Optional Message */}
      {message && (
        <p className="mt-3 text-sm text-slate-600">{message}</p>
      )}
    </div>
  );
};

export default Loading;