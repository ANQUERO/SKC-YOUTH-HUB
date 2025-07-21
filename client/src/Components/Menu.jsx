import React from "react";
import styled from "styled-components";

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: ${(props) => (props.$active ? "#111827" : "#4b5563")};
  background-color: ${(props) => (props.$active ? "#e5e7eb" : "transparent")};
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Menu = ({ menus, onItemClick }) => {
    return (
        <MenuWrapper>
            {menus
                .filter((item) => item.visible)
                .map((item, index) => (
                    <MenuItem
                        key={index}
                        $active={false}
                        onClick={() => onItemClick && onItemClick(item.path)}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </MenuItem>
                ))}
        </MenuWrapper>
    );
};

export default Menu;
