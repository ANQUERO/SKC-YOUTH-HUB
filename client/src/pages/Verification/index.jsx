import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Menu, MenuItem, Typography, CircularProgress,
  TablePagination, TableSortLabel, Button
} from '@mui/material';
import { Ellipsis } from 'lucide-react'
import useVerification from '@hooks/useVerification';
import YouthDetailModal from './components/detailModal';

const Verification = () => {
  const {
    youthData,
    youthDetails,
    loading,
    error,
    fetchUnverifiedYouths,
    fetchYouthDetails,
    verifyYouth,
    deleteSignup,
    fetchDeletedYouths
  } = useVerification();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuYouthId, setMenuYouthId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    showDrafts ? fetchDeletedYouths() : fetchUnverifiedYouths();
  }, [showDrafts]);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuYouthId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuYouthId(null);
  };

  const handleView = async (id) => {
    await fetchYouthDetails(id);
    setDetailModalOpen(true);
    handleMenuClose();
  };

  const handleVerify = async (id) => {
    await verifyYouth(id);
    fetchUnverifiedYouths();
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    await deleteSignup(id);
    fetchUnverifiedYouths();
    handleMenuClose();
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = [...youthData].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (order === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" mb={2}>Youth {showDrafts ? 'Drafts' : 'Unverified'}</Typography>

      <Button variant="outlined" onClick={() => setShowDrafts(!showDrafts)}>
        {showDrafts ? 'Show Unverified' : 'Show Drafts'}
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && youthData.length === 0 && (
        <Typography mt={2}>No {showDrafts ? 'deleted' : 'unverified'} youth found.</Typography>
      )}

      {youthData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'created_at'}
                    direction={orderBy === 'created_at' ? order : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Joined
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((youth) => (
                <TableRow key={youth.youth_id}>
                  <TableCell>
                    {youth.suffix ? `${youth.suffix}. ` : ''}{youth.first_name} {youth.middle_name || ''} {youth.last_name}
                  </TableCell>
                  <TableCell>{youth.email}</TableCell>
                  <TableCell>{new Date(youth.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, youth.youth_id)}>
                      <Ellipsis />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={youthData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleView(menuYouthId)}>View</MenuItem>
        {!showDrafts && <MenuItem onClick={() => handleVerify(menuYouthId)}>Verify</MenuItem>}
        <MenuItem onClick={() => handleDelete(menuYouthId)}>Delete</MenuItem>
      </Menu>

      <YouthDetailModal
        isOpen={detailModalOpen}
        onRequestClose={() => setDetailModalOpen(false)}
        youth={youthDetails}
      />
    </Paper>
  );
};

export default Verification;
