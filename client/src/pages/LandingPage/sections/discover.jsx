import React from 'react';
import styles from '@styles/landingpage.module.scss';
import Card1 from '@images/card1.png';
import Card2 from '@images/card2.png';

const Taglines = ({ title, paragraphs }) => {
    return (
        <>
            <h1 className={styles.title}>
                {title}
            </h1>
            <p className={styles.paragraphs}>
                {paragraphs}
            </p>
        </>
    );
};

const DiscoverCard = ({ image, title, date, isWide = false }) => {
    return (
        <div className={`${styles.card} ${isWide ? styles.wide : ''}`}>
            <img src={image} alt={title} />
            <div className={styles.cardContent}>
                <h3>{title}</h3>
                <div className={styles.date}>{date}</div>
            </div>
        </div>
    );
};

const Discover = () => {
    const cardData = [
        {
            id: 1,
            image: Card1,
            title: "SGSSSOORN BAZOR-OPLAN BAGGING",
            date: "January 1, Caterman",
            isWide: true
        },
        {
            id: 2,
            image: Card2,
            title: "SUPST",
            date: "January 1, Caterman"
        },
        {
            id: 3,
            image: Card1,
            title: "History",
            date: "January 1, Caterman"
        },
        {
            id: 4,
            image: Card2,
            title: "Community Activities & Events",
            date: "January 1, Caterman",
            isWide: true
        },

    ];

    return (
        <section className={styles.discover} id='discover'>
            <div className={styles.container}>
                <Taglines
                    title="DISCOVER"
                    paragraphs="Discover the history that built our SK Federation, the struggles and 
                    triumphs that shaped who we are today. Celebrate the community and the amazing 
                    people who continue to inspire change and create a brighter future."
                />

                <div className={styles.cards}>
                    {cardData.map((card) => (
                        <DiscoverCard
                            key={card.id}
                            image={card.image}
                            title={card.title}
                            date={card.date}
                            isWide={card.isWide}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Discover;