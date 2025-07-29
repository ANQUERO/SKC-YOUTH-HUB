import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const sharedStyles = `
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.1s;
  text-decoration: none;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    margin-right: ${({ $collapsed }) => ($collapsed ? "0" : "0.75rem")};
    width: 1.25rem;
    height: 1.25rem;
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "inline")};
    white-space: nowrap;
    font-size: 0.95rem;
  }

  &:hover {
    background-color: #f3f4f6;
    color: #31578b;
  }
`;

const StyledNavLink = styled(NavLink)`
  ${sharedStyles}
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-start")};
  color: white;
  background-color: transparent;

  &.active {
    color: #31578b;
    background-color: #e5e7eb;
  }
`;

const StyledButton = styled.button`
  all: unset;
  ${sharedStyles}
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-start")};
  color: white;
`;

const Menu = ({ menus, collapsed }) => {
  return (
    <MenuWrapper>
      {menus.map((item) => {
        if (!item.visible) return null;

        const key = item.path || item.title;

        return item.onClick ? (
          <StyledButton
            key={key}
            onClick={item.onClick}
            title={item.title}
            $collapsed={collapsed}
            aria-label={item.title}
          >
            {item.icon}
            <span>{item.title}</span>
          </StyledButton>
        ) : (
          <StyledNavLink
            key={key}
            to={item.path}
            title={item.title}
            $collapsed={collapsed}
            aria-label={item.title}
          >
            {item.icon}
            <span>{item.title}</span>
          </StyledNavLink>
        );
      })}
    </MenuWrapper>
  );
};

export default Menu;
