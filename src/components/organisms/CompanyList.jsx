import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { companyService } from '@/services/api/companyService';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

function CompanyList({ refreshKey, onSelectCompany, onEditCompany, onDeleteCompany, selectedCompany }) {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    loadCompanies();
  }, [refreshKey]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, filterValue]);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(query) ||
        company.city?.toLowerCase().includes(query) ||
        company.state?.toLowerCase().includes(query)
      );
    }

    // Apply additional filters if needed
    if (filterValue !== 'all') {
      filtered = filtered.filter(company => {
        switch (filterValue) {
          case 'recent':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(company.createdAt) > oneWeekAgo;
          default:
            return true;
        }
      });
    }

    setFilteredCompanies(filtered);
  };

  const handleCompanyClick = (company) => {
    onSelectCompany(company);
  };

  const handleEditClick = (e, company) => {
    e.stopPropagation();
    onEditCompany(company);
  };

  const handleDeleteClick = (e, company) => {
    e.stopPropagation();
    onDeleteCompany(company);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Error message={error} onRetry={loadCompanies} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filter */}
<div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search companies..."
            />
          </div>
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { value: 'all', label: 'All Companies' },
              { value: 'recent', label: 'Recent' }
            ]}
          />
        </div>
      </div>

{/* Company Cards Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filteredCompanies.length === 0 ? (
          <Empty
            icon="Building"
            title="No companies found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first company"}
            actionLabel="Add Company"
            onAction={() => onEditCompany(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  selectedCompany?.Id === company.Id 
                    ? 'border-primary-500 shadow-lg ring-2 ring-primary-200' 
                    : 'border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
                onClick={() => handleCompanyClick(company)}
              >
                {/* Card Header */}
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6">
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      onClick={(e) => handleEditClick(e, company)}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
                      title="Edit company"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, company)}
                      className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-lg transition-colors"
                      title="Delete company"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl">
                    <ApperIcon name="Building" className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
                    {company.name || 'Unnamed Company'}
                  </h3>
                  
                  {company.city && company.state && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span className="truncate">{company.city}, {company.state}</span>
                    </div>
                  )}

                  {company.tags && company.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {company.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {company.tags.length > 3 && (
                        <Badge variant="secondary" size="sm">
                          +{company.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyList;