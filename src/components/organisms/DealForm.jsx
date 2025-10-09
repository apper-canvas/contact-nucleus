import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dealService } from '@/services/api/dealService';
import { companyService } from '@/services/api/companyService';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';

const stageOptions = [
  'Prospecting',
  'Qualification',
  'Needs Analysis',
  'Value Proposition',
  'Decision Making',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

function DealForm({ deal, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    closeDate: '',
    stage: 'Prospecting',
    company: '',
    tags: ''
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || '',
        description: deal.description || '',
        amount: deal.amount?.toString() || '',
        closeDate: deal.closeDate || '',
        stage: deal.stage || 'Prospecting',
        company: deal.company?.Id?.toString() || '',
        tags: Array.isArray(deal.tags) ? deal.tags.join(', ') : deal.tags || ''
      });
    }
  }, [deal]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }

    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
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
      const dealData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        company: formData.company ? parseInt(formData.company) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (deal) {
        await dealService.update(deal.Id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await dealService.create(dealData);
        toast.success('Deal created successfully');
      }

      onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to save deal');
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
      <FormField label="Deal Name *" error={errors.name}>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter deal name"
          disabled={loading}
        />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter deal description"
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Amount" error={errors.amount}>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="Enter deal amount"
            disabled={loading}
          />
        </FormField>

        <FormField label="Close Date" error={errors.closeDate}>
          <Input
            type="date"
            value={formData.closeDate}
            onChange={(e) => handleChange('closeDate', e.target.value)}
            disabled={loading}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Stage" error={errors.stage}>
          <select
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          >
            {stageOptions.map(stage => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Company" error={errors.company}>
          <select
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            disabled={loading || loadingCompanies}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.Id} value={company.Id}>
                {company.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

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
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
}

export default DealForm;