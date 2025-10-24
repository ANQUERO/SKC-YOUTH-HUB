import React, { useState, useRef, useEffect } from 'react';
import style from '@styles/landingpage.module.scss';

const Organizations = () => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    const organizations = [
        {
            name: "CYMWA",
            fullName: "Purok 1 CATARMAN YOUNG MEN & WOMEN ASSOCIATION",
            description: "Youth organization focused on community development and empowerment"
        },
        {
            name: "PYCC",
            fullName: "Purok 2 Youth Coordinating Council",
            description: "Coordinating body for youth activities and initiatives"
        },
        {
            name: "AYOS",
            fullName: "Active Youth of Sudlon",
            description: "Promoting active participation in community affairs"
        },
        {
            name: "CYU",
            fullName: "Cansipak Youth Uswagon",
            description: "Youth group dedicated to progress and development"
        },
        {
            name: "SYA",
            fullName: "Sambagan Youth Association",
            description: "Association fostering youth leadership and cooperation"
        },
        {
            name: "UYPO",
            fullName: "United Youth of Purok 6 Organization",
            description: "Uniting youth for common goals and community service"
        }
    ];

    const duplicatedOrgs = [...organizations, ...organizations];

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    const handleOrgClick = (org) => {
        // You can add functionality here like opening a modal or navigating to details
        console.log('Organization clicked:', org);
    };

    return (
        <section className={style.organizations} id='organizations'>
            <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>Our Partner Organizations</h2>
                <p className={style.sectionSubtitle}>
                    Collaborating with youth organizations across the community
                </p>
            </div>

            <div className={style.scrollWrapper}>
                <div 
                    className={style.scrollContainer}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={scrollRef}
                >
                    <div 
                        className={`${style.scrollContent} ${isPaused ? style.paused : ''}`}
                    >
                        {duplicatedOrgs.map((org, index) => (
                            <div
                                key={index}
                                className={style.orgCard}
                                onClick={() => handleOrgClick(org)}
                            >
                                <div className={style.orgLogo}>
                                    <span className={style.logoText}>
                                        {org.name.charAt(0)}
                                    </span>
                                </div>
                                <div className={style.orgContent}>
                                    <h3 className={style.orgName}>{org.name}</h3>
                                    <p className={style.orgFullName}>{org.fullName}</p>
                                    <p className={style.orgDescription}>{org.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.scrollControls}>
                    <button 
                        className={style.controlBtn}
                        onClick={handleMouseEnter}
                        aria-label="Pause scrolling"
                    >
                        ⏸️
                    </button>
                    <button 
                        className={style.controlBtn}
                        onClick={handleMouseLeave}
                        aria-label="Resume scrolling"
                    >
                        ▶️
                    </button>
                </div>
            </div>

            <div className={style.organizationStats}>
                <div className={style.statItem}>
                    <span className={style.statNumber}>{organizations.length}+</span>
                    <span className={style.statLabel}>Organizations</span>
                </div>
                <div className={style.statItem}>
                    <span className={style.statNumber}>1000+</span>
                    <span className={style.statLabel}>Youth Members</span>
                </div>
                <div className={style.statItem}>
                    <span className={style.statNumber}>50+</span>
                    <span className={style.statLabel}>Projects</span>
                </div>
            </div>
        </section>
    )
}

export default Organizations;