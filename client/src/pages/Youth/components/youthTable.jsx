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
    rows, 
    selected, 
    order, 
    orderBy, 
    dense,
    onSelectAllClick,
    onRequestSort,
    onRowClick,
    isSelected 
}) => {
    const handleSelectAllClick = (event) => {
        onSelectAllClick(event.target.checked ? rows.map((n) => n.id) : []);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        onRequestSort(isAsc ? "desc" : "asc", property);
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
                        const isItemSelected = isSelected(row.id);
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
                                            {row.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {row.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.registered ? "Registered" : "Unregistered"} 
                                        size="small"
                                        color={row.registered ? "success" : "default"}
                                        variant={row.registered ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.verified ? "Verified" : "Unverified"} 
                                        size="small"
                                        color={row.verified ? "success" : "default"}
                                        variant={row.verified ? "filled" : "outlined"}
                                        icon={row.verified ? <ShieldCheck /> : null}
                                    />
                                </TableCell>
                                <TableCell>{row.age}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.gender} 
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.purok} 
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