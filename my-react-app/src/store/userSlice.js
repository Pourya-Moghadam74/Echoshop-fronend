import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../services/userService';

export const fetchUserAddresses = createAsyncThunk(
    'user/fetchUserAddresses',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.fetchUserAddresses();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserAddresses = createAsyncThunk(
    'user/updateUserAddresses',
    async (addressData, { rejectWithValue }) => {
        try {
            return await userService.updateUserAddresses(addressData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        addresses: [],
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
            })
            .addCase(updateUserAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
            })
            .addCase(fetchUserAddresses.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateUserAddresses.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
});

export const { setAddresses } = userSlice.actions; 
export default userSlice.reducer;