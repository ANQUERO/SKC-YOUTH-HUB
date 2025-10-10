import React from 'react';
import Modal from 'react-modal';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  X,
  Download,
  User,
  MapPin,
  School,
  Briefcase ,
  Vote,
  Calendar,
  Mail,
  Home,
  IdCard,
} from 'lucide-react';

const YouthDetailModal = ({ 
  isOpen, 
  onRequestClose, 
  youth, 
  onVerify, 
  onDelete, 
  isDraft 
}) => {
  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.file_url;
    link.download = file.file_name;
    link.target = '_blank';
    link.click();
  };

  const getFullName = () => {
    if (!youth) return '';
    return `${youth.suffix ? `${youth.suffix}. ` : ''}${youth.first_name} ${youth.middle_name || ''} ${youth.last_name}`.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const modalStyles = {
    content: {
      maxWidth: '1400px',
      width: '95%',
      margin: 'auto',
      borderRadius: '12px',
      padding: '0',
      border: 'none',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxHeight: '95vh',
      overflow: 'hidden',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1300,
    },
  };

  const InfoCard = ({ icon: Icon, title, children, span = 1 }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%',
        gridColumn: `span ${span}`,
      }}
    >
      <CardContent sx={{ padding: 2, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
          <Icon size={18} color="#666" />
          <Typography variant="subtitle2" fontWeight="600">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ label, value, size = 'normal' }) => (
    <Box sx={{ marginBottom: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography 
        variant={size === 'small' ? 'body2' : 'body1'} 
        color="text.primary"
        sx={{ lineHeight: 1.3 }}
      >
        {value || 'Not provided'}
      </Typography>
    </Box>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Youth Details"
      ariaHideApp={false}
      style={modalStyles}
    >
      {youth ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Paper sx={{ 
            padding: 3, 
            borderBottom: 1, 
            borderColor: 'divider', 
            backgroundColor: 'background.default',
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: 2,
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {getFullName()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={youth.verified ? 'Verified' : 'Unverified'}
                    size="small"
                    color={youth.verified ? 'success' : 'warning'}
                    variant="outlined"
                  />
                  {isDraft && (
                    <Chip
                      label="Deleted"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Joined {formatDate(youth.created_at)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {youth.email}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {!isDraft && !youth.verified && onVerify && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => onVerify(youth.youth_id)}
                    startIcon={<Vote size={16} />}
                  >
                    Verify Account
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(youth.youth_id)}
                  >
                    {isDraft ? 'Delete Permanently' : 'Move to Drafts'}
                  </Button>
                )}
                <IconButton onClick={onRequestClose} size="large">
                  <X size={24} />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Main Content - Horizontal Layout */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: 3,
            backgroundColor: 'background.default',
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 3,
              height: '100%',
              alignItems: 'start',
            }}>
              
              {/* Column 1: Personal Information */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoCard icon={User} title="Personal Info">
                  <InfoItem label="Full Name" value={getFullName()} />
                  <InfoItem label="Gender" value={youth.gender} />
                  <InfoItem label="Birthday" value={formatDate(youth.birthday)} />
                  <InfoItem label="Age" value={youth.age?.toString()} />
                  <InfoItem label="Civil Status" value={youth.civil_status} />
                </InfoCard>

                <InfoCard icon={IdCard} title="Youth Classification">
                  <InfoItem label="Age Gap" value={youth.youth_age_gap} />
                  <InfoItem label="Classification" value={youth.youth_classification} />
                </InfoCard>
              </Box>

              {/* Column 2: Contact & Address */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoCard icon={Mail} title="Contact Information">
                  <InfoItem label="Email" value={youth.email} />
                  <InfoItem label="Contact Number" value={youth.contact_number} />
                </InfoCard>

                <InfoCard icon={MapPin} title="Address Details">
                  <InfoItem label="Region" value={youth.region} />
                  <InfoItem label="Province" value={youth.province} />
                  <InfoItem label="Municipality" value={youth.municipality} />
                  <InfoItem label="Barangay" value={youth.barangay} />
                  <InfoItem label="Purok" value={youth.purok} size="small" />
                </InfoCard>
              </Box>

              {/* Column 3: Education, Work & Voting */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoCard icon={School} title="Education">
                  <InfoItem label="Educational Background" value={youth.educational_background} />
                </InfoCard>

                <InfoCard icon={Briefcase } title="Employment">
                  <InfoItem label="Work Status" value={youth.work_status} />
                </InfoCard>

                <InfoCard icon={Vote} title="Voting Information">
                  <InfoItem label="Registered Voter" value={youth.registered_voter} />
                  <InfoItem label="National Voter" value={youth.registered_national_voter} />
                  <InfoItem label="Voted Last Election" value={youth.vote_last_election} />
                </InfoCard>
              </Box>

              {/* Column 4: Meetings & Attachments */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InfoCard icon={Calendar} title="Meeting Attendance">
                  <InfoItem 
                    label="Attended Meetings" 
                    value={youth.attended ? 'Yes' : 'No'} 
                  />
                  <InfoItem 
                    label="Times Attended" 
                    value={youth.times_attended?.toString()} 
                  />
                  <InfoItem 
                    label="Reason for Not Attending" 
                    value={youth.reason_not_attend} 
                    size="small"
                  />
                </InfoCard>

                {youth.households?.length > 0 && (
                  <InfoCard icon={Home} title="Households">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {youth.households.map((household, index) => (
                        <Chip
                          key={index}
                          label={household.household}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </InfoCard>
                )}

                <InfoCard icon={Download} title="Attachments">
                  {youth.attachments?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {youth.attachments.map((file, index) => (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{
                            padding: 1.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': { backgroundColor: 'action.hover' },
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="500" noWrap>
                              {file.file_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {file.file_type}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(file)}
                            color="primary"
                          >
                            <Download size={16} />
                          </IconButton>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No attachments
                    </Typography>
                  )}
                </InfoCard>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
        }}>
          <Typography variant="body1">Loading youth details...</Typography>
        </Box>
      )}
    </Modal>
  );
};

export default YouthDetailModal;