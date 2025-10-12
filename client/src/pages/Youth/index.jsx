import React, { useEffect, useState, useMemo } from "react";
import useYouth from "@hooks/useYouth";
import {
    Box,
    TablePagination,
    Toolbar,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControlLabel,
    Switch,
    Drawer,
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
import { saveAs } from "file-saver";
import AddYouthModal from "./components/AddYouthModal";
import YouthTable from "./components/youthTable";
import Filter from "./components/filter";

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
};

const getComparator = (order, orderBy) =>
    order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

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

    // Filter handlers
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(0); // Reset to first page when filter changes
    };

    const handleVerifiedFilterChange = (newVerifiedFilter) => {
        setVerifiedFilter(newVerifiedFilter);
        setPage(0);
    };

    const handleGenderFilterChange = (newGenderFilter) => {
        setGenderFilter(newGenderFilter);
        setPage(0);
    };

    const handlePurokFilterChange = (newPurokFilter) => {
        setPurokFilter(newPurokFilter);
        setPage(0);
    };

    const handleSelectAllClick = (selectedIds) => {
        setSelected(selectedIds);
    };

    const handleRowClick = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleRequestSort = (newOrder, newOrderBy) => {
        setOrder(newOrder);
        setOrderBy(newOrderBy);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const exportToCSV = () => {
        const headers = ["Youth Member", "Email", "Voting Status", "Verification", "Age", "Gender", "Purok"];
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard 
                            icon={<PersonIcon />} 
                            title="Total Youths" 
                            value={stats.total} 
                            color={theme.palette.primary.main} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard 
                            icon={<HowToVoteIcon />} 
                            title="Registered Voters" 
                            value={stats.registered} 
                            color={theme.palette.success.main} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard 
                            icon={<VerifiedIcon />} 
                            title="Verified" 
                            value={stats.verified} 
                            color={theme.palette.info.main} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    px: { xs: 2, sm: 3 }, 
                    py: 2, 
                    bgcolor: 'white',
                    borderBottom: 1,
                    borderColor: 'divider',
                    minHeight: '80px !important'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        gap: 2, 
                        width: '100%', 
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between'
                    }}>
                        {/* Search Field */}
                        <TextField
                            size="small"
                            placeholder="Search by name, email, or purok..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ 
                                width: { xs: '100%', sm: 'auto' },
                                flex: { xs: '1 1 auto', sm: '0 1 300px', md: '0 1 400px' },
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'grey.50',
                                    '&:hover': {
                                        backgroundColor: 'grey.100',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                                    }
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
                        
                        {/* Action Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'space-between', sm: 'flex-end' },
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />} 
                                onClick={() => setAddModalOpen(true)}
                                sx={{ 
                                    borderRadius: 2,
                                    flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                    minWidth: { xs: '120px', sm: 'auto' }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                    Add Youth
                                </Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                                    Add
                                </Box>
                            </Button>

                            <Box sx={{ 
                                display: 'flex', 
                                gap: 1,
                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                justifyContent: { xs: 'flex-end', sm: 'flex-start' }
                            }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<DownloadIcon />} 
                                    onClick={exportToCSV}
                                    sx={{ 
                                        borderRadius: 2,
                                        display: { xs: 'none', sm: 'flex' }
                                    }}
                                >
                                    Export
                                </Button>
                                
                                <IconButton 
                                    onClick={exportToCSV}
                                    sx={{ 
                                        border: 1, 
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        display: { xs: 'flex', sm: 'none' }
                                    }}
                                >
                                    <DownloadIcon />
                                </IconButton>

                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    startIcon={<DeleteIcon />} 
                                    disabled={selected.length === 0}
                                    sx={{ 
                                        borderRadius: 2,
                                        display: { xs: 'none', sm: 'flex' },
                                        minWidth: 'auto'
                                    }}
                                >
                                    Delete ({selected.length})
                                </Button>
                                
                                <IconButton 
                                    color="error"
                                    disabled={selected.length === 0}
                                    sx={{ 
                                        border: 1, 
                                        borderColor: selected.length > 0 ? 'error.main' : 'divider',
                                        borderRadius: 2,
                                        display: { xs: 'flex', sm: 'none' },
                                        position: 'relative'
                                    }}
                                >
                                    <DeleteIcon />
                                    {selected.length > 0 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -4,
                                                right: -4,
                                                backgroundColor: 'error.main',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 16,
                                                height: 16,
                                                fontSize: '0.7rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {selected.length}
                                        </Box>
                                    )}
                                </IconButton>

                                <IconButton 
                                    onClick={() => setSidebarOpen(true)}
                                    sx={{ 
                                        border: 1, 
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        backgroundColor: 'grey.50',
                                        '&:hover': {
                                            backgroundColor: 'grey.100',
                                        }
                                    }}
                                >
                                    <FilterListIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>

                {/* Table Component */}
                <YouthTable
                    rows={paginatedRows}
                    selected={selected}
                    order={order}
                    orderBy={orderBy}
                    dense={dense}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    onRowClick={handleRowClick}
                    isSelected={isSelected}
                />

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
                <Filter
                    filter={filter}
                    verifiedFilter={verifiedFilter}
                    genderFilter={genderFilter}
                    purokFilter={purokFilter}
                    onFilterChange={handleFilterChange}
                    onVerifiedFilterChange={handleVerifiedFilterChange}
                    onGenderFilterChange={handleGenderFilterChange}
                    onPurokFilterChange={handlePurokFilterChange}
                />
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