import React from 'react'
import { Link, Outlet } from 'react-router-dom'


const Settings = () => {
    return (
        <>
            <h1>Account Settings</h1>
            <p>Manage your personal information, security settings, and preferences.</p>
            <Link to="signupAdmin">
                adsad
            </Link>
            <Outlet />
        </>

    )
}

export default Settings 