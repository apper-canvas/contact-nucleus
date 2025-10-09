const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'company_c';

// Field mapping utilities
const toDbFields = (uiData) => {
  const dbData = {};
  
  if (uiData.name !== undefined) dbData.name_c = uiData.name;
  if (uiData.address !== undefined) dbData.address_c = uiData.address;
  if (uiData.city !== undefined) dbData.city_c = uiData.city;
  if (uiData.state !== undefined) dbData.state_c = uiData.state;
  if (uiData.zipCode !== undefined) dbData.zip_code_c = uiData.zipCode;
  
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
    address: dbData.address_c || '',
    city: dbData.city_c || '',
    state: dbData.state_c || '',
    zipCode: dbData.zip_code_c || '',
    createdAt: dbData.CreatedOn || '',
    updatedAt: dbData.ModifiedOn || '',
    // Convert comma-separated string to array
    tags: dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : []
  };
  
  // Also include database field names for components that use them
  uiData.name_c = dbData.name_c || '';
  uiData.address_c = dbData.address_c || '';
  uiData.city_c = dbData.city_c || '';
  uiData.state_c = dbData.state_c || '';
  uiData.zip_code_c = dbData.zip_code_c || '';
  uiData.Tags = dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : [];
  uiData.CreatedOn = dbData.CreatedOn || '';
  uiData.ModifiedOn = dbData.ModifiedOn || '';
  
  return uiData;
};

export const companyService = {
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
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_c' } },
          { field: { Name: 'zip_code_c' } }
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
      console.error("Error fetching companies:", error?.response?.data?.message || error);
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
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_c' } },
          { field: { Name: 'zip_code_c' } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Company not found");
      }
      
      return toUiFields(response.data);
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const dbData = toDbFields(companyData);
      
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
          const errorMsg = failed[0].message || 'Failed to create company';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to create company');
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const dbData = toDbFields(companyData);
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
          const errorMsg = failed[0].message || 'Failed to update company';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to update company');
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
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
          const errorMsg = failed[0].message || 'Failed to delete company';
          throw new Error(errorMsg);
        }
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
  }
};