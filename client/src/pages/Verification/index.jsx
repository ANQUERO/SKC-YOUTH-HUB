import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useVerification from '@hooks/useVerification';
import { Ellipsis } from 'lucide-react';

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

const Button = styled.button`
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background-color: #22c55e;
    color: white;

    &:hover {
      background-color: #16a34a;
    }
  `
      : `
    background-color: #e5e7eb;
    color: #1f2937;

    &:hover {
      background-color: #d1d5db;
    }
  `}
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


const Verification = () => {
  const {
    youthData,
    loading,
    error,
    fetchUnverefiedYouths,
    verifyYouth,
  } = useVerification();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchUnverefiedYouths();
  }, []);

  const handleVerify = async (id) => {
    await verifyYouth(id);
    fetchUnverefiedYouths(); // Refresh list
  };

  return (
    <Container>
      <Title>Unverified Youth</Title>

      {loading && <Message type="loading">Loading...</Message>}
      {error && <Message type="error">{error}</Message>}

      {youthData?.youth?.length === 0 && !loading ? (
        <Message>No unverified youth found.</Message>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th><Checkbox /></Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Joined</Th> {/* ← previously missing */}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {youthData?.youth?.map((youth) => (
              <Tr key={youth.youth_id}>
                <Td><Checkbox /></Td>
                <Td>{youth.first_name} {youth.last_name}</Td>
                <Td>{youth.email}</Td>
                <Td>{new Date(youth.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}</Td>
                <Td>
                  <MenuWrapper>
                    <MenuButton onClick={() => setOpenId(youth.youth_id === openId ? null : youth.youth_id)}>
                      <Ellipsis />
                    </MenuButton>
                    <Dropdown open={youth.youth_id === openId}>
                      <DropdownItem onClick={() => handleVerify(youth.youth_id)}>Verify</DropdownItem>
                      <DropdownItem>View</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </MenuWrapper>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
};

export default Verification;
