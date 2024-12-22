// src/redux/transactionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Async thunk to fetch transactions
// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transactions?populate=*", {
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

export const fetchTransactionByDocumentId = createAsyncThunk(
  "transactions/fetchTransactionByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
     
      const response = await axiosInstance.get(
        `/transactions?populate=*&filters[customer][user][documentId][$eq]=${documentId}`,
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

export const fetchTransactionsForServiceProvider = createAsyncThunk(
  "transactions/fetchTransactionsForServiceProvider",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/transactions?populate[customer][populate]=*&populate[service][populate]=*&filters[service][service_provider][documentId]=${documentId}`,
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

// Create transaction
export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
 
    try {
      const response = await axiosInstance.post(
        "/transactions",
        transactionData,
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

// Update transaction by documentId
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ documentId, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/transactions/${documentId}`,
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete transaction by documentId
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (documentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/transactions/${documentId}`, {
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

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      })
      .addCase(fetchTransactionByDocumentId.fulfilled, (state, action) => {
        console.log("Redux fulfilled payload:", action.payload); // Log Redux
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionByDocumentId.rejected, (state, action) => {
        console.error("Redux rejected error:", action.payload); // Log Redux Error
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      })
      .addCase(fetchTransactionsForServiceProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactionsForServiceProvider.fulfilled,
        (state, action) => {
          state.loading = false;
          state.transactions = action.payload;
        }
      )
      .addCase(
        fetchTransactionsForServiceProvider.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch transactions";
        }
      )
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.documentId === action.payload.documentId
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.documentId !== action.payload
        );
      });
  },
});

export default transactionSlice.reducer;
