import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { companyService } from '@/services/api/companyService';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
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
      <div className="p-4 space-y-3 border-b border-slate-200">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search companies..."
        />
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { value: 'all', label: 'All Companies' },
            { value: 'recent', label: 'Recent' }
          ]}
        />
      </div>

      {/* Company List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCompanies.length === 0 ? (
          <Empty
            icon="Building"
            title="No companies found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first company"}
            actionLabel="Add Company"
            onAction={() => onEditCompany(null)}
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedCompany?.Id === company.Id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                }`}
                onClick={() => handleCompanyClick(company)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {company.name || 'Unnamed Company'}
                      </h3>
                    </div>
                    
                    {company.city && company.state && (
                      <p className="text-xs text-slate-600 mb-2">
                        {company.city}, {company.state}
                      </p>
                    )}

                    {company.tags && company.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {company.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {company.tags.length > 2 && (
                          <Badge variant="secondary" size="sm">
                            +{company.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => handleEditClick(e, company)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="Edit company"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, company)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete company"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
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