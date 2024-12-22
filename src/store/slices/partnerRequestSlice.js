import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

export const fetchPartnerRequests = createAsyncThunk(
  "partnerRequest/fetchPartnerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/partners?populate=*");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPartnerRequestByDocumentId = createAsyncThunk(
  "partnerRequest/fetchPartnerRequestByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/partners/${documentId}?populate=*`,
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

export const createPartnerRequest = createAsyncThunk(
  "partnerRequest/createPartnerRequest",
  async (partnerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/partners", partnerData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updatePartnerRequest = createAsyncThunk(
  "partnerRequest/updatePartnerRequest",
  async ({ documentId, partnerData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/partners/${documentId}`,
        partnerData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePartnerRequest = createAsyncThunk(
  "partnerRequest/deletePartnerRequest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/partners/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const partnerRequestSlice = createSlice({
  name: "partnerRequest",
  initialState: {
    partnerRequests: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partnerRequests = action.payload;
      })
      .addCase(fetchPartnerRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch partner requests.";
      })
      .addCase(fetchPartnerRequestByDocumentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partnerRequests = action.payload;
      })
      .addCase(fetchPartnerRequestByDocumentId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch partner request.";
      })
      .addCase(createPartnerRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partnerRequests = [...state.partnerRequests, action.payload];
      })
      .addCase(createPartnerRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create partner request.";
      })
      .addCase(updatePartnerRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partnerRequests = state.partnerRequests.map((partnerRequest) => {
          if (partnerRequest.id === action.payload.id) {
            return action.payload;
          }
          return partnerRequest;
        });
      })
      .addCase(updatePartnerRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update partner request.";
      })
      .addCase(deletePartnerRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partnerRequests = state.partnerRequests.filter(
          (partnerRequest) => partnerRequest.id !== action.payload.id
        );
      })
      .addCase(deletePartnerRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete partner request.";
      });
  },
});
export default partnerRequestSlice.reducer;

export const selectPartnerRequests = (state) =>
  state.partnerRequest.partnerRequests;
