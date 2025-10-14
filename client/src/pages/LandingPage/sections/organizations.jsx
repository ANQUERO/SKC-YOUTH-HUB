import React from 'react';
import style from '@styles/landingpage.module.scss';

const Organizations = () => {
    const organizations = [
        "CYMWA- Purok 1 CATARMAN YOUNG MEN & WOMEN ASSOCIATION",
        "PYCC - Purok 2 Youth Coordinating Council",
        "AYOS - Active Youth of Sudlon",
        "CYU - Cansipak Youth Uswagon",
        "SYA - Sambagan Youth Association",
        "UYPO - United Youth of Purok 6 Organization"
    ];

    const duplicatedOrgs = [...organizations, ...organizations];

    return (
        <section className={style.organizations} id='organizations'>
            <div className={style.scrollContainer}>
                <div className={style.scrollContent}>
                    {duplicatedOrgs.map((org, index) => (
                        <div
                            key={index}
                            className={style.orgItem}
                        >
                            {org}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Organizations