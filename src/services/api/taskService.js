import { toast } from 'react-toastify';

// Field mapping functions
function toDbFields(uiData) {
  const dbData = {};
  
  if (uiData.name !== undefined) dbData.name_c = uiData.name;
  if (uiData.description !== undefined) dbData.description_c = uiData.description;
  if (uiData.dueDate !== undefined) dbData.due_date_c = uiData.dueDate;
  if (uiData.status !== undefined) dbData.status_c = uiData.status;
  if (uiData.priority !== undefined) dbData.priority_c = uiData.priority;
  if (uiData.assignedTo !== undefined) dbData.assigned_to_c = parseInt(uiData.assignedTo?.Id || uiData.assignedTo);
  
  return dbData;
}

function toUiFields(dbData) {
  return {
    id: dbData.Id,
    name: dbData.name_c || '',
    description: dbData.description_c || '',
    dueDate: dbData.due_date_c || '',
    status: dbData.status_c || 'Open',
    priority: dbData.priority_c || 'Medium',
    assignedTo: dbData.assigned_to_c || null,
    createdAt: dbData.CreatedOn || '',
    modifiedAt: dbData.ModifiedOn || '',
    owner: dbData.Owner || null,
    createdBy: dbData.CreatedBy || null,
    modifiedBy: dbData.ModifiedBy || null
  };
}

// Convert UI format back to database format for queries
function toDbFormat(uiData) {
  uiData.name_c = dbData.name_c || '';
  uiData.description_c = dbData.description_c || '';
  uiData.due_date_c = dbData.due_date_c || '';
  uiData.status_c = dbData.status_c || 'Open';
  uiData.priority_c = dbData.priority_c || 'Medium';
  uiData.assigned_to_c = dbData.assigned_to_c || null;
  uiData.Id = dbData.Id;
  uiData.CreatedOn = dbData.CreatedOn || '';
  uiData.ModifiedOn = dbData.ModifiedOn || '';
  uiData.Owner = dbData.Owner || null;
  uiData.CreatedBy = dbData.CreatedBy || null;
  uiData.ModifiedBy = dbData.ModifiedBy || null;
  
  return uiData;
}

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'assigned_to_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedBy' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data ? response.data.map(toUiFields) : [];
    } catch (error) {
      console.error('Error fetching tasks:', error?.response?.data?.message || error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'assigned_to_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedBy' } }
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data ? toUiFields(response.data) : null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load task');
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = toDbFields(taskData);
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Task created successfully');
          return toUiFields(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating task:', error?.response?.data?.message || error);
      toast.error('Failed to create task');
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = toDbFields(taskData);
      dbData.Id = id;
      
      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Task updated successfully');
          return toUiFields(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating task:', error?.response?.data?.message || error);
      toast.error('Failed to update task');
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Task deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error?.response?.data?.message || error);
      toast.error('Failed to delete task');
      return false;
    }
  }
};