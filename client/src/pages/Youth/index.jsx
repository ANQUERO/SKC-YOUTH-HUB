import React, { useEffect, useState, useMemo } from "react";
import style from "@styles/youth.module.scss";
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
  CircularProgress,
  Alert,
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
  const { 
    youthData, 
    fetchYouths,
    destroyYouth,
    loading,
    error,
    success
  } = useYouth();

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

  // FIX: youthData is now an array, not an object with .youth property
  const rows = useMemo(() => {
  if (!Array.isArray(youthData)) return [];
  
  return youthData.map((y) => ({
    id: y.youth_id, // This will be used as row.id
    name: y.full_name || "N/A", // This will be row.name
    email: y.email || "N/A", // This will be row.email
    registered: y.registered_voter === true || 
               y.registered_voter === "yes" || 
               String(y.registered_voter).toLowerCase() === "true", // This will be row.registered (boolean)
    verified: y.verified || false, // This will be row.verified (boolean)
    age: y.age || "N/A", // This will be row.age
    gender: y.gender || "N/A", // This will be row.gender
    purok: y.purok || "N/A", // This will be row.purok
    // Store original data for export
    originalData: y
  }));
}, [youthData]);

  const filteredRows = useMemo(() => {
    let r = [...rows];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      r = r.filter(
        (y) =>
          y.name.toLowerCase().includes(searchLower) ||
          y.email.toLowerCase().includes(searchLower) ||
          y.purok.toLowerCase().includes(searchLower)
      );
    }
    
    // Voter registration filter
    if (filter === "registered") {
      r = r.filter((y) => y.registered);
    } else if (filter === "unregistered") {
      r = r.filter((y) => !y.registered);
    }
    
    // Verification filter
    if (verifiedFilter !== "all") {
      r = r.filter((y) =>
        verifiedFilter === "yes" ? y.verified : !y.verified
      );
    }
    
    // Gender filter
    if (genderFilter !== "all") {
      r = r.filter((y) => y.gender.toLowerCase() === genderFilter.toLowerCase());
    }
    
    // Purok filter
    if (purokFilter !== "all") {
      r = r.filter((y) => y.purok === purokFilter);
    }
    
    // Sort
    return r.sort(getComparator(order, orderBy));
  }, [
    rows,
    search,
    filter,
    verifiedFilter,
    genderFilter,
    purokFilter,
    order,
    orderBy,
  ]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = useMemo(() => {
    const maleCount = rows.filter((y) => y.gender?.toLowerCase() === "male").length;
    const femaleCount = rows.filter((y) => y.gender?.toLowerCase() === "female").length;
    
    return {
      total: rows.length,
      registered: rows.filter((y) => y.registered).length,
      verified: rows.filter((y) => y.verified).length,
      male: maleCount,
      female: femaleCount,
    };
  }, [rows]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0);
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

  const handleSelectAllClick = (selectedIds) => setSelected(selectedIds);
  
  const handleRowClick = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleRequestSort = (newOrder, newOrderBy) => {
    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selected.length} youth member(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      // Delete each selected youth
      const deletePromises = selected.map(youthId => destroyYouth(youthId));
      await Promise.all(deletePromises);
      
      // Refresh the list
      await fetchYouths();
      
      // Clear selection
      setSelected([]);
      
    } catch (err) {
      console.error('Error deleting youth:', err);
      // Error will be shown from useYouth hook
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Youth Member",
      "Email",
      "Voting Status",
      "Verification",
      "Age",
      "Gender",
      "Purok",
      "Registered Voter",
      "Verified Status",
      "Region",
      "Province",
      "Municipality",
      "Barangay"
    ];
    
    const csvRows = [headers.join(",")];
    
    // Use filtered rows for export
    filteredRows.forEach((row) => {
      const original = row.originalData || {};
      csvRows.push(
        [
          `"${row.name}"`,
          `"${row.email}"`,
          row.registered ? "Registered" : "Unregistered",
          row.verified ? "Verified" : "Unverified",
          row.age,
          row.gender,
          row.purok,
          original.registered_voter || "",
          original.verified || "",
          original.region || "",
          original.province || "",
          original.municipality || "",
          original.barangay || ""
        ].join(",")
      );
    });
    
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `youth_data_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const isSelected = (id) => selected.includes(id);

  const StatCard = ({ icon, title, value, color }) => (
    <Card
      sx={{
        p: 2,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
          color,
          0.05
        )} 100%)`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading youth data: {error}
          <Button onClick={fetchYouths} sx={{ ml: 2 }} size="small">
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <div className={style.youthContainer}>
      {/* Header Section */}
      <div className={style.youthHeader}>
        <article className={style.youthArticle}>
          <h1 className={style.youthTitle}>Youths</h1>
          <h4 className={style.youthSubTitle}>
            Manage your youths status and view their details.
          </h4>
        </article>

        {/* Statistics Section */}
        <div className={style.statsSection}>
          <div className={style.statsHeader}>
            <Grid container spacing={3} className={style.statsGrid}>
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

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              className={style.toolbarButton}
            >
              <span className={style.addLabelDesktop}>Add Youth</span>
              <span className={style.addLabelMobile}>Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Alert 
          severity="success" 
          onClose={() => {}} // You might want to clear success message
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* Toolbar */}
      <Toolbar className={style.toolbarSection}>
        <div className={style.toolbarInner}>
          {/* Filter Button */}
          <IconButton
            onClick={() => setSidebarOpen(true)}
            className={style.filterButton}
          >
            <FilterListIcon />
          </IconButton>

          {/* Search Input */}
          <TextField
            size="small"
            placeholder="Search by name, email, or purok..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={style.toolbarSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Actions */}
          <div className={style.toolbarActions}>
            <div className={style.exportGroup}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportToCSV}
                className={`${style.toolbarButton} ${style.exportButton}`}
                disabled={filteredRows.length === 0}
              >
                Export ({filteredRows.length})
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={selected.length === 0}
                onClick={handleDeleteSelected}
                className={`${style.toolbarButton} ${style.deleteButton}`}
              >
                Delete ({selected.length})
              </Button>
            </div>
          </div>
        </div>
      </Toolbar>

      {/* Main Content */}
      <div className={style.youthMain}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={dense}
                  onChange={(e) => setDense(e.target.checked)}
                />
              }
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
      </div>

      {/* Filter Sidebar */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
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
    </div>
  );
}

export default YouthPage;