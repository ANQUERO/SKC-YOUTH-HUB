import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Menu, MenuItem, Typography, CircularProgress,
  TablePagination, TableSortLabel, Button, Box, Chip, Alert,
  Card, CardContent, Grid, TextField, InputAdornment, Tooltip
} from '@mui/material';
import {
  EllipsisVertical, Search, Eye, CheckCircle, Trash2, 
  RefreshCw, Filter, UserCheck, UserX, Calendar
} from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setActionLoading(id);
    await verifyYouth(id);
    await fetchUnverifiedYouths();
    setActionLoading(null);
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    await deleteSignup(id);
    showDrafts ? await fetchDeletedYouths() : await fetchUnverifiedYouths();
    setActionLoading(null);
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

  const handleRefresh = () => {
    showDrafts ? fetchDeletedYouths() : fetchUnverifiedYouths();
  };

  // Filter and sort data
  const filteredAndSortedData = youthData
    .filter(youth => 
      youth.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (order === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const getFullName = (youth) => {
    return `${youth.suffix ? `${youth.suffix}. ` : ''}${youth.first_name} ${youth.middle_name || ''} ${youth.last_name}`.trim();
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Youth Verification
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and verify youth registrations
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant={showDrafts ? "outlined" : "contained"}
                startIcon={<UserCheck size={20} />}
                onClick={() => setShowDrafts(false)}
              >
                Unverified ({youthData.filter(y => !showDrafts).length})
              </Button>
              <Button
                variant={showDrafts ? "contained" : "outlined"}
                startIcon={<UserX size={20} />}
                onClick={() => setShowDrafts(true)}
              >
                Drafts ({youthData.filter(y => showDrafts).length})
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats and Search Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
            <Tooltip title="Refresh data">
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={loading}
                startIcon={<RefreshCw size={20} />}
                sx={{ flex: 1 }}
              >
                Refresh
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedData.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <UserX size={48} color="#ccc" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No {showDrafts ? 'deleted' : 'unverified'} youth found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'All youth accounts are verified'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {!loading && filteredAndSortedData.length > 0 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'first_name'}
                      direction={orderBy === 'first_name' ? order : 'asc'}
                      onClick={() => handleSort('first_name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'created_at'}
                      direction={orderBy === 'created_at' ? order : 'asc'}
                      onClick={() => handleSort('created_at')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} />
                        Joined
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((youth) => (
                    <TableRow 
                      key={youth.youth_id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleView(youth.youth_id)}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {getFullName(youth)}
                          </Typography>
                          {showDrafts && (
                            <Chip 
                              label="Deleted" 
                              size="small" 
                              color="error" 
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {youth.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {getTimeAgo(youth.created_at)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(youth.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {!showDrafts && (
                            <Tooltip title="Verify">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerify(youth.youth_id);
                                }}
                                disabled={actionLoading === youth.youth_id}
                              >
                                {actionLoading === youth.youth_id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <CheckCircle size={20} />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="View details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(youth.youth_id);
                              }}
                            >
                              <Eye size={20} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="More options">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, youth.youth_id);
                              }}
                            >
                              <EllipsisVertical size={20} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAndSortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />
        </Card>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem 
          onClick={() => handleView(menuYouthId)}
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <Eye size={16} />
          View Details
        </MenuItem>
        {!showDrafts && (
          <MenuItem 
            onClick={() => handleVerify(menuYouthId)}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <CheckCircle size={16} />
            Verify Account
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => handleDelete(menuYouthId)}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}
        >
          <Trash2 size={16} />
          {showDrafts ? 'Permanently Delete' : 'Move to Drafts'}
        </MenuItem>
      </Menu>

      {/* Detail Modal */}
      <YouthDetailModal
        isOpen={detailModalOpen}
        onRequestClose={() => setDetailModalOpen(false)}
        youth={youthDetails}
        onVerify={handleVerify}
        onDelete={handleDelete}
        isDraft={showDrafts}
      />
    </Box>
  );
};

export default Verification;