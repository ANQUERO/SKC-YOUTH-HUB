import React, { useState, useEffect } from 'react'

import {
    MainContainer,
    MenuContainer,
    ContentContainer,
    TopContainer,
    UserContainer,
    Content
} from "@components/Authenticated/authenticated.jsx";

import {
    Plus,
    LayoutDashboard,
    Users,
    Map,
    Inbox,
    IdCard,
    UsersRound,
    Settings,
    LogOut,
    User,
} from 'lucide-react';

const skAdminMenu = [
    {
        title: "Create Post",
        path: "/",
        visible: true,
        icon: <Plus />
    },
    {
        title: "Dashboard",
        path: "/",
        visible: true,
        icon: <LayoutDashboard />
    },
    {
        title: "Youth",
        path: "/",
        visible: true,
        icon: <Users />
    },
    {
        title: "Purok",
        path: "/",
        visible: true,
        icon: <Map />
    },
    {
        title: "Inbox",
        path: "/",
        visible: true,
        icon: <Inbox />
    },
    {
        title: "Verification",
        path: "/",
        visible: true,
        icon: <IdCard />
    },
    {
        title: "Officials",
        path: "/",
        visible: true,
        icon: <UsersRound />
    },
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: <Settings />
    },
    {
        title: "Logout",
        path: "/",
        visible: true,
        icon: <LogOut />
    },
]

const youthMenu = [
    {
        title: "News Feed",
        path: "/",
        visible: true,
        icon: <Plus />
    },
    {
        title: "Profile",
        path: "/",
        visible: true,
        icon: <User />
    },
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: <Settings />
    },
    {
        title: "Logout",
        path: "/",
        visible: true,
        icon: <LogOut />
    },
];

const menus = [
    ...(skAdminMenu ? youthMenu : []),
    ...(youthMenu ? skAdminMenu : []),
];

const menuTop = [
    {
        title: "Create Post",
        path: "/",
        visible: true,
        icon: <Plus />
    }
]

const menuBottom = [
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: <Settings />
    },
    {
        title: "Logout",
        path: "/",
        visible: true,
        icon: <LogOut />
    },
]

const role = 'admin';

const menuByRole = (role) => {
    return role == 'admin' ? skAdminMenu : youthMenu;
};



const Authenticated = () => {
    const menuItems = menuByRole(role);

    return (
        <MainContainer>
            {/* Sidebar Menu */}
            <MenuContainer>
                <UserContainer>
                    <div style={{ padding: '12px', fontWeight: 'bold' }}>
                        Logged in as: {role}
                    </div>
                </UserContainer>
                {menuItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
                        {item.icon}
                        <span>{item.title}</span>
                    </div>
                ))}
            </MenuContainer>

            {/* Main Content Area */}
            <ContentContainer>
                <TopContainer>
                    <h2>Top Navigation</h2>
                </TopContainer>

                <Content>
                    <h1>Welcome to the authenticated dashboard!</h1>
                    <p>This is where your main content will go based on the route.</p>
                </Content>
            </ContentContainer>
        </MainContainer>
    )
}

export default Authenticated