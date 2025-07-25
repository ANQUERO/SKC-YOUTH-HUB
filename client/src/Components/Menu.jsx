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
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: white;
  background-color: transparent;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.1s;
  position: relative;

  &.active {
    color: #31578B;
    background-color: #e5e7eb;
  }

  &:hover {
    background-color: #f3f4f6;
    color: #31578B;
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
    font-size: 0.95rem;
  }
`;

const StyledButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  transition: all 0.1s;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
    color: #31578B;
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
    font-size: 0.95rem;
  }
`;

const Menu = ({ menus, collapsed }) => {
  return (
    <MenuWrapper>
      {menus.map((item, idx) =>
        item.visible ? (
          item.onClick ? (
            <StyledButton
              key={idx}
              onClick={item.onClick}
              title={item.title}
              $collapsed={collapsed}
            >
              {item.icon}
              <span>{item.title}</span>
            </StyledButton>
          ) : (
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
        ) : null
      )}
    </MenuWrapper>
  );
};

export default Menu;
