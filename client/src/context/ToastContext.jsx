import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext(undefined);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success', 'error', 'warning', 'info'
    });

    const showToast = useCallback((message, severity = 'success') => {
        setToast({
            open: true,
            message,
            severity,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    const value = {
        showToast,
        showSuccess: (message) => showToast(message, 'success'),
        showError: (message) => showToast(message, 'error'),
        showWarning: (message) => showToast(message, 'warning'),
        showInfo: (message) => showToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={hideToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={hideToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

