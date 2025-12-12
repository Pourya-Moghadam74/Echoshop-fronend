import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as categoryService from "./categoryService";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.fetchCategories();
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to load categories');
    }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.categories = [];
            });
    },
});

export default categorySlice.reducer;