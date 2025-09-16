import React, { useState } from 'react';
import {
    Box,
    Button,
    Avatar,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '@lib/axios';

const ProfilePictureUpload = ({
    currentPicture,
    userName,
    onPictureUpdate,
    size = 120,
    showButton = true
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post('/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'Success') {
                setSuccess('Profile picture updated successfully!');
                onPictureUpdate(response.data.profile_picture);
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError('Failed to update profile picture');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const getAvatarSrc = () => {
        if (currentPicture) {
            return currentPicture;
        }
        return `https://ui-avatars.com/api/?name=${userName || "User"}&size=${size}&background=random`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
                <Avatar
                    src={getAvatarSrc()}
                    sx={{
                        width: size,
                        height: size,
                        border: '3px solid #e5e7eb'
                    }}
                />
                {showButton && (
                    <Tooltip title="Upload new profile picture">
                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                                width: 32,
                                height: 32,
                            }}
                            disabled={uploading}
                        >
                            <PhotoCameraIcon sx={{ fontSize: 16 }} />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </IconButton>
                    </Tooltip>
                )}
                {uploading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>

            {showButton && (
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    disabled={uploading}
                    sx={{ minWidth: 200 }}
                >
                    {uploading ? 'Uploading...' : 'Change Picture'}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </Button>
            )}

            {error && (
                <Alert severity="error" sx={{ width: '100%', maxWidth: 300 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ width: '100%', maxWidth: 300 }}>
                    {success}
                </Alert>
            )}
        </Box>
    );
};

export default ProfilePictureUpload;
