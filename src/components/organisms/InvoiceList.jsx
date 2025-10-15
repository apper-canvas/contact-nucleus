import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { invoiceService } from '@/services/api/invoiceService';
import InvoiceCard from '@/components/molecules/InvoiceCard';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

function InvoiceList({ refreshKey, onSelectInvoice, onEditInvoice, onDeleteInvoice, selectedInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, [refreshKey]);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, filterValue]);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = invoices;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber?.toLowerCase().includes(query) ||
        invoice.contact?.Name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterValue !== 'all') {
      filtered = filtered.filter(invoice => {
        if (!invoice.status) return filterValue === 'draft';
        return invoice.status.toLowerCase() === filterValue.toLowerCase();
      });
    }

    setFilteredInvoices(filtered);
  };

  const handleInvoiceClick = (invoice) => {
    onSelectInvoice(invoice);
  };

  const handleEditClick = (e, invoice) => {
    e.stopPropagation();
    onEditInvoice(invoice);
  };

  const handleDeleteClick = (e, invoice) => {
    e.stopPropagation();
    onDeleteInvoice(invoice);
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
        <Error message={error} onRetry={loadInvoices} />
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
              placeholder="Search invoices..."
            />
          </div>
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { value: 'all', label: 'All Invoices' },
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'void', label: 'Void' }
            ]}
          />
        </div>
      </div>

      {/* Invoice Cards Grid */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filteredInvoices.length === 0 ? (
          <Empty
            icon="FileText"
            title="No invoices found"
            description={searchQuery ? "Try adjusting your search terms" : "Start by adding your first invoice"}
            actionLabel="Add Invoice"
            onAction={() => onEditInvoice(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <InvoiceCard
                  invoice={invoice}
                  isSelected={selectedInvoice?.Id === invoice.Id}
                  onSelect={handleInvoiceClick}
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

export default InvoiceList;