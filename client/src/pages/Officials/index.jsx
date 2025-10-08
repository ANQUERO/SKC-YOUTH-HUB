import React, { useEffect, useState } from 'react';
import useOfficials from '@hooks/useOfficials';
import useCurrentUser from '@hooks/useCurrentUser';
import styles from '@styles/official.module.scss';

const Officials = () => {
    const {
        officials,
        loading,
        error,
        fetchOfficials,
        fetchOfficialById,
        official
    } = useOfficials();
    const { userData } = useCurrentUser();
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchOfficials();
    }, []);

    const handleSelectOfficial = async (official_id) => {
        setSelectedId(official_id);
        await fetchOfficialById(official_id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Function to get profile picture URL with fallback
    const getProfilePicture = (official) => {
        // Check for profile_picture in different possible locations
        const profilePicture =
            official.profile_picture ||
            official.account?.profile_picture ||
            '/default-avatar.png';

        return profilePicture;
    };

    return (
        <div className={styles.officials_wrapper}>
            <h1 className={styles.officials_title}>SK Youth Officials</h1>

            {loading && <p className={styles.officials_message}>Loading...</p>}
            {error && <p className={styles.officials_error}>{error}</p>}

            <div className={styles.officials_list}>
                {officials.map((official) => (
                    <div
                        key={official.official_id}
                        className={styles.official_card}
                        onClick={() => handleSelectOfficial(official.official_id)}
                    >
                        <img
                            className={styles.avatar_large}
                            src={getProfilePicture(official)}
                            alt="Avatar"
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                        <div className={styles.card_content}>
                            <h2 className={styles.official_name}>
                                {[official.first_name, official.last_name].filter(Boolean).join(' ')}
                            </h2>
                            <p className={styles.official_info}>
                                {official.position || 'SK Official'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && official && (
                <div className={styles.modal_overlay} onClick={closeModal}>
                    <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                        <img
                            className={styles.avatar_large}
                            src={getProfilePicture(official)}
                            alt="Avatar"
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                        <h2 className={styles.modal_title}>{official.full_name}</h2>
                        <p className={styles.modal_detail}>
                            <strong>Email:</strong> {official.email}
                        </p>
                        <p className={styles.modal_detail}>
                            <strong>FullName:</strong> {[official.first_name, official.last_name].filter(Boolean).join(' ')}
                        </p>
                        <p className={styles.modal_detail}>
                            <strong>Role:</strong> {official.role}
                        </p>
                        {official.position && (
                            <p className={styles.modal_detail}>
                                <strong>Position:</strong> {official.position}
                            </p>
                        )}
                        <button className={styles.close_button} onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Officials;