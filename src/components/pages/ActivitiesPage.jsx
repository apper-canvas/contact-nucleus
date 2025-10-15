import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ActivityList from "@/components/organisms/ActivityList";
import ActivityModal from "@/components/organisms/ActivityModal";
import DeleteActivityModal from "@/components/organisms/DeleteActivityModal";
import ActivityDetail from "@/components/organisms/ActivityDetail";

function ActivitiesPage() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  function handleSelectActivity(activity) {
    setSelectedActivity(activity);
    setShowMobileDetail(true);
  }

  function handleEditActivity(activity) {
    setActivityToEdit(activity);
    setIsModalOpen(true);
  }

  function handleDeleteActivity(activity) {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  }

  function handleSaveActivity() {
    setIsModalOpen(false);
    setActivityToEdit(null);
  }

  function handleActivityDeleted(deletedActivity) {
    if (selectedActivity?.id === deletedActivity.id) {
      setSelectedActivity(null);
    }
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setActivityToEdit(null);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  }

  function handleCloseMobileDetail() {
    setShowMobileDetail(false);
  }

  return (
<div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-green-200 bg-white shadow-sm">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-7 h-7 text-white" />
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
              <button onClick={() => navigate('/deals')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                Deals
              </button>
              <button onClick={() => navigate('/tasks')} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="CheckSquare" className="w-4 h-4" />
                Tasks
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
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

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Activity List */}
          <div className="flex-1 lg:flex-none lg:w-96 bg-white lg:border-r border-slate-200">
            <div className="p-4 lg:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">All Activities</h2>
                <p className="text-sm text-slate-600 mt-1">Manage your activities</p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 whitespace-nowrap"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add Activity
              </Button>
            </div>

            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
              <ActivityList
                onSelectActivity={handleSelectActivity}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
                selectedActivityId={selectedActivity?.id}
              />
            </div>
          </div>

          {/* Activity Detail - Desktop */}
          <div className="hidden lg:flex flex-1">
            {selectedActivity ? (
              <ActivityDetail
                activity={selectedActivity}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                onBack={() => setSelectedActivity(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Activity" className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No activity selected</h3>
                  <p className="text-slate-600">Choose an activity from the list to view details</p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Detail - Mobile Overlay */}
          {showMobileDetail && selectedActivity && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
            >
              <ActivityDetail
                activity={selectedActivity}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                onBack={handleCloseMobileDetail}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ActivityModal
          activity={activityToEdit}
          onSave={handleSaveActivity}
          onCancel={handleCloseModal}
        />
      )}

      {isDeleteModalOpen && activityToDelete && (
        <DeleteActivityModal
          activity={activityToDelete}
          onConfirm={handleActivityDeleted}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}

export default ActivitiesPage;