import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow,
  TablePagination, Checkbox, Typography, Button, Switch, FormControlLabel,
  Snackbar, Alert, Chip, Card, CardContent, Grid
} from '@mui/material';
import { Ellipsis, Users, UserCheck, UserX, Vote, Mars , Venus  } from 'lucide-react';
import usePurok from '@hooks/usePurok';
import EnhancedTableHead from './components/tableHead';
import PurokActionsMenu from './components/actions';
import PurokModal from './components/modal';

function descendingComparator(a, b, orderBy) {
  return b[orderBy]?.localeCompare(a[orderBy]);
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

const Purok = () => {
  const { puroks, fetchPuroks, deletePurok, createPurok, updatePurok, fetchAllPuroksWithResidents, loading, error } = usePurok();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPurokName, setNewPurokName] = useState('');
  const [editingPurok, setEditingPurok] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPurok, setSelectedPurok] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [puroksWithResidents, setPuroksWithResidents] = useState([]);
  const [showResidents, setShowResidents] = useState(true);

  useEffect(() => {
    fetchPuroks();
    loadPuroksWithResidents();
  }, []);

  const loadPuroksWithResidents = async () => {
    try {
      const data = await fetchAllPuroksWithResidents();
      setPuroksWithResidents(data);
    } catch (error) {
      console.error('Failed to load puroks with residents:', error);
    }
  };

  const dataToShow = showResidents ? puroksWithResidents : puroks;
  const visibleRows = dataToShow
    ?.slice()
    ?.sort(getComparator(order, orderBy))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  const handleSave = async () => {
    if (!newPurokName.trim()) return;
    setActionLoading(true);
    try {
      editingPurok
        ? await updatePurok(editingPurok.purok_id, newPurokName)
        : await createPurok(newPurokName);
      setSnackbar({ open: true, message: editingPurok ? 'Updated' : 'Created', severity: 'success' });
      setShowModal(false);
      setEditingPurok(null);
      setNewPurokName('');
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
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this purok?")) return;
    setActionLoading(true);
    try {
      await deletePurok(id);
      setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected?`)) return;
    setActionLoading(true);
    try {
      for (const id of selectedIds) await deletePurok(id);
      setSnackbar({ open: true, message: 'Bulk deleted', severity: 'success' });
      setSelectedIds([]);
    } catch {
      setSnackbar({ open: true, message: 'Bulk delete error', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMenuClick = (e, purok) => {
    setSelectedPurok(purok);
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedPurok(null);
    setMenuAnchorEl(null);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>

      <Typography variant="h4" gutterBottom>Purok Management</Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant={showResidents ? "contained" : "outlined"}
          onClick={() => setShowResidents(!showResidents)}
          startIcon={<Users />}
        >
          {showResidents ? 'Show Residents Data' : 'Show Basic Data'}
        </Button>

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" onClick={() => setShowModal(true)}>+ New Purok</Button>

          {selectedIds.length > 0 && (
            <Button
              color="error"
              sx={{ border: '1px solid red' }}
              onClick={handleBulkDelete}
              disabled={actionLoading}
            >
              Delete Selected
            </Button>
          )}
        </Box>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Paper>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={(e, prop) => {
                const isAsc = orderBy === prop && order === 'asc';
                setOrder(isAsc ? 'desc' : 'asc');
                setOrderBy(prop);
              }}
              onSelectAllClick={(e) =>
                setSelectedIds(e.target.checked ? (dataToShow?.map((p) => p.purok_id) || []) : [])
              }
              rowCount={visibleRows.length}
              numSelected={selectedIds.length}
              showResidents={showResidents}
            />
            <TableBody>
              {visibleRows.map((row, i) => (
                <TableRow key={row.purok_id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.purok_id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(row.purok_id)
                            ? prev.filter((x) => x !== row.purok_id)
                            : [...prev, row.purok_id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{row.name || row.purok_name}</TableCell>
                  {showResidents && (
                    <>
                      <TableCell align="center">
                        <Chip 
                          icon={<Users size={16} />} 
                          label={row.total_residents || 0} 
                          color="primary" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<UserCheck size={16} />} 
                          label={row.verified_residents || 0} 
                          color="success" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<UserX size={16} />} 
                          label={row.unverified_residents || 0} 
                          color="warning" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<Vote size={16} />} 
                          label={row.registered_voters || 0} 
                          color="info" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Chip 
                            icon={<Mars  size={14} />} 
                            label={row.male_residents || 0} 
                            color="secondary" 
                            size="small"
                            sx={{ minWidth: 'auto' }}
                          />
                          <Chip 
                            icon={<Venus  size={14} />} 
                            label={row.female_residents || 0} 
                            color="secondary" 
                            size="small"
                            sx={{ minWidth: 'auto' }}
                          />
                        </Box>
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <Ellipsis onClick={(e) => handleMenuClick(e, row)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={dataToShow?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <FormControlLabel control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />} label="Dense padding" />

      <PurokActionsMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onEdit={() => handleEdit(selectedPurok)}
        onDelete={() => handleDelete(selectedPurok?.purok_id)}
      />

      <PurokModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setNewPurokName('');
          setEditingPurok(null);
        }}
        onSave={handleSave}
        name={newPurokName}
        setName={setNewPurokName}
        editing={!!editingPurok}
        loading={actionLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Purok;
