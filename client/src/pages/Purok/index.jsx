import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import usePurok from '@hooks/usePurok';

const Purok = () => {
    const {
        puroks,
        loading,
        error,
        fetchPuroks,
        deletePurok,
        createPurok,
        updatePurok,
    } = usePurok();

    const [showModal, setShowModal] = useState(false);
    const [newPurokName, setNewPurokName] = useState('');
    const [editingPurok, setEditingPurok] = useState(null);

    useEffect(() => {
        fetchPuroks();
    }, []);

    const handleDelete = async (purok_id) => {
        if (confirm("Are you sure you want to delete this purok?")) {
            await deletePurok(purok_id);
        }
    };

    const handleSave = async () => {
        if (!newPurokName.trim()) return;

        if (editingPurok) {
            await updatePurok(editingPurok.purok_id, newPurokName);
        } else {
            await createPurok(newPurokName);
        }

        setNewPurokName('');
        setEditingPurok(null);
        setShowModal(false);
    };

    const handleEdit = (purok) => {
        setEditingPurok(purok);
        setNewPurokName(purok.name);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setNewPurokName('');
        setEditingPurok(null);
    };

    return (
        <Wrapper>
            <Title>Purok</Title>
            <Subtitle>Manage your purok</Subtitle>

            <TopBar>
                <CreateButton onClick={() => {
                    setShowModal(true);
                    setEditingPurok(null);
                    setNewPurokName('');
                }}>
                    + New Purok
                </CreateButton>
            </TopBar>

            {loading && <Message>Loading...</Message>}
            {error && <ErrorText>{error}</ErrorText>}

            <List>
                {puroks.map((purok) => (
                    <ListItem key={purok.purok_id}>
                        <span>{purok.name}</span>
                        <ButtonGroup>
                            <EditButton onClick={() => handleEdit(purok)}>Edit</EditButton>
                            <DeleteButton onClick={() => handleDelete(purok.purok_id)}>Delete</DeleteButton>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>

            {/* Modal */}
            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>{editingPurok ? 'Edit Purok' : 'Create New Purok'}</h3>
                        <Input
                            type="text"
                            value={newPurokName}
                            onChange={(e) => setNewPurokName(e.target.value)}
                            placeholder="Enter purok name"
                        />
                        <ModalActions>
                            <SaveButton onClick={handleSave}>
                                {editingPurok ? 'Update' : 'Save'}
                            </SaveButton>
                            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    );
};

export default Purok;


const Wrapper = styled.div`
  padding: 2rem;
  max-width: 700px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const CreateButton = styled.button`
  background: #10b981;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #333;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin: 1rem 0;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;

  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  color: #333;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;

  &:hover {
    background: #d1d5db;
  }
`;
