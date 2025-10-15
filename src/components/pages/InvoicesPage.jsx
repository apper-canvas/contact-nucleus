import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import InvoiceModal from "@/components/organisms/InvoiceModal";
import InvoiceList from "@/components/organisms/InvoiceList";
import DeleteInvoiceModal from "@/components/organisms/DeleteInvoiceModal";
import InvoiceDetail from "@/components/organisms/InvoiceDetail";

function InvoicesPage() {
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const handleSaveInvoice = () => {
    setRefreshKey(prev => prev + 1);
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleInvoiceDeleted = (deletedInvoice) => {
    setRefreshKey(prev => prev + 1);
    if (selectedInvoice?.Id === deletedInvoice.Id) {
      setSelectedInvoice(null);
    }
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const handleCloseModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setSelectedInvoice(null);
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
                <ApperIcon name="FileText" className="w-7 h-7 text-white" />
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
              <button
                onClick={() => navigate("/contacts")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Users" className="w-4 h-4" />
                Contacts
              </button>
              <button
                onClick={() => navigate("/companies")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Building" className="w-4 h-4" />
                Companies
              </button>
              <button
                onClick={() => navigate("/deals")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                Deals
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="CheckSquare" className="w-4 h-4" />
                Tasks
              </button>
              <button
                onClick={() => navigate("/activities")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Activity" className="w-4 h-4" />
                Activities
              </button>
              <button
                onClick={() => navigate("/quotes")}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <ApperIcon name="Receipt" className="w-4 h-4" />
                Quotes
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
                <ApperIcon name="FileText" className="w-4 h-4" />
                Invoices
              </button>
            </div>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Invoice List */}
        <div
          className="flex-1 lg:flex-none lg:w-96 flex flex-col bg-white border-r border-slate-200">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900">All Invoices</h2>
            </div>
            <Button
              onClick={() => setShowInvoiceModal(true)}
              size="sm"
              className="flex items-center gap-2">
              <ApperIcon name="Plus" className="w-4 h-4" />Add Invoice
            </Button>
          </div>
          {/* Invoice List Content */}
          <InvoiceList
            refreshKey={refreshKey}
            onSelectInvoice={handleSelectInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            selectedInvoice={selectedInvoice} />
        </div>
        {/* Invoice Detail */}
        <motion.div
          className={`flex-1 ${selectedInvoice ? "fixed inset-0 lg:relative lg:inset-auto bg-white z-50" : "hidden lg:flex"} flex-col`}
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.2
          }}>
          {selectedInvoice ? <InvoiceDetail
            invoice={selectedInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onClose={handleCloseMobileDetail} /> : <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select an invoice to view details</p>
            </div>
          </div>}
        </motion.div>
      </div>
      {/* Modals */}
      {showInvoiceModal && <InvoiceModal invoice={editingInvoice} onSave={handleSaveInvoice} onClose={handleCloseModal} />}
      {showDeleteModal && invoiceToDelete && <DeleteInvoiceModal
        invoice={invoiceToDelete}
        onConfirm={handleInvoiceDeleted}
        onCancel={handleCloseDeleteModal} />}
    </div>
  );
}

export default InvoicesPage;