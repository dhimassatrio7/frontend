// src/store/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Thunks untuk operasi asinkron
export const fetchCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/categories?populate=*");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryByDocumentId = createAsyncThunk(
  "category/getCategoryByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/categories/${documentId}?populate=*`,
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

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      // Membuat payload sesuai dengan struktur data yang diberikan
      const payload = {
        data: {
          category_name: categoryData.data.category_name,
          category_description: categoryData.data.category_description,
        },
      };

      const response = await axiosInstance.post("/categories", categoryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Gunakan token dari localStorage
        },
      });

      // Mengembalikan data jika berhasil
      return response.data.data;
    } catch (error) {
      // Mengembalikan pesan error jika terjadi kegagalan
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/editCategory",
  async ({ documentId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/categories/${documentId}`,
        categoryData,
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

export const deleteCategory = createAsyncThunk(
  "category/removeCategory",
  async (documentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/categories/${documentId}`, {
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch categories.";
      })

      // Handle getCategoryByDocumentId
      .addCase(fetchCategoryByDocumentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
      })

      // Handle createCategory
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = [...state.categories, action.payload];
      })

      // Handle editCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      // Handle removeCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
