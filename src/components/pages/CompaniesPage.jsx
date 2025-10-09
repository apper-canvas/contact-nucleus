import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyList from '@/components/organisms/CompanyList';
import CompanyDetail from '@/components/organisms/CompanyDetail';
import CompanyModal from '@/components/organisms/CompanyModal';
import DeleteCompanyModal from '@/components/organisms/DeleteCompanyModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowCompanyModal(true);
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const handleSaveCompany = () => {
    setRefreshKey(prev => prev + 1);
    setShowCompanyModal(false);
    setEditingCompany(null);
  };

  const handleCompanyDeleted = (deletedCompany) => {
    setRefreshKey(prev => prev + 1);
    if (selectedCompany?.Id === deletedCompany.Id) {
      setSelectedCompany(null);
    }
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleCloseModal = () => {
    setShowCompanyModal(false);
    setEditingCompany(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleCloseMobileDetail = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Companies</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            <button onClick={() => window.location.href = '/contacts'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Users" className="w-4 h-4" />
              Contacts
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
              <ApperIcon name="Building" className="w-4 h-4" />
              Companies
            </button>
            <button onClick={() => window.location.href = '/deals'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              Deals
            </button>
            <button onClick={() => window.location.href = '/quotes'} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Receipt" className="w-4 h-4" />
              Quotes
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Company List */}
        <div className="flex-1 lg:flex-none lg:w-96 flex flex-col bg-white border-r border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900">All Companies</h2>
            </div>
            <Button
              onClick={() => setShowCompanyModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Company
            </Button>
          </div>

          {/* Company List Content */}
          <CompanyList
            refreshKey={refreshKey}
            onSelectCompany={handleSelectCompany}
            onEditCompany={handleEditCompany}
            onDeleteCompany={handleDeleteCompany}
            selectedCompany={selectedCompany}
          />
        </div>

        {/* Company Detail */}
        <motion.div
          className={`flex-1 ${
            selectedCompany
              ? 'fixed inset-0 lg:relative lg:inset-auto bg-white z-50'
              : 'hidden lg:flex'
          } flex-col`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {selectedCompany ? (
            <CompanyDetail
              company={selectedCompany}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
              onClose={handleCloseMobileDetail}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <ApperIcon name="Building" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a company to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {showCompanyModal && (
        <CompanyModal
          company={editingCompany}
          onSave={handleSaveCompany}
          onClose={handleCloseModal}
        />
      )}

      {showDeleteModal && companyToDelete && (
        <DeleteCompanyModal
          company={companyToDelete}
          onConfirm={handleCompanyDeleted}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}

export default CompaniesPage;