import React from 'react';
import Modal from 'react-modal';
import { Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';

const YouthDetailModal = ({ isOpen, onRequestClose, youth }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Youth Details"
            ariaHideApp={false}
            style={{
                content: {
                    maxWidth: '1200px',
                    margin: 'auto',
                    borderRadius: '8px',
                    padding: '1.5rem'
                }
            }}
        >
            <Typography variant="h6" gutterBottom>Youth Details</Typography>

            {youth ? (
                <Box>
                    <List dense>
                        <ListItem><ListItemText primary="Name" secondary={`${youth.suffix ? youth.suffix + '. ' : ''}${youth.first_name} ${youth.middle_name || ''} ${youth.last_name}`} /></ListItem>
                        <ListItem><ListItemText primary="Email" secondary={youth.email} /></ListItem>
                        <ListItem><ListItemText primary="Verified" secondary={youth.verified ? 'Yes' : 'No'} /></ListItem>
                        <ListItem><ListItemText primary="Joined" secondary={new Date(youth.created_at).toLocaleString()} /></ListItem>
                        <ListItem><ListItemText primary="Gender" secondary={youth.gender || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Birthday" secondary={youth.birthday ? new Date(youth.birthday).toLocaleDateString() : 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Age" secondary={youth.age ?? 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Contact No." secondary={youth.contact || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Region" secondary={youth.region} /></ListItem>
                        <ListItem><ListItemText primary="Province" secondary={youth.province} /></ListItem>
                        <ListItem><ListItemText primary="Municipality" secondary={youth.municipality} /></ListItem>
                        <ListItem><ListItemText primary="Barangay" secondary={youth.barangay} /></ListItem>
                        <ListItem><ListItemText primary="Purok" secondary={youth.purok || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Civil Status" secondary={youth.civil_status || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Youth Age Gap" secondary={youth.youth_age_gap || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Classification" secondary={youth.youth_classification || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Education" secondary={youth.educational_background || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Work Status" secondary={youth.work_status || 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Registered Voter" secondary={youth.registered_voter} /></ListItem>
                        <ListItem><ListItemText primary="National Voter" secondary={youth.registered_national_voter} /></ListItem>
                        <ListItem><ListItemText primary="Voted Last Election" secondary={youth.vote_last_election} /></ListItem>
                        <ListItem><ListItemText primary="Attended Meetings" secondary={youth.attended ? 'Yes' : 'No'} /></ListItem>
                        <ListItem><ListItemText primary="Times Attended" secondary={youth.times_attended ?? 'N/A'} /></ListItem>
                        <ListItem><ListItemText primary="Reason for Not Attending" secondary={youth.reason_not_attend || 'N/A'} /></ListItem>
                    </List>

                    {youth.households?.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">Households</Typography>
                            <List>
                                {youth.households.map((hh, i) => (
                                    <ListItem key={i}><ListItemText primary={hh.household} /></ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {youth.attachments?.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">Attachments</Typography>
                            <List>
                                {youth.attachments.map((file, i) => (
                                    <ListItem key={i}>
                                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                            {file.file_name} ({file.file_type})
                                        </a>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            ) : (
                <Typography>Loading details...</Typography>
            )}

            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button onClick={onRequestClose} variant="contained">Close</Button>
            </Box>
        </Modal>
    );
};

export default YouthDetailModal;
