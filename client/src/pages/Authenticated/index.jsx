import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import style from '@styles/authenticated.module.scss';

import {
    LayoutGrid,
    User,
    MapPinned,
    Inbox,
    IdCard,
    Users,
    Settings,
    LogOut,
    Plus
} from 'lucide-react';

import styled from 'styled-components';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
`;

const MenuContainer = styled.div`
  padding: 2rem 1.25rem;
  background-color: #f9fafb;
  display: none;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  width: 250px;
  z-index: 10;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;

  @media (min-width: 1024px) {
    margin-left: 250px;
  }
`;

const TopContainer = styled.div`
  background-color: #ffffff;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    gap: 0;
  }
`;

const UserContainer = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 1024px) {
    display: inline-flex;
  }
`;

const Content = styled.div`
  padding: 0.5rem;
  padding-bottom: 1rem;
  height: 100%;
  overflow-y: auto;

  @media (min-width: 1024px) {
    padding: 2rem;
    padding-bottom: 2rem;
  }
`;

const SearchContainer = styled.input`
  width: 100%;
  border: none;
  background-color: #f3f4f6;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 440px;
  }
`;

const CreatePostButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: #1d4ed8;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Authenticated = () => {
    const [searchValue, setSearchValue] = useState('');

    const menu = [
        {
            title: "Dashboard",
            path: "/",
            visible: true,
            icon: <LayoutGrid />
        },
        {
            title: "Youth",
            path: "/youth",
            visible: true,
            icon: <User />
        },
        {
            title: "Purok",
            path: "/purok",
            visible: true,
            icon: <MapPinned />
        },
        {
            title: "Inbox",
            path: "/inbox",
            visible: true,
            icon: <Inbox />
        },
        {
            title: "Verification",
            path: "/verification",
            visible: true,
            icon: <IdCard />
        },
        {
            title: "Officials",
            path: "/officials",
            visible: true,
            icon: <Users />
        }
    ];

    const menusBottom = [
        {
            title: "Settings",
            path: "/account",
            visible: true,
            icon: <Settings />
        },
        {
            title: "Logout",
            path: "/logout",
            visible: true,
            icon: <LogOut />
        }
    ];

    return (
        <MainContainer>
            <MenuContainer>
                <div>
                    <div className={style.top}>
                        <Logo />
                    </div>

                    <CreatePostButton>
                        <Plus />
                        Create Post
                    </CreatePostButton>

                    <Menu menus={menu} />
                </div>

                <Menu menus={menusBottom} />
            </MenuContainer>

            <ContentContainer>
                <TopContainer>
                    <SearchContainer
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <UserContainer>
                        <span>User</span>
                    </UserContainer>
                </TopContainer>

                <Content>
                    <Outlet context={{ searchValue }} />
                </Content>
            </ContentContainer>
        </MainContainer>
    );
};

export default Authenticated;
