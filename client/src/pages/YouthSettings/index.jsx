import React, { useState } from 'react'
import {
    Box,
    Typography,
    Tabs,
    Tab
} from '@mui/material'
import { 
    Security, 
    History
} from '@mui/icons-material'
import PasswordReset from './settingComponents/passwordReset'
import ActivityHistory from './settingComponents/activityHistory'

const YouthSettings = () => {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" 
            gutterBottom sx={{ 
                 display: 'flex',
                 alignItems: 'center', 
                 gap: 1 
                 }}>
                <Security /> Settings
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage your account settings and view your activity history.
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Password Reset" icon={<Security />} iconPosition="start" />
                    <Tab label="Activity History" icon={<History />} iconPosition="start" />
                </Tabs>
            </Box>

            {activeTab === 0 && <PasswordReset />}
            {activeTab === 1 && <ActivityHistory />}
        </Box>
    )
}

export default YouthSettings

