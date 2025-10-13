import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { contactService } from '@/services/api/contactService';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';

function TaskForm({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Open',
    priority: 'Medium',
    assignedTo: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoadingContacts(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  }

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status || 'Open',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo?.Id || task.assignedTo || ''
      });
    }
  }, [task]);

  function validateForm() {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const taskData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null
      };

      let result;
      if (task) {
        result = await taskService.update(task.id, taskData);
      } else {
        result = await taskService.create(taskData);
      }

      if (result) {
        onSave();
      }
    } catch (error) {
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
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
  }

  if (loadingContacts) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField label="Name" error={errors.name} required>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter task name"
            disabled={loading}
            className="w-full"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
            disabled={loading}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Status" error={errors.status}>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>

          <FormField label="Priority" error={errors.priority}>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </FormField>
        </div>

        <FormField label="Due Date" error={errors.dueDate}>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </FormField>

        <FormField label="Assigned To" error={errors.assignedTo}>
          <select
            value={formData.assignedTo}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.firstName} {contact.lastName}
              </option>
            ))}
          </select>
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
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;