import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useOfficials from '@hooks/useOfficials';

const Officials = () => {
    const { officials, loading, error, fetchOfficials, fetchOfficialById, official } = useOfficials();
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchOfficials();
    }, []);

    const handleSelectOfficial = async (admin_id) => {
        setSelectedId(admin_id);
        await fetchOfficialById(admin_id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <Wrapper>
            <Title>SK Youth Officials</Title>

            {loading && <Message>Loading...</Message>}
            {error && <ErrorText>{error}</ErrorText>}

            <List>
                {officials.map((official) => (
                    <Card key={official.admin_id} onClick={() => handleSelectOfficial(official.admin_id)}>
                        <AvatarLarge src="/default-avatar.png" alt="Avatar" />
                        <CardContent>
                            <Name>{[official.first_name, official.last_name].filter(Boolean).join(' ')}</Name>
                            <Info>{official.position || 'SK Official'}</Info>
                        </CardContent>
                    </Card>
                ))}
            </List>

            {showModal && official && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{official.full_name}</ModalTitle>
                        <Detail><strong>Email:</strong> {official.email}</Detail>
                        <Detail><strong>FullName:</strong> {[official.first_name, official.last_name].filter(Boolean).join(' ')}</Detail>
                        <Detail><strong>Role:</strong> {official.role}</Detail>
                        {official.position && <Detail><strong>Position:</strong> {official.position}</Detail>}
                        <CloseButton onClick={closeModal}>Close</CloseButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    );
};

export default Officials;


const Wrapper = styled.div`
    padding: 2rem;
    max-width: 900px;
    margin: auto;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
`;

const Message = styled.p`
    font-size: 1rem;
    color: #555;
`;

const ErrorText = styled.p`
    font-size: 1rem;
    color: red;
`;

const List = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
`;

const Card = styled.div`
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;

    &:hover {
        transform: translateY(-5px);
        background-color: #f3f4f6;
    }
`;

const CardContent = styled.div`
    text-align: center;
`;

const Name = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
`;

const Info = styled.p`
    font-size: 0.95rem;
    color: #333;
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    max-width: 500px;
    width: 90%;
    position: relative;
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const Detail = styled.p`
    margin: 0.5rem 0;
    font-size: 1rem;
`;

const CloseButton = styled.button`
    background: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
        background: #dc2626;
    }
`;

const AvatarLarge = styled.img`
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #ddd;
    margin-bottom: 1rem;
`;

