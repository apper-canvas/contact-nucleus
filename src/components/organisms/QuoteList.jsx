import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { quoteService } from '@/services/api/quoteService';
import QuoteCard from '@/components/molecules/QuoteCard';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
function QuoteList({ refreshKey, onSelectQuote, onEditQuote, onDeleteQuote, selectedQuote }) {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    loadQuotes();
  }, [refreshKey]);

  useEffect(() => {
    filterQuotes();
  }, [quotes, searchQuery, filterValue]);

  const loadQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = quotes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quote =>
        quote.name?.toLowerCase().includes(query) ||
        quote.company?.Name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterValue !== 'all') {
      const now = new Date();
      filtered = filtered.filter(quote => {
        switch (filterValue) {
          case 'active':
            return !quote.expirationDate || new Date(quote.expirationDate) > now;
          case 'expired':
            return quote.expirationDate && new Date(quote.expirationDate) <= now;
          case 'recent':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(quote.createdAt) > oneWeekAgo;
          default:
            return true;
        }
      });
    }

    setFilteredQuotes(filtered);
  };

  const handleQuoteClick = (quote) => {
    onSelectQuote(quote);
  };

  const handleEditClick = (e, quote) => {
    e.stopPropagation();
    onEditQuote(quote);
  };

  const handleDeleteClick = (e, quote) => {
    e.stopPropagation();
    onDeleteQuote(quote);
  };

  const isExpired = (expirationDate) => {
    return expirationDate && new Date(expirationDate) <= new Date();
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
        <Error message={error} onRetry={loadQuotes} />
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
              placeholder="Search quotes..."
            />
          </div>
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { value: 'all', label: 'All Quotes' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'recent', label: 'Recent' }
            ]}
          />
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filteredQuotes.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No quotes found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first quote"}
            actionLabel="Add Quote"
            onAction={() => onEditQuote(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredQuotes.map((quote, index) => (
              <motion.div
                key={quote.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <QuoteCard
                  quote={quote}
                  isSelected={selectedQuote?.Id === quote.Id}
                  onSelect={handleQuoteClick}
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

export default QuoteList;