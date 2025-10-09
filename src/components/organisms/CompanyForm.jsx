import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { companyService } from '@/services/api/companyService';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';

function CompanyForm({ company, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        zipCode: company.zipCode || '',
        tags: Array.isArray(company.tags) ? company.tags.join(', ') : company.tags || ''
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
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
      const companyData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (company) {
        await companyService.update(company.Id, companyData);
        toast.success('Company updated successfully');
      } else {
        await companyService.create(companyData);
        toast.success('Company created successfully');
      }

      onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to save company');
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
      <FormField label="Company Name *" error={errors.name}>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter company name"
          disabled={loading}
        />
      </FormField>

      <FormField label="Address" error={errors.address}>
        <textarea
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter company address"
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="City" error={errors.city}>
          <Input
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Enter city"
            disabled={loading}
          />
        </FormField>

        <FormField label="State" error={errors.state}>
          <Input
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="Enter state"
            disabled={loading}
          />
        </FormField>
      </div>

      <FormField label="Zip Code" error={errors.zipCode}>
        <Input
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          placeholder="Enter zip code"
          disabled={loading}
        />
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
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
}

export default CompanyForm;