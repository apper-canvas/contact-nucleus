import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { companyService } from '@/services/api/companyService';
import CompanyCard from '@/components/molecules/CompanyCard';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

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
              >
                <CompanyCard
                  company={company}
                  isSelected={selectedCompany?.Id === company.Id}
                  onSelect={handleCompanyClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyList;