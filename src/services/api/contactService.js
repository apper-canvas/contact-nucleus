const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'contact_c';

// Field mapping utilities
const toDbFields = (uiData) => {
  const dbData = {};
  
  if (uiData.firstName !== undefined) dbData.first_name_c = uiData.firstName;
  if (uiData.lastName !== undefined) dbData.last_name_c = uiData.lastName;
  if (uiData.email !== undefined) dbData.email_c = uiData.email;
  if (uiData.phone !== undefined) dbData.phone_c = uiData.phone;
  if (uiData.company !== undefined) dbData.company_c = uiData.company;
  if (uiData.position !== undefined) dbData.position_c = uiData.position;
  if (uiData.photo !== undefined) dbData.photo_c = uiData.photo;
  if (uiData.notes !== undefined) dbData.notes_c = uiData.notes;
  
  // Convert tags array to comma-separated string
  if (uiData.tags !== undefined) {
    dbData.tags_c = Array.isArray(uiData.tags) ? uiData.tags.join(',') : uiData.tags;
  }
  
  return dbData;
};

const toUiFields = (dbData) => {
  const uiData = {
    Id: dbData.Id,
    firstName: dbData.first_name_c || '',
    lastName: dbData.last_name_c || '',
    email: dbData.email_c || '',
    phone: dbData.phone_c || '',
    company: dbData.company_c || '',
    position: dbData.position_c || '',
    photo: dbData.photo_c || '',
    notes: dbData.notes_c || '',
    createdAt: dbData.created_at_c || '',
    updatedAt: dbData.updated_at_c || '',
    // Convert comma-separated string to array
    tags: dbData.tags_c ? (typeof dbData.tags_c === 'string' ? dbData.tags_c.split(',').map(t => t.trim()) : dbData.tags_c) : []
  };
  
  // Also include database field names for components that use them
  uiData.first_name_c = dbData.first_name_c || '';
  uiData.last_name_c = dbData.last_name_c || '';
  uiData.email_c = dbData.email_c || '';
  uiData.phone_c = dbData.phone_c || '';
  uiData.company_c = dbData.company_c || '';
  uiData.position_c = dbData.position_c || '';
  uiData.photo_c = dbData.photo_c || '';
  uiData.notes_c = dbData.notes_c || '';
  uiData.tags_c = dbData.tags_c ? (typeof dbData.tags_c === 'string' ? dbData.tags_c.split(',').map(t => t.trim()) : dbData.tags_c) : [];
  uiData.created_at_c = dbData.created_at_c || '';
  uiData.updated_at_c = dbData.updated_at_c || '';
  
  return uiData;
};

export const contactService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'first_name_c' } },
          { field: { Name: 'last_name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'company_c' } },
          { field: { Name: 'position_c' } },
          { field: { Name: 'photo_c' } },
          { field: { Name: 'tags_c' } },
          { field: { Name: 'notes_c' } },
          { field: { Name: 'created_at_c' } },
          { field: { Name: 'updated_at_c' } }
        ],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(toUiFields);
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'first_name_c' } },
          { field: { Name: 'last_name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'company_c' } },
          { field: { Name: 'position_c' } },
          { field: { Name: 'photo_c' } },
          { field: { Name: 'tags_c' } },
          { field: { Name: 'notes_c' } },
          { field: { Name: 'created_at_c' } },
          { field: { Name: 'updated_at_c' } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Contact not found");
      }
      
      return toUiFields(response.data);
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const dbData = toDbFields(contactData);
      
      // Remove empty fields
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === '' || dbData[key] === null || dbData[key] === undefined) {
          delete dbData[key];
        }
      });
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          const errorMsg = failed[0].message || 'Failed to create contact';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to create contact');
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const dbData = toDbFields(contactData);
      dbData.Id = parseInt(id);
      
      // Remove empty fields
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === '' || dbData[key] === null || dbData[key] === undefined) {
          delete dbData[key];
        }
      });
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          const errorMsg = failed[0].message || 'Failed to update contact';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to update contact');
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          const errorMsg = failed[0].message || 'Failed to delete contact';
          throw new Error(errorMsg);
        }
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
throw error;
    }
  }
};