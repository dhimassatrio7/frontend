import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Fetch Services
export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      
      const response = await axiosInstance.get(`/services?populate=*`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Fetch Service by Document ID
export const fetchServiceByDocumentId = createAsyncThunk(
  "service/fetchServiceByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.get(
        `/services?populate=*&filters[documentId][$eq]=${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching service by document ID:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Create Service
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.post("/services", serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating service:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Update Service
export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ documentId, serviceData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.put(
        `/services/${documentId}`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating service:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Delete Service
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (documentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");
      const response = await axiosInstance.delete(`/services/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return { id: documentId }; // Explicitly returning the id of deleted service
    } catch (error) {
      console.error("Error deleting service:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// Initial state
const initialState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload || [];
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch service by document ID
      .addCase(fetchServiceByDocumentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceByDocumentId.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServiceByDocumentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.services.push(action.payload);
        }
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const updatedService = action.payload;
        if (updatedService) {
          const index = state.services.findIndex(
            (service) => service.id === updatedService.id
          );
          if (index !== -1) {
            state.services[index] = updatedService;
          }
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service.id !== action.payload.id
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
