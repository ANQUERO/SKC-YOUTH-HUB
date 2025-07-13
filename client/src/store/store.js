import { configureStore } from "@reduxjs/toolkit";
import AdminAuth from "@pages/AdminAuth";

if (!import.meta.env.VITE_BACKEND_URL) {
    console.error('WARNING: Enviroment variable is not set!')
}

export const store = configureStore({
    reducer: {
        adminAuth: AdminAuth,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
