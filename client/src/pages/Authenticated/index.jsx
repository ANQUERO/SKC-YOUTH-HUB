import React, { useState } from 'react'
import {
    MainContainer,
    MenuContainer,
    ConetentContainer,
    TopContainer,
    UserContainer,
    Content
} from "@components/Layouts/authenticated.js";

const skAdminMenu = [
    {
        title: "Create Post",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Dashboard",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Purok",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Inbox",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Verification",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Officials",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Logout",
        path: "/",
        visible: true,
        icon: ""
    },
]

const youthMenu = [
    {
        title: "News Feed",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Profile",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: ""
    },
    {
        title: "Logout",
        path: "/",
        visible: true,
        icon: ""
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
        icon: ""
    }
]

const menuBottom = [
    {
        title: "Settings",
        path: "/",
        visible: true,
        icon: ""
    }
]



const Authenticated = () => {

    return (
        <>
        </>
    )
}

export default Authenticated