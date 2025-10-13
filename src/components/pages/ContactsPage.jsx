import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ContactList from "@/components/organisms/ContactList";
import DeleteContactModal from "@/components/organisms/DeleteContactModal";
import ContactModal from "@/components/organisms/ContactModal";
import ContactDetail from "@/components/organisms/ContactDetail";

const ContactsPage = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowMobileDetail(true);
  };

  const handleEditContact = (contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleSaveContact = () => {
    setRefreshTrigger(prev => prev + 1);
  };

const handleContactDeleted = (deletedContact) => {
    if (selectedContact?.Id === deletedContact.Id) {
      setSelectedContact(null);
      setShowMobileDetail(false);
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setContactToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setShowMobileDetail(false);
    setSelectedContact(null);
  };

return (
<div className="flex min-h-screen bg-green-50">
      {/* Main Content */}
      <div className="h-full flex">
        {/* Left Sidebar Navigation */}
        <div className="w-80 border-r border-green-200 bg-white shadow-sm">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
HubCRM
                  </h1>
                  <p className="text-sm text-slate-600">Customer Relationship Management</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
<nav className="flex-1 p-4 space-y-2">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
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

        {/* Right Content Area - Contact Cards */}
        <div className="flex-1 bg-white">
          <ContactList
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            refreshTrigger={refreshTrigger}
          />
        </div>
</div>

      {/* Contact Detail Overlay */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <ContactDetail
              contact={selectedContact}
              onClose={() => {
                setSelectedContact(null);
                setShowMobileDetail(false);
              }}
              onEdit={() => {
                handleEditContact(selectedContact);
                setSelectedContact(null);
              }}
              onDelete={() => {
                handleDeleteContact(selectedContact);
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseModal}
        contact={contactToEdit}
        onSave={handleSaveContact}
        isEdit={!!contactToEdit}
      />

      <DeleteContactModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        contact={contactToDelete}
        onDelete={handleContactDeleted}
      />
    </div>
  );
};

export default ContactsPage;