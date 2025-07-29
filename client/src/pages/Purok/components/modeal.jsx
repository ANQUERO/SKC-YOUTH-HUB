import { Modal, Box, Typography, TextField, Button } from '@mui/material';

export default function PurokModal({ open, onClose, onSave, name, setName, editing, loading }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: 400,
                bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
            }}>
                <Typography variant="h6" gutterBottom>
                    {editing ? 'Edit Purok' : 'Create New Purok'}
                </Typography>
                <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Purok Name"
                    margin="normal"
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" onClick={onSave} disabled={loading}>
                        {loading ? 'Saving...' : editing ? 'Update' : 'Save'}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}
