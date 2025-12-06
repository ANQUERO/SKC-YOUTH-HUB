import React, { useEffect, useState } from 'react';
import useOfficials from '@hooks/useOfficials';
import styles from '@styles/official.module.scss';

const Officials = () => {
    const {
        officials,
        loading,
        error,
        fetchOfficials,
        fetchOfficialById,
        official,
        isAuthorized
    } = useOfficials();
    
    const [showModal, setShowModal] = useState(false);
    const [, setSelectedId] = useState(null);

    useEffect(() => {
        fetchOfficials();
    }, []);

    const handleSelectOfficial = async (official_id) => {
        try {
            setSelectedId(official_id);
            await fetchOfficialById(official_id);
            setShowModal(true);
        } catch (err) {
            console.error('Error selecting official:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    // Enhanced debugging function
    const getProfilePicture = (officialData, index = 'unknown') => {
        if (!officialData) {
            console.log(`No official data for index ${index}`);
        }
        // Check multiple possible locations for profile picture
        const picture = 
            officialData.profile_picture ||
            officialData.account?.profile_picture ||
            officialData.avatar_url
        
        return picture;
    };

    const getFullName = (official) => {
        if (!official) return 'Unknown Official';
        
        // Try different name formats
        if (official.full_name) return official.full_name;
        if (official.name) return official.name;
        
        // Construct from name parts
        const nameParts = [];
        if (official.first_name) nameParts.push(official.first_name);
        if (official.middle_name) nameParts.push(official.middle_name);
        if (official.last_name) nameParts.push(official.last_name);
        if (official.suffix) nameParts.push(official.suffix);
        
        return nameParts.length > 0 ? nameParts.join(' ') : 'Unknown Official';
    };

    const getPosition = (official) => {
        if (!official) return 'SK Official';
        return official.position || official.official_position || official.role || 'SK Official';
    };

    const getEmail = (official) => {
        if (!official) return 'No email';
        return official.email || official.account?.email || 'No email';
    };

    const getRole = (official) => {
        if (!official) return 'No role';
        return official.role || 'No role';
    };

    // If not authorized
    if (!isAuthorized) {
        return (
            <div className={styles.officials_wrapper}>
                <h1 className={styles.officials_title}>SK Youth Officials</h1>
                <p className={styles.officials_error}>
                    You are not authorized to view officials.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.officials_wrapper}>
            <h1 className={styles.officials_title}>SK Youth Officials</h1>

            {loading && officials.length === 0 && (
                <p className={styles.officials_message}>Loading officials...</p>
            )}
            
            {error && (
                <div className={styles.officials_error}>
                    Error: {error}
                    <button 
                        onClick={fetchOfficials}
                        className={styles.retry_button}
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && officials.length === 0 && !error && (
                <p className={styles.officials_message}>
                    No officials found.
                </p>
            )}

            <div className={styles.officials_list}>
                {officials.map((officialItem, index) => {
                    const fullName = getFullName(officialItem);
                    const position = getPosition(officialItem);
                    const profilePicture = getProfilePicture(officialItem, index);

                    return (
                        <div
                            key={officialItem.official_id || officialItem.id || index}
                            className={styles.official_card}
                            onClick={() => handleSelectOfficial(officialItem.official_id || officialItem.id)}
                        >
                            <img
                                className={styles.avatar_large}
                                src={profilePicture}
                                alt={fullName}
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                    e.target.onerror = null;
                                }}
                                onLoad={(e) => {
                                    console.log(`Image loaded for ${fullName}:`, e.target.src);
                                }}
                            />
                            <div className={styles.card_content}>
                                <h2 className={styles.official_name}>
                                    {fullName}
                                </h2>
                                <p className={styles.official_info}>
                                    {position}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && official && (
                <div className={styles.modal_overlay} onClick={closeModal}>
                    <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                        <button 
                            className={styles.close_button}
                            onClick={closeModal}
                        >
                            Close
                        </button>
                        
                        <img
                            className={styles.avatar_large}
                            src={getProfilePicture(official, 'modal')}
                            alt={getFullName(official)}
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                        
                        <h2 className={styles.modal_title}>{getFullName(official)}</h2>
                        
                        <div className={styles.modal_details}>
                            <p className={styles.modal_detail}>
                                <strong>Email:</strong> {getEmail(official)}
                            </p>
                            <p className={styles.modal_detail}>
                                <strong>Position:</strong> {getPosition(official)}
                            </p>
                            <p className={styles.modal_detail}>
                                <strong>Role:</strong> {getRole(official)}
                            </p>
                            
                            {/* Additional optional fields */}
                            {official.contact_number && (
                                <p className={styles.modal_detail}>
                                    <strong>Contact:</strong> {official.contact_number}
                                </p>
                            )}
                            
                            {official.gender && (
                                <p className={styles.modal_detail}>
                                    <strong>Gender:</strong> {official.gender}
                                </p>
                            )}
                            
                            {official.age && (
                                <p className={styles.modal_detail}>
                                    <strong>Age:</strong> {official.age}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Officials;