import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { Ellipsis } from 'lucide-react';
import useVerification from '@hooks/useVerification';

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

  const [openId, setOpenId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [view, setView] = useState('unverified'); // "unverified" or "deleted"

  useEffect(() => {
    if (view === 'unverified') {
      fetchUnverifiedYouths();
    } else if (view === 'deleted') {
      fetchDeletedYouths();
    }
  }, [view]);

  const handleVerify = async (id) => {
    await verifyYouth(id);
    fetchUnverifiedYouths();
  };

  const handleDelete = async (id) => {
    await deleteSignup(id);
    fetchUnverifiedYouths();
  };

  const handleView = async (id) => {
    await fetchYouthDetails(id);
    setDetailModalOpen(true);
  };

  return (
    <Container>
      <Title>{view === 'unverified' ? 'Unverified Youth' : 'Deleted Youth (Drafts)'}</Title>

      <ButtonRow>
        <ToggleButton
          active={view === 'unverified'}
          onClick={() => setView('unverified')}
        >
          Unverified
        </ToggleButton>
        <ToggleButton
          active={view === 'deleted'}
          onClick={() => setView('deleted')}
        >
          Drafts
        </ToggleButton>
      </ButtonRow>

      {loading && <Message type="loading">Loading...</Message>}
      {error && <Message type="error">{error}</Message>}

      {youthData.length === 0 && !loading ? (
        <Message>No {view === 'unverified' ? 'unverified' : 'deleted'} youth found.</Message>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th><Checkbox /></Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {youthData.map((youth) => (
              <Tr key={youth.youth_id}>
                <Td><Checkbox /></Td>
                <Td>
                  {youth.suffix ? `${youth.suffix}. ` : ''}
                  {youth.first_name} {youth.middle_name || ''} {youth.last_name}
                </Td>
                <Td>{youth.email}</Td>
                <Td>{new Date(youth.created_at).toLocaleString()}</Td>
                <Td>
                  <MenuWrapper>
                    <MenuButton onClick={() => setOpenId(youth.youth_id === openId ? null : youth.youth_id)}>
                      <Ellipsis />
                    </MenuButton>
                    <Dropdown open={youth.youth_id === openId}>
                      {view === 'unverified' && (
                        <>
                          <DropdownItem onClick={() => handleVerify(youth.youth_id)}>Verify</DropdownItem>
                          <DropdownItem onClick={() => handleView(youth.youth_id)}>View</DropdownItem>
                          <DropdownItem onClick={() => handleDelete(youth.youth_id)}>Delete</DropdownItem>
                        </>
                      )}
                      {view === 'deleted' && (
                        <>
                          <DropdownItem onClick={() => handleView(youth.youth_id)}>View</DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </MenuWrapper>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={detailModalOpen}
        onRequestClose={() => setDetailModalOpen(false)}
        contentLabel="Youth Details"
        style={{
          content: {
            maxWidth: '600px',
            margin: 'auto',
            borderRadius: '8px',
            padding: '1.5rem'
          }
        }}
      >
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Youth Details</h3>

        {youthDetails ? (
          <div>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
              <li><strong>Name:</strong> {youthDetails.suffix ? `${youthDetails.suffix}. ` : ''}{youthDetails.first_name} {youthDetails.middle_name || ''} {youthDetails.last_name}</li>
              <li><strong>Email:</strong> {youthDetails.email}</li>
              <li><strong>Verified:</strong> {youthDetails.verified ? 'Yes' : 'No'}</li>
              <li><strong>Joined:</strong> {new Date(youthDetails.created_at).toLocaleString()}</li>
              <li><strong>Gender:</strong> {youthDetails.gender || 'N/A'}</li>
              <li><strong>Birthday:</strong> {youthDetails.birthday ? new Date(youthDetails.birthday).toLocaleDateString() : 'N/A'}</li>
              <li><strong>Age:</strong> {youthDetails.age ?? 'N/A'}</li>
              <li><strong>Contact No.:</strong> {youthDetails.contact || 'N/A'}</li>
              <li><strong>Region:</strong> {youthDetails.region}</li>
              <li><strong>Province:</strong> {youthDetails.province}</li>
              <li><strong>Municipality:</strong> {youthDetails.municipality}</li>
              <li><strong>Barangay:</strong> {youthDetails.barangay}</li>
              <li><strong>Purok:</strong> {youthDetails.purok || 'N/A'}</li>
              <li><strong>Civil Status:</strong> {youthDetails.civil_status || 'N/A'}</li>
              <li><strong>Youth Age Gap:</strong> {youthDetails.youth_age_gap || 'N/A'}</li>
              <li><strong>Classification:</strong> {youthDetails.youth_classification || 'N/A'}</li>
              <li><strong>Education:</strong> {youthDetails.educational_background || 'N/A'}</li>
              <li><strong>Work Status:</strong> {youthDetails.work_status || 'N/A'}</li>
              <li><strong>Registered Voter:</strong> {youthDetails.registered_voter}</li>
              <li><strong>National Voter:</strong> {youthDetails.registered_national_voter}</li>
              <li><strong>Voted Last Election:</strong> {youthDetails.vote_last_election}</li>
              <li><strong>Attended Meetings:</strong> {youthDetails.attended ? 'Yes' : 'No'}</li>
              <li><strong>Times Attended:</strong> {youthDetails.times_attended ?? 'N/A'}</li>
              <li><strong>Reason for Not Attending:</strong> {youthDetails.reason_not_attend || 'N/A'}</li>
            </ul>

            {youthDetails.households?.length > 0 && (
              <>
                <h4 style={{ marginTop: '1rem' }}>Household(s)</h4>
                <ul>
                  {youthDetails.households.map((hh, i) => (
                    <li key={i}>{hh.household}</li>
                  ))}
                </ul>
              </>
            )}

            {youthDetails.attachments?.length > 0 && (
              <>
                <h4 style={{ marginTop: '1rem' }}>Attachments</h4>
                <ul>
                  {youthDetails.attachments.map((file, i) => (
                    <li key={i}>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        {file.file_name} ({file.file_type})
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <p>Loading details...</p>
        )}

        <button
          onClick={() => setDetailModalOpen(false)}
          style={{
            marginTop: '1.5rem',
            background: '#1d4ed8',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </Modal>
    </Container>
  );
};

export default Verification;

const Container = styled.div`
  padding: 1rem;
  max-width: 100rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ButtonRow = styled.div`
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  margin-right: 1rem;
  background: ${({ active }) => (active ? '#1d4ed8' : '#e5e7eb')};
  color: ${({ active }) => (active ? 'white' : '#374151')};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const Message = styled.div`
  color: ${({ type }) =>
    type === 'error' ? '#dc2626' : type === 'loading' ? '#3b82f6' : '#6b7280'};
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background-color: #f9fafb;
  text-align: left;
`;

const Th = styled.th`
  padding: 0.75rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Tbody = styled.tbody`
  background-color: white;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  color: #374151;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
`;

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  line-height: 1;
  color: #6b7280;

  &:hover {
    color: #374151;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 1.8rem;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
  display: ${({ open }) => (open ? 'block' : 'none')};
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-align: left;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;
