
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Thunks untuk operasi asinkron
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users?populate=*", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data; // Mengembalikan data pengguna
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

export const fetchUsersByDocumentId = createAsyncThunk(
  "user/fetchUsersByDocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data; // Mengembalikan data pengguna
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      // console.log("DATA", response.data);
      return response.data; // Mengembalikan data pengguna
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data; // Mengembalikan data pengguna yang baru dibuat
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ documentId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/users/${documentId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response.data; // Mengembalikan data pengguna yang diperbarui
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log(response.data);
      return documentId; // Mengembalikan documentId pengguna yang dihapus
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Menangani error
    }
  }
);

// Slice user
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsersByDocumentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByDocumentId.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByDocumentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Simpan data user
        console.log("Redux State Updated:", state.user); // Debug state setelah update
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Menambahkan user baru ke list
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.documentId === action.payload.documentId
        );
        if (index !== -1) {
          state.users[index] = action.payload; // Mengupdate user yang sudah ada
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.documentId !== action.payload
        ); // Menghapus user dari list
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
