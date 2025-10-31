import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import DealModal from "@/components/organisms/DealModal";
import DealList from "@/components/organisms/DealList";
import DeleteDealModal from "@/components/organisms/DeleteDealModal";
import DealDetailModal from "@/components/organisms/DealDetailModal";

function DealsPage() {
  const navigate = useNavigate();
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectDeal = (deal) => {
    setSelectedDeal(deal);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowDealModal(true);
  };

  const handleDeleteDeal = (deal) => {
    setDealToDelete(deal);
    setShowDeleteModal(true);
  };

  const handleSaveDeal = () => {
    setRefreshKey(prev => prev + 1);
    setShowDealModal(false);
    setEditingDeal(null);
  };

  const handleDealDeleted = (deletedDeal) => {
    setRefreshKey(prev => prev + 1);
    if (selectedDeal?.Id === deletedDeal.Id) {
      setSelectedDeal(null);
    }
    setShowDeleteModal(false);
    setDealToDelete(null);
  };

  const handleCloseModal = () => {
    setShowDealModal(false);
    setEditingDeal(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDealToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setSelectedDeal(null);
  };

  return (
<div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-green-200 bg-white shadow-sm">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  HubCRM
                </h1>
                <p className="text-sm text-slate-600">Customer Relationship Management</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              <button onClick={() => navigate('/contacts')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Users" className="w-4 h-4" />
                Contacts
              </button>
              <button onClick={() => navigate('/companies')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Building" className="w-4 h-4" />
                Companies
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                Deals
              </button>
              <button onClick={() => navigate('/tasks')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="CheckSquare" className="w-4 h-4" />
                Tasks
              </button>
              <button onClick={() => navigate('/activities')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Activity" className="w-4 h-4" />
                Activities
              </button>
              <button onClick={() => navigate('/quotes')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Receipt" className="w-4 h-4" />
                Quotes
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Deal List */}
        <div className="flex-1 lg:flex-none lg:w-96 flex flex-col bg-white border-r border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900">All Deals</h2>
            </div>
            <Button
              onClick={() => setShowDealModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Deal
            </Button>
          </div>

          {/* Deal List Content */}
          <DealList
            refreshKey={refreshKey}
            onSelectDeal={handleSelectDeal}
            onEditDeal={handleEditDeal}
            onDeleteDeal={handleDeleteDeal}
            selectedDeal={selectedDeal}
          />
        </div>

        {/* Deal Detail */}
      </div>

      {/* Modals */}
{showDealModal && (
        <DealModal
          deal={editingDeal}
          onSave={handleSaveDeal}
          onClose={handleCloseModal}
        />
      )}

      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
          onClose={handleCloseMobileDetail}
        />
      )}

      {showDeleteModal && dealToDelete && (
        <DeleteDealModal
          deal={dealToDelete}
          onConfirm={handleDealDeleted}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}

export default DealsPage;