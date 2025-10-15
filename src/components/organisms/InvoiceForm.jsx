import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { invoiceService } from '@/services/api/invoiceService';
import { contactService } from '@/services/api/contactService';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';

function InvoiceForm({ invoice, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    amountDue: '',
    status: 'Draft',
    contact: '',
    tags: ''
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber || '',
        invoiceDate: invoice.invoiceDate || '',
        dueDate: invoice.dueDate || '',
        amountDue: invoice.amountDue?.toString() || '',
        status: invoice.status || 'Draft',
        contact: invoice.contact?.Id?.toString() || '',
        tags: Array.isArray(invoice.tags) ? invoice.tags.join(', ') : invoice.tags || ''
      });
    }
  }, [invoice]);

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.invoiceDate && formData.dueDate) {
      if (new Date(formData.dueDate) <= new Date(formData.invoiceDate)) {
        newErrors.dueDate = 'Due date must be after invoice date';
      }
    }

    if (!formData.amountDue || isNaN(parseFloat(formData.amountDue)) || parseFloat(formData.amountDue) <= 0) {
      newErrors.amountDue = 'Amount must be a positive number';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.contact) {
      newErrors.contact = 'Contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        amountDue: parseFloat(formData.amountDue),
        contact: formData.contact ? parseInt(formData.contact) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (invoice) {
        await invoiceService.update(invoice.Id, invoiceData);
        toast.success('Invoice updated successfully');
      } else {
        await invoiceService.create(invoiceData);
        toast.success('Invoice created successfully');
      }

      onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Invoice Number *" error={errors.invoiceNumber}>
        <Input
          value={formData.invoiceNumber}
          onChange={(e) => handleChange('invoiceNumber', e.target.value)}
          placeholder="Enter invoice number"
          disabled={loading}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Invoice Date *" error={errors.invoiceDate}>
          <Input
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => handleChange('invoiceDate', e.target.value)}
            disabled={loading}
          />
        </FormField>

        <FormField label="Due Date *" error={errors.dueDate}>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            disabled={loading}
          />
        </FormField>
      </div>

      <FormField label="Amount Due *" error={errors.amountDue}>
        <Input
          type="number"
          step="0.01"
          value={formData.amountDue}
          onChange={(e) => handleChange('amountDue', e.target.value)}
          placeholder="Enter amount due"
          disabled={loading}
        />
      </FormField>

      <FormField label="Status *" error={errors.status}>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Void">Void</option>
        </select>
      </FormField>

      <FormField label="Contact *" error={errors.contact}>
        <select
          value={formData.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          disabled={loading || loadingContacts}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.firstName} {contact.lastName}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Tags" error={errors.tags}>
        <Input
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="Enter tags separated by commas"
          disabled={loading}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading && <Loading size="sm" />}
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;