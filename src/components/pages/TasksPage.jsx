import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TaskDetail from "@/components/organisms/TaskDetail";
import TaskList from "@/components/organisms/TaskList";
import DeleteTaskModal from "@/components/organisms/DeleteTaskModal";
import TaskModal from "@/components/organisms/TaskModal";

function TasksPage() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  function handleSelectTask(task) {
    setSelectedTask(task);
    setShowMobileDetail(true);
  }

  function handleEditTask(task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }

  function handleDeleteTask(task) {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }

  function handleSaveTask() {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }

  function handleTaskDeleted(deletedTask) {
    if (selectedTask?.id === deletedTask.id) {
      setSelectedTask(null);
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  }

  function handleCloseMobileDetail() {
    setShowMobileDetail(false);
  }

  return (
<div className="min-h-screen bg-green-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-slate-800">Tasks</h1>
      </div>

      <div className="flex h-screen lg:h-auto lg:min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
<div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">HubCRM</h1>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              Tasks
            </h2>
          </div>
          
<div className="flex-1 p-4 space-y-2">
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
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Task List */}
          <div className="flex-1 lg:flex-none lg:w-96 bg-white lg:border-r border-slate-200">
            <div className="p-4 lg:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">All Tasks</h2>
                <p className="text-sm text-slate-600 mt-1">Manage your task list</p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 whitespace-nowrap"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add Task
              </Button>
            </div>

            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
              <TaskList
                onSelectTask={handleSelectTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                selectedTaskId={selectedTask?.id}
              />
            </div>
          </div>

          {/* Task Detail - Desktop */}
          <div className="hidden lg:flex flex-1">
            {selectedTask ? (
              <TaskDetail
                task={selectedTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onBack={() => setSelectedTask(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="CheckSquare" className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No task selected</h3>
                  <p className="text-slate-600">Choose a task from the list to view details</p>
                </div>
              </div>
            )}
          </div>

          {/* Task Detail - Mobile Overlay */}
          {showMobileDetail && selectedTask && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
            >
              <TaskDetail
                task={selectedTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onBack={handleCloseMobileDetail}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <TaskModal
          task={taskToEdit}
          onSave={handleSaveTask}
          onCancel={handleCloseModal}
        />
      )}

      {isDeleteModalOpen && taskToDelete && (
        <DeleteTaskModal
          task={taskToDelete}
          onConfirm={handleTaskDeleted}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}

export default TasksPage;