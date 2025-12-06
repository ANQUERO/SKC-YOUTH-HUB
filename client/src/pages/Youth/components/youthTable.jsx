import React from 'react';
import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Avatar,
    Typography,
    Chip,
} from "@mui/material";
import { 
    ShieldCheck 
} from 'lucide-react';
import { visuallyHidden } from "@mui/utils";

const headCells = [
    { id: "name", label: "Youth Member" },
    { id: "email", label: "Email" },
    { id: "registered", label: "Voting Status" },
    { id: "verified", label: "Verification" },
    { id: "age", label: "Age" },
    { id: "gender", label: "Gender" },
    { id: "purok", label: "Purok" },
];

const YouthTable = ({ 
    rows = [], 
    selected = [], 
    order = "asc", 
    orderBy = "name", 
    dense = false,
    onSelectAllClick,
    onRequestSort,
    onRowClick,
    isSelected 
}) => {
    const handleSelectAllClick = (event) => {
        // FIX: rows now have .id, not .youth_id
        onSelectAllClick(event.target.checked ? rows.map((n) => n.id) : []);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        onRequestSort(isAsc ? "desc" : "asc", property);
    };

    // Helper function to get display name - FIXED to use transformed data
    const getDisplayName = (row) => {
        // Use the transformed name field from YouthPage
        return row.name || 'Unnamed Youth';
    };

    // Helper function to get avatar initials
    const getAvatarInitials = (row) => {
        const name = getDisplayName(row);
        if (!name || name === 'Unnamed Youth') return '?';
        
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    // Helper function to format registered voter status - FIXED to use transformed data
    const getVoterStatus = (registered) => {
        // Use the transformed registered boolean from YouthPage
        if (registered === true) {
            return { label: "Registered", color: "success" };
        }
        if (registered === false) {
            return { label: "Unregistered", color: "default" };
        }
        return { label: "Unknown", color: "warning" };
    };

    // Helper function to format gender
    const formatGender = (gender) => {
        if (!gender || gender === "N/A") return "N/A";
        return gender.charAt(0).toUpperCase() + gender.slice(1);
    };

    return (
        <TableContainer sx={{ maxHeight: 600 }}>
            <Table size={dense ? "small" : "medium"} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper' }}>
                            <Checkbox
                                indeterminate={selected.length > 0 && selected.length < rows.length}
                                checked={rows.length > 0 && selected.length === rows.length}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        {headCells.map((headCell) => (
                            <TableCell 
                                key={headCell.id} 
                                sortDirection={orderBy === headCell.id ? order : false}
                                sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : "asc"}
                                    onClick={() => handleRequestSort(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id && (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                                        </Box>
                                    )}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        // FIX: use row.id instead of row.youth_id
                        const isItemSelected = isSelected(row.id);
                        const displayName = getDisplayName(row);
                        const voterStatus = getVoterStatus(row.registered);
                        
                        return (
                            <TableRow 
                                key={row.id} 
                                hover 
                                selected={isItemSelected}
                                onClick={() => onRowClick(row.id)}
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isItemSelected} />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                            {getAvatarInitials(row)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {displayName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.email || "N/A"}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={voterStatus.label} 
                                        size="small"
                                        color={voterStatus.color}
                                        variant="filled"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.verified ? "Verified" : "Unverified"} 
                                        size="small"
                                        color={row.verified ? "primary" : "default"}
                                        variant={row.verified ? "filled" : "outlined"}
                                        icon={row.verified ? <ShieldCheck /> : null}
                                    />
                                </TableCell>
                                <TableCell>{row.age || "N/A"}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={formatGender(row.gender)} 
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.purok || "N/A"} 
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                    <Typography variant="h6" gutterBottom>
                                        No youth members found
                                    </Typography>
                                    <Typography variant="body2">
                                        Try adjusting your search or filters
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default YouthTable;