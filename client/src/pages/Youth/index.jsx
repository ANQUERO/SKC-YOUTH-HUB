import React, { useEffect, useState, useMemo } from "react";
import useYouth from "@hooks/useYouth";
import {
    Box,
    Paper,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Toolbar,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControlLabel,
    Switch,
    Divider,
    Stack,
    Drawer,
    Chip,
    Card,
    Grid,
    InputAdornment,
    Avatar,
    alpha,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { visuallyHidden } from "@mui/utils";
import { saveAs } from "file-saver";
import AddYouthModal from "./components/AddYouthModal";

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
};

const getComparator = (order, orderBy) =>
    order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

const headCells = [
    { id: "name", label: "Youth Member" },
    { id: "email", label: "Email" },
    { id: "registered", label: "Voting Status" },
    { id: "verified", label: "Verification" },
    { id: "age", label: "Age" },
    { id: "gender", label: "Gender" },
    { id: "purok", label: "Purok" },
];

function YouthPage() {
    const theme = useTheme();
    const { youthData, fetchYouths } = useYouth();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [verifiedFilter, setVerifiedFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [purokFilter, setPurokFilter] = useState("all");
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dense, setDense] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        fetchYouths();
    }, []);

    const rows = useMemo(() => {
        if (!youthData?.youth) return [];
        return youthData.youth.map((y) => ({
            id: y.youth_id,
            name: y.full_name || "N/A",
            email: y.email || "N/A",
            registered: y.registered_voter === "yes",
            verified: y.verified,
            age: y.age || "N/A",
            gender: y.gender || "N/A",
            purok: y.purok || "N/A",
        }));
    }, [youthData]);

    const filteredRows = useMemo(() => {
        let r = [...rows];
        if (search) {
            r = r.filter((y) => 
                y.name.toLowerCase().includes(search.toLowerCase()) ||
                y.email.toLowerCase().includes(search.toLowerCase()) ||
                y.purok.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filter === "registered") {
            r = r.filter((y) => y.registered);
        } else if (filter === "unregistered") {
            r = r.filter((y) => !y.registered);
        }
        if (verifiedFilter !== "all") {
            r = r.filter((y) => 
                verifiedFilter === "yes" ? y.verified : !y.verified
            );
        }
        if (genderFilter !== "all") {
            r = r.filter((y) => y.gender.toLowerCase() === genderFilter);
        }
        if (purokFilter !== "all") {
            r = r.filter((y) => y.purok === purokFilter);
        }
        return r.sort(getComparator(order, orderBy));
    }, [rows, search, filter, verifiedFilter, genderFilter, purokFilter, order, orderBy]);

    const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Statistics
    const stats = useMemo(() => ({
        total: rows.length,
        registered: rows.filter(y => y.registered).length,
        verified: rows.filter(y => y.verified).length,
        male: rows.filter(y => y.gender.toLowerCase() === 'male').length,
        female: rows.filter(y => y.gender.toLowerCase() === 'female').length,
    }), [rows]);

    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            setSelected(paginatedRows.map((n) => n.id));
        } else setSelected([]);
    };

    const handleClick = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleRequestSort = (_, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const exportToCSV = () => {
        const headers = headCells.map((h) => h.label);
        const csvRows = [headers.join(",")];
        filteredRows.forEach((row) => {
            csvRows.push([
                row.name,
                row.email,
                row.registered ? "Registered" : "Unregistered",
                row.verified ? "Yes" : "No",
                row.age,
                row.gender,
                row.purok,
            ].join(","));
        });
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "youth_data.csv");
    };

    const isSelected = (id) => selected.includes(id);

    const FilterChip = ({ label, active, onClick }) => (
        <Chip
            label={label}
            variant={active ? "filled" : "outlined"}
            color={active ? "primary" : "default"}
            onClick={onClick}
            size="small"
        />
    );

    const SidebarContent = (
        <Box sx={{ width: 280, p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon /> Filters
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">VOTING STATUS</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                    <FilterChip label="Registered" active={filter === "registered"} onClick={() => setFilter("registered")} />
                    <FilterChip label="Unregistered" active={filter === "unregistered"} onClick={() => setFilter("unregistered")} />
                </Stack>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">VERIFICATION</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip label="All" active={verifiedFilter === "all"} onClick={() => setVerifiedFilter("all")} />
                    <FilterChip label="Verified" active={verifiedFilter === "yes"} onClick={() => setVerifiedFilter("yes")} />
                    <FilterChip label="Unverified" active={verifiedFilter === "no"} onClick={() => setVerifiedFilter("no")} />
                </Stack>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">GENDER</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip label="All" active={genderFilter === "all"} onClick={() => setGenderFilter("all")} />
                    <FilterChip label="Male" active={genderFilter === "male"} onClick={() => setGenderFilter("male")} />
                    <FilterChip label="Female" active={genderFilter === "female"} onClick={() => setGenderFilter("female")} />
                </Stack>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">PUROK</Typography>
                <Stack spacing={1}>
                    <FilterChip label="All" active={purokFilter === "all"} onClick={() => setPurokFilter("all")} />
                    {["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"].map((p) => (
                        <FilterChip key={p} label={p} active={purokFilter === p} onClick={() => setPurokFilter(p)} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );

    const StatCard = ({ icon, title, value, color }) => (
        <Card sx={{ p: 2, background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(color, 0.2), color: color }}>
                    {icon}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color={color}>
                        {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                    Youth Management
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    Manage youth members and track their registration status
                </Typography>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            icon={<PersonIcon />} 
                            title="Total Youths" 
                            value={stats.total} 
                            color={theme.palette.primary.main} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            icon={<HowToVoteIcon />} 
                            title="Registered Voters" 
                            value={stats.registered} 
                            color={theme.palette.success.main} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            icon={<VerifiedIcon />} 
                            title="Verified" 
                            value={stats.verified} 
                            color={theme.palette.info.main} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            icon={<PersonIcon />} 
                            title="Male / Female" 
                            value={`${stats.male} / ${stats.female}`} 
                            color={theme.palette.warning.main} 
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Main Content */}
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                {/* Toolbar */}
                <Toolbar sx={{ 
                    px: 3, 
                    py: 2, 
                    bgcolor: 'white',
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, width: '100%', alignItems: { xs: 'stretch', md: 'center' } }}>
                        <TextField
                            size="small"
                            placeholder="Search by name, email, or purok..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ 
                                maxWidth: { md: 400 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />} 
                                onClick={() => setAddModalOpen(true)}
                                sx={{ borderRadius: 2 }}
                            >
                                Add Youth
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<DownloadIcon />} 
                                onClick={exportToCSV}
                                sx={{ borderRadius: 2 }}
                            >
                                Export
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<DeleteIcon />} 
                                disabled={selected.length === 0}
                                sx={{ borderRadius: 2 }}
                            >
                                Delete ({selected.length})
                            </Button>
                            <IconButton 
                                onClick={() => setSidebarOpen(true)}
                                sx={{ 
                                    border: 1, 
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>

                {/* Table */}
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table size={dense ? "small" : "medium"} stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper' }}>
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                                        checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
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
                                            onClick={(e) => handleRequestSort(e, headCell.id)}
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
                            {paginatedRows.map((row) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow 
                                        key={row.id} 
                                        hover 
                                        selected={isItemSelected}
                                        onClick={() => handleClick(row.id)}
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
                                                icon={row.verified ? <VerifiedIcon /> : null}
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
                            {paginatedRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            No youth members found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Try adjusting your search or filters
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}>
                    <FormControlLabel 
                        control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />} 
                        label="Compact view" 
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Card>

            {/* Filter Drawer */}
            <Drawer 
                anchor="right" 
                open={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                PaperProps={{
                    sx: { 
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12
                    }
                }}
            >
                {SidebarContent}
            </Drawer>

            {/* Add Youth Modal */}
            <AddYouthModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSuccess={() => {
                    fetchYouths();
                    setAddModalOpen(false);
                }}
            />
        </Box>
    );
}

export default YouthPage;