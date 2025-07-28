import { useEffect } from 'react';
import styled from 'styled-components';
import useVerification from '@hooks/useVerification';

const Container = styled.div`
  padding: 1rem;
  max-width: 1000px;
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

const Verification = () => {
  const { youthData, loading, error, fetchUnverefiedYouths } = useVerification();

  useEffect(() => {
    fetchUnverefiedYouths();
  }, []);

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
              <Th>Age</Th>
              <Th>Gender</Th>
              <Th>Barangay</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {youthData?.youth?.map((youth) => (
              <Tr key={youth.youth_id}>
                <Td><Checkbox /></Td>
                <Td>{youth.first_name} {youth.last_name}</Td>
                <Td>{youth.email}</Td>
                <Td>{youth.age}</Td>
                <Td>{youth.gender}</Td>
                <Td>{youth.barangay}</Td>
                <Td>
                  <Button variant="primary">Verify</Button>{' '}
                  <Button>View</Button>
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
