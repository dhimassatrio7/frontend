import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Fetch Customers
export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.get("/customers?populate=*", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data.data || [];
    } catch (error) {
      
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Fetch Customer by Document ID
export const fetchCustomerByDocumentId = createAsyncThunk(
  "customer/fetchCustomerByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.get(
        `/customers/${documentId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// FETCH CUSTOMER BY DOCUMENT ID USER
export const fetchCustomerByDocumentIdUser = createAsyncThunk(
  "customer/fetchCustomerByDocumentIdUser",
  async (documentId, { rejectWithValue }) => {
   
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.get(
        `/customers?populate=*&filters[user][documentId]=${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
    
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Create Customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.post("/customers", customerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
    
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ documentId, customerData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.put(
        `/customers/${documentId}`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);



// Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (documentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      await axiosInstance.delete(`/customers/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { documentId }; // Returning ID for easier filtering in reducer
    } catch (error) {
    
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Initial state
const initialState = {
  customers: [],
  customer: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload || [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Customer by Document ID
      .addCase(fetchCustomerByDocumentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByDocumentId.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerByDocumentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Customer by Document Id User
      .addCase(fetchCustomerByDocumentIdUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByDocumentIdUser.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerByDocumentIdUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.customers.push(action.payload);
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCustomer = action.payload;
        if (updatedCustomer) {
          const index = state.customers.findIndex(
            (customer) => customer.id === updatedCustomer.id
          );
          if (index !== -1) {
            state.customers[index] = updatedCustomer;
          }
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload.id
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
