import React, { useEffect, useRef } from 'react';
import { Button, Box } from '@mui/material';
import { Google } from '@mui/icons-material';

const GoogleOAuth = ({ onSuccess, onError, disabled = false }) => {
    const googleButtonRef = useRef(null);

    useEffect(() => {
        if (window.google) {
            initializeGoogleSignIn();
        } else {
            // Wait for Google script to load
            const checkGoogle = setInterval(() => {
                if (window.google) {
                    clearInterval(checkGoogle);
                    initializeGoogleSignIn();
                }
            }, 100);

            return () => clearInterval(checkGoogle);
        }
    }, []);

    const initializeGoogleSignIn = () => {
        if (googleButtonRef.current && window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: 'continue_with',
                    shape: 'rectangular'
                }
            );
        }
    };

    const handleCredentialResponse = async (response) => {
        try {
            if (onSuccess) {
                onSuccess(response.credential);
            }
        } catch (error) {
            console.error('Google OAuth error:', error);
            if (onError) {
                onError(error);
            }
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <div ref={googleButtonRef} />
        </Box>
    );
};

export default GoogleOAuth;
