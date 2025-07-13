import { createSlice } from '@reduxjs/toolkit';
import { adminAuth } from '@hooks/adminAuthThunk.js';

const initialState = {
    first_name: "",
    last_name: "",
    organization: "",
    position: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const adminAuthSlice = createSlice({
    name: "AdminAuth",
    initialState,
    reducers: {
        updateField: (state, action) => {
            const {
                field,
                value
            } = action.payload;
            state[field] = value;
        },
        resetForm: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(adminAuth.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(adminAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Something went wrong';
            });
    }
});

export const {
    updateField,
    resetForm
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;