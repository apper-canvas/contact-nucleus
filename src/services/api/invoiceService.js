const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'invoice_c';

// Field mapping utilities
const toDbFields = (uiData) => {
  const dbData = {};
  
  if (uiData.invoiceNumber !== undefined) dbData.invoice_number_c = uiData.invoiceNumber;
  if (uiData.invoiceDate !== undefined) dbData.invoice_date_c = uiData.invoiceDate;
  if (uiData.dueDate !== undefined) dbData.due_date_c = uiData.dueDate;
  if (uiData.amountDue !== undefined) dbData.amount_due_c = parseFloat(uiData.amountDue);
  if (uiData.status !== undefined) dbData.status_c = uiData.status;
  if (uiData.contact !== undefined) dbData.contact_c = parseInt(uiData.contact?.Id || uiData.contact);
  
  // Convert tags array to comma-separated string
  if (uiData.tags !== undefined) {
    dbData.Tags = Array.isArray(uiData.tags) ? uiData.tags.join(',') : uiData.tags;
  }
  
  return dbData;
};

const toUiFields = (dbData) => {
  const uiData = {
    Id: dbData.Id,
    invoiceNumber: dbData.invoice_number_c || '',
    invoiceDate: dbData.invoice_date_c || '',
    dueDate: dbData.due_date_c || '',
    amountDue: dbData.amount_due_c || 0,
    status: dbData.status_c || '',
    contact: dbData.contact_c || null,
    createdAt: dbData.CreatedOn || '',
    updatedAt: dbData.ModifiedOn || '',
    // Convert comma-separated string to array
    tags: dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : []
  };
  
  // Also include database field names for components that use them
  uiData.invoice_number_c = dbData.invoice_number_c || '';
  uiData.invoice_date_c = dbData.invoice_date_c || '';
  uiData.due_date_c = dbData.due_date_c || '';
  uiData.amount_due_c = dbData.amount_due_c || 0;
  uiData.status_c = dbData.status_c || '';
  uiData.contact_c = dbData.contact_c || null;
  uiData.Tags = dbData.Tags ? (typeof dbData.Tags === 'string' ? dbData.Tags.split(',').map(t => t.trim()) : dbData.Tags) : [];
  uiData.CreatedOn = dbData.CreatedOn || '';
  uiData.ModifiedOn = dbData.ModifiedOn || '';
  
  return uiData;
};

export const invoiceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'invoice_number_c' } },
          { field: { Name: 'invoice_date_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'amount_due_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'contact_c' } }
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
      console.error("Error fetching invoices:", error?.response?.data?.message || error);
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
          { field: { Name: 'invoice_number_c' } },
          { field: { Name: 'invoice_date_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'amount_due_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'contact_c' } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Invoice not found");
      }
      
      return toUiFields(response.data);
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(invoiceData) {
    try {
      const dbData = toDbFields(invoiceData);
      
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
          const errorMsg = failed[0].message || 'Failed to create invoice';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to create invoice');
    } catch (error) {
      console.error("Error creating invoice:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, invoiceData) {
    try {
      const dbData = toDbFields(invoiceData);
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
          const errorMsg = failed[0].message || 'Failed to update invoice';
          throw new Error(errorMsg);
        }
        
        return toUiFields(successful[0].data);
      }
      
      throw new Error('Failed to update invoice');
    } catch (error) {
      console.error("Error updating invoice:", error?.response?.data?.message || error);
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
          const errorMsg = failed[0].message || 'Failed to delete invoice';
          throw new Error(errorMsg);
        }
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error deleting invoice:", error?.response?.data?.message || error);
      throw error;
    }
  }
};