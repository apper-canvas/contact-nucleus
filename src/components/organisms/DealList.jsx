import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import DealCard from "@/components/molecules/DealCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import SearchBar from "@/components/molecules/SearchBar";
function DealList({ refreshKey, onSelectDeal, onEditDeal, onDeleteDeal, selectedDeal }) {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    loadDeals();
  }, [refreshKey]);

  useEffect(() => {
    filterDeals();
  }, [deals, searchQuery, filterValue]);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = deals;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.name?.toLowerCase().includes(query) ||
        deal.stage?.toLowerCase().includes(query) ||
        deal.company?.Name?.toLowerCase().includes(query)
      );
    }

    // Apply stage filter
    if (filterValue !== 'all') {
      filtered = filtered.filter(deal => {
        switch (filterValue) {
          case 'active':
            return !['Closed Won', 'Closed Lost'].includes(deal.stage);
          case 'won':
            return deal.stage === 'Closed Won';
          case 'lost':
            return deal.stage === 'Closed Lost';
          default:
            return true;
        }
      });
    }

    setFilteredDeals(filtered);
  };

  const handleDealClick = (deal) => {
    onSelectDeal(deal);
  };

  const handleEditClick = (e, deal) => {
    e.stopPropagation();
    onEditDeal(deal);
  };

  const handleDeleteClick = (e, deal) => {
    e.stopPropagation();
    onDeleteDeal(deal);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Prospecting':
        return 'bg-blue-100 text-blue-800';
      case 'Qualification':
        return 'bg-purple-100 text-purple-800';
      case 'Needs Analysis':
        return 'bg-yellow-100 text-yellow-800';
      case 'Value Proposition':
        return 'bg-orange-100 text-orange-800';
      case 'Decision Making':
        return 'bg-indigo-100 text-indigo-800';
      case 'Negotiation':
        return 'bg-pink-100 text-pink-800';
      case 'Closed Won':
        return 'bg-green-100 text-green-800';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <Error message={error} onRetry={loadDeals} />
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
              placeholder="Search deals..."
            />
          </div>
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { value: 'all', label: 'All Deals' },
              { value: 'active', label: 'Active' },
              { value: 'won', label: 'Won' },
              { value: 'lost', label: 'Lost' }
            ]}
          />
        </div>
      </div>

      {/* Deal Cards Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filteredDeals.length === 0 ? (
          <Empty
            icon="TrendingUp"
            title="No deals found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first deal"}
            actionLabel="Add Deal"
            onAction={() => onEditDeal(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DealCard
                  deal={deal}
                  isSelected={selectedDeal?.Id === deal.Id}
                  onSelect={handleDealClick}
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

export default DealList;