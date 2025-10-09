const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'quotes_c';

// Field mapping utilities
const toDbFields = (uiData) => {
  const dbData = {};
  
  if (uiData.name !== undefined) dbData.name_c = uiData.name;
  if (uiData.description !== undefined) dbData.description_c = uiData.description;
  if (uiData.amount !== undefined) dbData.amount_c = parseFloat(uiData.amount);
  if (uiData.issueDate !== undefined) dbData.issue_date_c = uiData.issueDate;
  if (uiData.expirationDate !== undefined) dbData.expiration_date_c = uiData.expirationDate;
  if (uiData.company !== undefined) dbData.company_c = parseInt(uiData.company?.Id || uiData.company);
  
  // Convert tags array to comma-separated string
  if (uiData.tags !== undefined) {
    dbData.Tags = Array.isArray(uiData.tags) ? uiData.tags.join(',') : uiData.tags;
  }
  
  return dbData;
};

const toUiFields = (dbData) => {
  const uiData = {
    Id: dbData.Id,
    name: dbData.name_c || '',
    description: dbData.description_c || '',
    amount: dbData.amount_c || 0,
    issueDate: dbData.issue_date_c || '',
    expirationDate: dbData.expiration_date_c || '',
    company: dbData.company_c || null,
    createdAt: dbData.CreatedOn || '',
    updatedAt: dbData.ModifiedOn || '',
    // Convert comma-separated string to array
    tags: dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : []
  };
  
  // Also include database field names for components that use them
  uiData.name_c = dbData.name_c || '';
  uiData.description_c = dbData.description_c || '';
  uiData.amount_c = dbData.amount_c || 0;
  uiData.issue_date_c = dbData.issue_date_c || '';
  uiData.expiration_date_c = dbData.expiration_date_c || '';
  uiData.company_c = dbData.company_c || null;
  uiData.Tags = dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : [];
  uiData.CreatedOn = dbData.CreatedOn || '';
  uiData.ModifiedOn = dbData.ModifiedOn || '';
  
  return uiData;
};

export const quoteService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'amount_c' } },
          { field: { Name: 'issue_date_c' } },
          { field: { Name: 'expiration_date_c' } },
          { field: { Name: 'company_c' } }
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
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'amount_c' } },
          { field: { Name: 'issue_date_c' } },
          { field: { Name: 'expiration_date_c' } },
          { field: { Name: 'company_c' } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Quote not found");
      }
      
      return toUiFields(response.data);
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(quoteData) {
    try {
      const dbData = toDbFields(quoteData);
      
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
          const errorMsg = failed[0].message || 'Failed to create quote';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to create quote');
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, quoteData) {
    try {
      const dbData = toDbFields(quoteData);
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
          const errorMsg = failed[0].message || 'Failed to update quote';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to update quote');
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
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
          const errorMsg = failed[0].message || 'Failed to delete quote';
          throw new Error(errorMsg);
        }
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      throw error;
    }
  }
};