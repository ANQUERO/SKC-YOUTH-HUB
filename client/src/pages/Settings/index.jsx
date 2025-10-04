import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
    Box,
    Typography,
    Tabs,
    Tab
} from '@mui/material'
import { Security, AdminPanelSettings, PersonAdd } from '@mui/icons-material'
import { useAuthContext } from '@context/AuthContext'
import PasswordReset from './settingComponents/passwordReset'
import OfficialSignup from './settingComponents/officialSignup'

const Settings = () => {
    const { isSkSuperAdmin } = useAuthContext()
    const [activeTab, setActiveTab] = useState(0)

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

            {activeTab === 0 && <PasswordReset />}
            {activeTab === 1 && isSkSuperAdmin && <OfficialSignup />}

            <Outlet />
        </Box>
    )
}

export default Settings