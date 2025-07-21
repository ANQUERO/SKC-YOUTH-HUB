import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: white;
  background-color: transparent;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;

  &.active {
    color: #111827;
    background-color: #e5e7eb;
  }

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    flex-shrink: 0;
    margin-right: ${(props) => (props.$collapsed ? '0' : '0.75rem')};
    width: 1.25rem;
    height: 1.25rem;
  }

  span {
    display: ${(props) => (props.$collapsed ? 'none' : 'inline')};
    white-space: nowrap;
  }
`;

const Menu = ({ menus, collapsed }) => {
  return (
    <MenuWrapper>
      {menus.map(
        (item, idx) =>
          item.visible && (
            <StyledNavLink
              to={item.path}
              key={idx}
              title={item.title}
              $collapsed={collapsed}
            >
              {item.icon}
              <span>{item.title}</span>
            </StyledNavLink>
          )
      )}
    </MenuWrapper>
  );
};

export default Menu;
