import { toast } from 'react-toastify';

// Field mapping functions
function toDbFields(uiData) {
  const dbData = {};
  
  if (uiData.subject !== undefined) dbData.subject_c = uiData.subject;
  if (uiData.activityType !== undefined) dbData.activity_type_c = uiData.activityType;
  if (uiData.status !== undefined) dbData.status_c = uiData.status;
  if (uiData.dueDate !== undefined) dbData.due_date_c = uiData.dueDate;
  if (uiData.description !== undefined) dbData.description_c = uiData.description;
  if (uiData.tags !== undefined) dbData.Tags = uiData.tags;
  
  return dbData;
}

function toUiFields(dbData) {
  return {
    id: dbData.Id,
    subject: dbData.subject_c || '',
    activityType: dbData.activity_type_c || 'Call',
    status: dbData.status_c || 'Planned',
    dueDate: dbData.due_date_c || '',
    description: dbData.description_c || '',
    tags: dbData.Tags || '',
    name: dbData.Name || '',
    owner: dbData.Owner || null,
    createdOn: dbData.CreatedOn || '',
    createdBy: dbData.CreatedBy || null,
    modifiedOn: dbData.ModifiedOn || '',
    modifiedBy: dbData.ModifiedBy || null
  };
}

export const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'subject_c' } },
          { field: { Name: 'activity_type_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'ModifiedBy' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data ? response.data.map(toUiFields) : [];
    } catch (error) {
      console.error('Error fetching activities:', error?.response?.data?.message || error);
      toast.error('Failed to load activities');
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
          { field: { Name: 'Name' } },
          { field: { Name: 'subject_c' } },
          { field: { Name: 'activity_type_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'ModifiedBy' } }
        ]
      };

      const response = await apperClient.getRecordById('activity_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data ? toUiFields(response.data) : null;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load activity');
      return null;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = toDbFields(activityData);
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('activity_c', params);
      
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
          toast.success('Activity created successfully');
          return toUiFields(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating activity:', error?.response?.data?.message || error);
      toast.error('Failed to create activity');
      return null;
    }
  },

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = toDbFields(activityData);
      dbData.Id = id;
      
      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('activity_c', params);
      
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
          toast.success('Activity updated successfully');
          return toUiFields(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating activity:', error?.response?.data?.message || error);
      toast.error('Failed to update activity');
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

      const response = await apperClient.deleteRecord('activity_c', params);
      
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
          toast.success('Activity deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting activity:', error?.response?.data?.message || error);
      toast.error('Failed to delete activity');
      return false;
    }
  }
};