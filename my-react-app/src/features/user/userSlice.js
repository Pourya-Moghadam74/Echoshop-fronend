import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from "../user/userService";

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

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.fetchUserInfo();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        addresses: [],
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
        resetUserState: () => ({ userInfo: null, addresses: [], error: null })
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
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.error = action.payload;
            })

    }
});

export const { setAddresses, resetUserState } = userSlice.actions; 
export default userSlice.reducer;