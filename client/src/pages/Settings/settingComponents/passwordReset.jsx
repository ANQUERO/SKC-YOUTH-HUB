import React, { useState } from 'react'
import {
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    Typography
} from '@mui/material'
import { Security } from '@mui/icons-material'
import axiosInstance from '@lib/axios'
import styles from '@styles/officialSettings.module.scss'

const PasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState('')

    const onReset = async (e) => {
        e.preventDefault()
        setStatus('')
        if (newPassword !== confirmPassword) {
            setStatus('New passwords do not match')
            return
        }
        try {
            const { data } = await axiosInstance.post('/auth/reset-password', { currentPassword, newPassword })
            setStatus(data.message || 'Password updated successfully')
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err) {
            setStatus(err.response?.data?.message || 'Failed to update password')
        }
    }

    return (
        <Card className={styles.passwordResetCard}>
            <CardContent className={styles.cardContent}>
                <Typography variant="h6" gutterBottom className={styles.header}>
                    <Security className={styles.icon} /> Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary" className={styles.description}>
                    Change your account password for enhanced security.
                </Typography>

                {status && (
                    <Alert
                        severity={status.includes('error') || status.includes('Failed') ? 'error' : 'success'}
                        className={styles.alert}
                    >
                        {status}
                    </Alert>
                )}

                <form onSubmit={onReset} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={`${styles.fieldGroup} ${styles.currentPassword}`}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className={styles.textField}
                            />
                        </div>

                        <div className={`${styles.fieldGroup} ${styles.newPasswords}`}>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: '#666', mb: 2 }}>
                                New Password
                            </Typography>
                            <div className={styles.passwordFields}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    minLength={6}
                                    required
                                    className={styles.textField}
                                    helperText="Must be at least 8 characters long"
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                    required
                                    className={styles.textField}
                                />
                            </div>
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!currentPassword || !newPassword || !confirmPassword || newPassword.length < 6}
                                className={styles.submitButton}
                            >
                                Update Password
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default PasswordReset