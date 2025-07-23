import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Checkbox, TableSortLabel, Toolbar, Typography, IconButton,
  Tooltip, Switch, FormControlLabel, Button, Modal, TextField, Menu, MenuItem,
  Snackbar, Alert
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import usePurok from '@hooks/usePurok';

const headCells = [
  { id: 'select', numeric: false, disablePadding: true, label: '' },
  { id: 'number', numeric: true, disablePadding: false, label: '#' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Purok Name' },
];

function descendingComparator(a, b, orderBy) {
  return b[orderBy]?.localeCompare(a[orderBy]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ order, orderBy, onRequestSort, onSelectAllClick, rowCount, numSelected }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.slice(1).map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            padding="normal"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

function Purok() {
  const {
    puroks,
    loading,
    error,
    fetchPuroks,
    deletePurok,
    createPurok,
    updatePurok,
  } = usePurok();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [newPurokName, setNewPurokName] = useState('');
  const [editingPurok, setEditingPurok] = useState(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPurok, setSelectedPurok] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPuroks();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = puroks.map((n) => n.purok_id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxClick = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (purok_id) => {
    if (!confirm("Are you sure you want to delete this purok?")) return;
    setActionLoading(true);
    try {
      await deletePurok(purok_id);
      setSnackbar({ open: true, message: 'Purok deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Error deleting purok', severity: 'error' });
    } finally {
      setActionLoading(false);
      setMenuAnchorEl(null);
      setSelectedIds((prev) => prev.filter((id) => id !== purok_id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected purok(s)?`)) return;
    setActionLoading(true);
    try {
      for (const id of selectedIds) {
        await deletePurok(id);
      }
      setSnackbar({ open: true, message: 'Selected purok(s) deleted', severity: 'success' });
      setSelectedIds([]);
    } catch {
      setSnackbar({ open: true, message: 'Error deleting selected purok(s)', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newPurokName.trim()) return;
    setActionLoading(true);
    try {
      if (editingPurok) {
        await updatePurok(editingPurok.purok_id, newPurokName);
        setSnackbar({ open: true, message: 'Purok updated successfully', severity: 'success' });
      } else {
        await createPurok(newPurokName);
        setSnackbar({ open: true, message: 'Purok created successfully', severity: 'success' });
      }
      setNewPurokName('');
      setEditingPurok(null);
      setShowModal(false);
    } catch {
      setSnackbar({ open: true, message: 'Error saving purok', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (purok) => {
    setEditingPurok(purok);
    setNewPurokName(purok.name);
    setShowModal(true);
    setMenuAnchorEl(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewPurokName('');
    setEditingPurok(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => setDense(event.target.checked);

  const handleMenuClick = (event, purok) => {
    setSelectedPurok(purok);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedPurok(null);
    setMenuAnchorEl(null);
  };

  const visibleRows = puroks
    ?.slice()
    ?.sort(getComparator(order, orderBy))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Purok Management
      </Typography>
      <Typography variant="h7" gutterBottom>
        Manage your purok here
      </Typography>
      <Box sx={{ mb: 2, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '.5rem' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleBulkDelete}
          disabled={selectedIds.length === 0 || actionLoading}
        >
          {actionLoading ? 'Deleting...' : 'Delete Selected'}
        </Button>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          + New Purok
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              rowCount={visibleRows.length}
              numSelected={selectedIds.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={row.purok_id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.purok_id)}
                      onChange={() => handleCheckboxClick(row.purok_id)}
                    />
                  </TableCell>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No data found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={puroks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(selectedPurok)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(selectedPurok?.purok_id)}>Delete</MenuItem>
      </Menu>

      <Modal open={showModal} onClose={handleCancel}>
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: 400,
            bgcolor: 'background.paper', p: 4,
            borderRadius: 2, boxShadow: 24
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {editingPurok ? 'Edit Purok' : 'Create New Purok'}
          </Typography>
          <TextField
            fullWidth
            value={newPurokName}
            onChange={(e) => setNewPurokName(e.target.value)}
            label="Purok Name"
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="contained" onClick={handleSave} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : editingPurok ? 'Update' : 'Save'}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Purok;
