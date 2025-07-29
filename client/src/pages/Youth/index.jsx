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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import { visuallyHidden } from "@mui/utils";
import { saveAs } from "file-saver";

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
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "registered", label: "Voting Status" },
    { id: "verified", label: "Verified" },
    { id: "age", label: "Age" },
    { id: "gender", label: "Gender" },
    { id: "purok", label: "Purok" },
];

function YouthPage() {
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

    useEffect(() => {
        fetchYouths();
    }, []);

    const rows = useMemo(() => {
        if (!youthData?.youth) return [];
        return youthData.youth.map((y) => ({
            id: y.youth_id,
            name: y.full_name || "N/A",
            email: y.email || "N/A",
            registered: y.registered_voter === "yes" ? "Registered" : "Unregistered",
            verified: y.verified ? "Yes" : "No",
            age: y.age || "N/A",
            gender: y.gender || "N/A",
            purok: y.purok || "N/A",
        }));
    }, [youthData]);

    const filteredRows = useMemo(() => {
        let r = [...rows];
        if (search) {
            r = r.filter((y) => y.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (filter === "registered") {
            r = r.filter((y) => y.registered === "Registered");
        } else if (filter === "unregistered") {
            r = r.filter((y) => y.registered === "Unregistered");
        }
        if (verifiedFilter !== "all") {
            r = r.filter((y) => y.verified.toLowerCase() === verifiedFilter);
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
                row.registered,
                row.verified,
                row.age,
                row.gender,
                row.purok,
            ].join(","));
        });
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "youth_data.csv");
    };

    const isSelected = (id) => selected.includes(id);

    const SidebarContent = (
        <Box sx={{ width: 260, p: 2 }}>
            <Typography variant="h6" gutterBottom>Status</Typography>
            <Stack spacing={1}>
                <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>All</Button>
                <Button variant={filter === "registered" ? "contained" : "outlined"} onClick={() => setFilter("registered")}>Registered</Button>
                <Button variant={filter === "unregistered" ? "contained" : "outlined"} onClick={() => setFilter("unregistered")}>Unregistered</Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Verified</Typography>
            <Stack spacing={1}>
                <Button variant={verifiedFilter === "all" ? "contained" : "outlined"} onClick={() => setVerifiedFilter("all")}>All</Button>
                <Button variant={verifiedFilter === "yes" ? "contained" : "outlined"} onClick={() => setVerifiedFilter("yes")}>Verified</Button>
                <Button variant={verifiedFilter === "no" ? "contained" : "outlined"} onClick={() => setVerifiedFilter("no")}>Unverified</Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Gender</Typography>
            <Stack spacing={1}>
                <Button variant={genderFilter === "all" ? "contained" : "outlined"} onClick={() => setGenderFilter("all")}>All</Button>
                <Button variant={genderFilter === "male" ? "contained" : "outlined"} onClick={() => setGenderFilter("male")}>Male</Button>
                <Button variant={genderFilter === "female" ? "contained" : "outlined"} onClick={() => setGenderFilter("female")}>Female</Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Purok</Typography>
            <Stack spacing={1}>
                <Button variant={purokFilter === "all" ? "contained" : "outlined"} onClick={() => setPurokFilter("all")}>
                    All
                </Button>
                {["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"].map((p) => (
                    <Button
                        key={p}
                        variant={purokFilter === p ? "contained" : "outlined"}
                        onClick={() => setPurokFilter(p)}
                    >
                        {p}
                    </Button>
                ))}
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>

            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)} sx={{ display: { sm: "none" } }}>
                {SidebarContent}
            </Drawer>

            <Box sx={{ width: { xs: 0, sm: 260 }, display: { xs: "none", sm: "block" }, borderRight: "1px solid #ddd", bgcolor: "#f9f9f9" }}>
                {SidebarContent}
            </Box>

            <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>

                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    Youths
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: '500 ' }}>
                    Manage your youths status and view their details.
                </Typography>


                <Paper sx={{ mb: 2 }}>
                    <Toolbar sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton sx={{ display: { sm: "none" } }} onClick={() => setSidebarOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search youth"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ maxWidth: { xs: "100%", sm: 300 } }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, width: { xs: "100%", sm: "auto" } }}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => alert("Add Youth")}>Add</Button>
                            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToCSV}>Export</Button>
                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} disabled={selected.length === 0} onClick={() => alert("Delete selected")}>Delete</Button>
                        </Box>
                    </Toolbar>

                    <TableContainer sx={{ overflowX: "auto" }}>
                        <Table size={dense ? "small" : "medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                                            checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    {headCells.map((headCell) => (
                                        <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
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
                                        <TableRow key={row.id} hover selected={isItemSelected} onClick={() => handleClick(row.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isItemSelected} />
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.registered}</TableCell>
                                            <TableCell>{row.verified}</TableCell>
                                            <TableCell>{row.age}</TableCell>
                                            <TableCell>{row.gender}</TableCell>
                                            <TableCell>{row.purok}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {paginatedRows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>No results found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                <FormControlLabel control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />} label="Dense padding" />
            </Box>
        </Box>
    );
}

export default YouthPage;
