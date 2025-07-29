import { Menu, MenuItem } from '@mui/material';

export default function PurokActionsMenu({ anchorEl, open, onClose, onEdit, onDelete }) {
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            <MenuItem onClick={onEdit}>Edit</MenuItem>
            <MenuItem onClick={onDelete}>Delete</MenuItem>
        </Menu>
    );
}
