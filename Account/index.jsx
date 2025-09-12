import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import axiosInstance from '@lib/axios'


const Settings = () => {
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
            setStatus(data.message || 'Password updated')
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err) {
            setStatus(err.response?.data?.message || 'Failed to update password')
        }
    }

    return (
        <>
            <h1>Account Settings</h1>
            <p>Manage your personal information, security settings, and preferences.</p>

            <section style={{ marginTop: 24, maxWidth: 420 }}>
                <h2>Reset Password</h2>
                <form onSubmit={onReset} style={{ display: 'grid', gap: 12 }}>
                    <label>
                        Current Password
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </label>
                    <label>
                        New Password
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
                    </label>
                    <label>
                        Confirm New Password
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
                    </label>
                    <button type="submit">Update Password</button>
                    {status && <p>{status}</p>}
                </form>
            </section>

            <Outlet />
        </>
    )
}

export default Settings 