import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    Tabs,
    Tab,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider
} from '@mui/material'
import { PersonAdd, Security, AdminPanelSettings } from '@mui/icons-material'
import axiosInstance from '@lib/axios'
import { useAuthContext } from '@context/AuthContext'

const Settings = () => {
    const { isSkSuperAdmin } = useAuthContext()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState('')
    const [activeTab, setActiveTab] = useState(0)

    // Official signup form state
    const [signupForm, setSignupForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        official_position: '',
        role: 'natural_official',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        contact_number: '',
        gender: '',
        age: ''
    })
    const [signupLoading, setSignupLoading] = useState(false)
    const [signupStatus, setSignupStatus] = useState('')

    const onReset = async (e) => {
        e.preventDefault()
        setStatus('')
        if (newPassword !== confirmPassword) {
            setStatus('New passwords do not match')
            return
        }
        try {
            const { data } = await axiosInstance.post('/auth/reset-password', { currentPassword, newPassword })
            setStatus(data.message || 'Password updated')
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err) {
            setStatus(err.response?.data?.message || 'Failed to update password')
        }
    }

    const handleSignupChange = (field) => (e) => {
        setSignupForm(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    const handleOfficialSignup = async (e) => {
        e.preventDefault()
        setSignupLoading(true)
        setSignupStatus('')

        if (signupForm.password !== signupForm.confirmPassword) {
            setSignupStatus('Passwords do not match')
            setSignupLoading(false)
            return
        }

        if (signupForm.password.length < 6) {
            setSignupStatus('Password must be at least 6 characters long')
            setSignupLoading(false)
            return
        }

        try {
            const { data } = await axiosInstance.post('/auth/adminSignup', signupForm)
            setSignupStatus('Official registered successfully!')
            setSignupForm({
                email: '',
                password: '',
                confirmPassword: '',
                official_position: '',
                role: 'natural_official',
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: '',
                contact_number: '',
                gender: '',
                age: ''
            })
        } catch (err) {
            setSignupStatus(err.response?.data?.message || 'Failed to register official')
        } finally {
            setSignupLoading(false)
        }
    }

    const renderPasswordReset = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security /> Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Change your account password for security.
                </Typography>

                {status && (
                    <Alert severity={status.includes('error') || status.includes('Failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
                        {status}
                    </Alert>
                )}

                <form onSubmit={onReset}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!currentPassword || !newPassword || !confirmPassword}
                            >
                                Update Password
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )

    const renderOfficialSignup = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAdd /> Register New Official
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add a new official to the system. Only super officials can register other officials.
                </Typography>

                {signupStatus && (
                    <Alert severity={signupStatus.includes('error') || signupStatus.includes('Failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
                        {signupStatus}
                    </Alert>
                )}

                <form onSubmit={handleOfficialSignup}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={signupForm.email}
                                onChange={handleSignupChange('email')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Official Position"
                                value={signupForm.official_position}
                                onChange={handleSignupChange('official_position')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={signupForm.role}
                                    onChange={handleSignupChange('role')}
                                    label="Role"
                                >
                                    <MenuItem value="natural_official">Natural Official</MenuItem>
                                    {isSkSuperAdmin && (
                                        <MenuItem value="super_official">Super Official</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                value={signupForm.contact_number}
                                onChange={handleSignupChange('contact_number')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={signupForm.first_name}
                                onChange={handleSignupChange('first_name')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={signupForm.last_name}
                                onChange={handleSignupChange('last_name')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Middle Name"
                                value={signupForm.middle_name}
                                onChange={handleSignupChange('middle_name')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Suffix"
                                value={signupForm.suffix}
                                onChange={handleSignupChange('suffix')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={signupForm.gender}
                                    onChange={handleSignupChange('gender')}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Age"
                                type="number"
                                value={signupForm.age}
                                onChange={handleSignupChange('age')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={signupForm.password}
                                onChange={handleSignupChange('password')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={signupForm.confirmPassword}
                                onChange={handleSignupChange('confirmPassword')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={signupLoading || !signupForm.email || !signupForm.password || !signupForm.first_name || !signupForm.last_name}
                            >
                                {signupLoading ? 'Registering...' : 'Register Official'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettings /> Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage your personal information, security settings, and system administration.
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Password Reset" icon={<Security />} />
                    {isSkSuperAdmin && (
                        <Tab label="Register Official" icon={<PersonAdd />} />
                    )}
                </Tabs>
            </Box>

            {activeTab === 0 && renderPasswordReset()}
            {activeTab === 1 && isSkSuperAdmin && renderOfficialSignup()}

            <Outlet />
        </Box>
    )
}

export default Settings 