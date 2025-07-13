import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../lib/axios'

export const adminAuth = createAsyncThunk(
    'AdminAuth/adminAuth',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/adminAuth/sign-up', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Registration failed" });
        }
    }
);