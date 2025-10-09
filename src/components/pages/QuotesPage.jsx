import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QuoteList from '@/components/organisms/QuoteList';
import QuoteDetail from '@/components/organisms/QuoteDetail';
import QuoteModal from '@/components/organisms/QuoteModal';
import DeleteQuoteModal from '@/components/organisms/DeleteQuoteModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function QuotesPage() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  const handleDeleteQuote = (quote) => {
    setQuoteToDelete(quote);
    setShowDeleteModal(true);
  };

  const handleSaveQuote = () => {
    setRefreshKey(prev => prev + 1);
    setShowQuoteModal(false);
    setEditingQuote(null);
  };

  const handleQuoteDeleted = (deletedQuote) => {
    setRefreshKey(prev => prev + 1);
    if (selectedQuote?.Id === deletedQuote.Id) {
      setSelectedQuote(null);
    }
    setShowDeleteModal(false);
    setQuoteToDelete(null);
  };

  const handleCloseModal = () => {
    setShowQuoteModal(false);
    setEditingQuote(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setQuoteToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setSelectedQuote(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Quotes</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            <button onClick={() => window.location.href = '/contacts'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Users" className="w-4 h-4" />
              Contacts
            </button>
            <button onClick={() => window.location.href = '/companies'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Building" className="w-4 h-4" />
              Companies
            </button>
            <button onClick={() => window.location.href = '/deals'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              Deals
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
              <ApperIcon name="Receipt" className="w-4 h-4" />
              Quotes
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Quote List */}
        <div className="flex-1 lg:flex-none lg:w-96 flex flex-col bg-white border-r border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900">All Quotes</h2>
            </div>
            <Button
              onClick={() => setShowQuoteModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Quote
            </Button>
          </div>

          {/* Quote List Content */}
          <QuoteList
            refreshKey={refreshKey}
            onSelectQuote={handleSelectQuote}
            onEditQuote={handleEditQuote}
            onDeleteQuote={handleDeleteQuote}
            selectedQuote={selectedQuote}
          />
        </div>

        {/* Quote Detail */}
        <motion.div
          className={`flex-1 ${
            selectedQuote
              ? 'fixed inset-0 lg:relative lg:inset-auto bg-white z-50'
              : 'hidden lg:flex'
          } flex-col`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {selectedQuote ? (
            <QuoteDetail
              quote={selectedQuote}
              onEdit={handleEditQuote}
              onDelete={handleDeleteQuote}
              onClose={handleCloseMobileDetail}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <ApperIcon name="Receipt" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a quote to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {showQuoteModal && (
        <QuoteModal
          quote={editingQuote}
          onSave={handleSaveQuote}
          onClose={handleCloseModal}
        />
      )}

      {showDeleteModal && quoteToDelete && (
        <DeleteQuoteModal
          quote={quoteToDelete}
          onConfirm={handleQuoteDeleted}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}

export default QuotesPage;