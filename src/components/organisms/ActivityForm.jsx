import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { activityService } from '@/services/api/activityService';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';

function ActivityForm({ activity, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    activityType: 'Call',
    status: 'Planned',
    dueDate: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activity) {
      setFormData({
        subject: activity.subject || '',
        description: activity.description || '',
        activityType: activity.activityType || 'Call',
        status: activity.status || 'Planned',
        dueDate: activity.dueDate || '',
        tags: activity.tags || ''
      });
    }
  }, [activity]);

  function validateForm() {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const activityData = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        activityType: formData.activityType,
        status: formData.status,
        dueDate: formData.dueDate || null,
        tags: formData.tags.trim()
      };

      let result;
      if (activity) {
        result = await activityService.update(activity.id, activityData);
      } else {
        result = await activityService.create(activityData);
      }

      if (result) {
        onSave();
      }
    } catch (error) {
      toast.error('Failed to save activity');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField label="Subject" error={errors.subject} required>
          <Input
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Enter activity subject"
            disabled={loading}
            className="w-full"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter activity description"
            disabled={loading}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Activity Type" error={errors.activityType}>
            <select
              value={formData.activityType}
              onChange={(e) => handleChange('activityType', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
            </select>
          </FormField>

          <FormField label="Status" error={errors.status}>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>
        </div>

        <FormField label="Due Date" error={errors.dueDate}>
          <Input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </FormField>

        <FormField label="Tags" error={errors.tags}>
          <Input
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="Enter tags (comma-separated)"
            disabled={loading}
            className="w-full"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
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
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            activity ? 'Update Activity' : 'Create Activity'
          )}
        </Button>
      </div>
    </form>
  );
}

export default ActivityForm;