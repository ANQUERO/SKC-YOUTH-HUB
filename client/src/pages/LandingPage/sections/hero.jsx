import React from 'react';
import style from '@styles/landingpage.module.scss';
import Card1 from '@images/postCard1.png'
import Card2 from '@images/postCard2.png'
import { Link } from 'react-router-dom';

const Taglines = ({ text1, text2, paragraph }) => {
    return (
        <>
            < h1 className={style.title} >
                {text1}
            </h1 >
            <h1 className={style.title}>
                {text2}
            </h1 >
            <p className={style.paragraph}>
                {paragraph}
            </p>
        </>
    )
};

const Hero = () => {
    return (
        <section id="home" className={style.home}>

            <div className={style.hero}>

                <Taglines
                    text1="Empowered youth strengthen democracy"
                    text2="and build brighter futures."
                    paragraph=" Know your rights, demand transparent leadership."
                />

                <Link to='/signup' className={style.cta}>
                    Get Invloved
                </Link>


                <div className={style.cards}>
                    <div className={style.card}>
                        <img src={Card2} alt="Card 1" />

                    </div>
                    <div className={style.card}>
                        <img src={Card1} alt="Card " />

                    </div>
                    <div className={style.card}>
                        <img src={Card2} alt="Card 3" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
