import React from 'react';
import { motion } from 'framer-motion';
import DealDetail from './DealDetail';

function DealDetailModal({ deal, onEdit, onDelete, onClose }) {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <DealDetail
          deal={deal}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
        />
      </motion.div>
    </div>
  );
}

export default DealDetailModal;