import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { quoteService } from '@/services/api/quoteService';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

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
      <div className="p-4 space-y-3 border-b border-slate-200">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search quotes..."
        />
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

      {/* Quote List */}
      <div className="flex-1 overflow-y-auto">
        {filteredQuotes.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No quotes found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first quote"}
            actionLabel="Add Quote"
            onAction={() => onEditQuote(null)}
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredQuotes.map((quote, index) => (
              <motion.div
                key={quote.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedQuote?.Id === quote.Id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                }`}
                onClick={() => handleQuoteClick(quote)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {quote.name || 'Unnamed Quote'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {quote.amount > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          ${quote.amount.toLocaleString()}
                        </span>
                      )}
                      {quote.expirationDate && (
                        <Badge 
                          className={isExpired(quote.expirationDate) ? 
                            'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          } 
                          size="sm"
                        >
                          {isExpired(quote.expirationDate) ? 'Expired' : 'Active'}
                        </Badge>
                      )}
                    </div>

                    {quote.company?.Name && (
                      <p className="text-xs text-slate-600 mb-2">
                        {quote.company.Name}
                      </p>
                    )}

                    <div className="space-y-1">
                      {quote.issueDate && (
                        <p className="text-xs text-slate-500">
                          Issued: {new Date(quote.issueDate).toLocaleDateString()}
                        </p>
                      )}
                      {quote.expirationDate && (
                        <p className="text-xs text-slate-500">
                          Expires: {new Date(quote.expirationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => handleEditClick(e, quote)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="Edit quote"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, quote)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete quote"
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

export default QuoteList;