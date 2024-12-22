import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Thunks for asynchronous operations
export const fetchServiceProviders = createAsyncThunk(
  "serviceProvider/fetchServiceProviders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/service-providers?populate=*",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchServiceProviderByDocumentId = createAsyncThunk(
  "serviceProvider/fetchByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/service-providers?populate=*&filters[user][documentId][$eq]=${documentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
     
      return response.data.data; // Return data directly
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createServiceProvider = createAsyncThunk(
  "serviceProvider/createServiceProvider",
  async (serviceProviderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/service-providers",
        serviceProviderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateServiceProvider = createAsyncThunk(
  "serviceProvider/updateServiceProvider",
  async ({ documentId, serviceProviderData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/service-providers/${documentId}`,
        serviceProviderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteServiceProvider = createAsyncThunk(
  "serviceProvider/deleteServiceProvider",
  async (documentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/service-providers/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return documentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const serviceProviderSlice = createSlice({
  name: "serviceProvider",
  initialState: {
    serviceProviders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Service Providers
      .addCase(fetchServiceProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceProviders = action.payload;
      })
      .addCase(fetchServiceProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch service providers.";
      })

      // Fetch Service Provider by Document ID
      .addCase(fetchServiceProviderByDocumentId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceProviderByDocumentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceProviders = action.payload; // Directly store the `data` array
      })
      .addCase(fetchServiceProviderByDocumentId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Service Provider
      .addCase(createServiceProvider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceProviders.push(action.payload);
      })

      // Update Service Provider
      .addCase(updateServiceProvider.fulfilled, (state, action) => {
        const index = state.serviceProviders.findIndex(
          (provider) => provider.id === action.payload.id
        );
        if (index !== -1) {
          state.serviceProviders[index] = action.payload;
        }
      })

      // Delete Service Provider
      .addCase(deleteServiceProvider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceProviders = state.serviceProviders.filter(
          (provider) => provider.id !== action.payload
        );
      });
  },
});

export const { resetState } = serviceProviderSlice.actions;

export default serviceProviderSlice.reducer;
