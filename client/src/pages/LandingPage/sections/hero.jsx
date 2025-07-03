import React from 'react';
import style from '@styles/landingpage.module.scss';
import HeroImage from '@images/Hero.jpg';
import { Link } from 'react-router-dom';

const Tagline = ({ text1, text2 }) => (
    <h1 className={style.title}>
        <span className={style.block}>{text1}</span>
        <span className={style.block}>{text2}</span>
    </h1>
);

const Description = ({ paragraph }) => (
    <p className={style.paragraphs}>{paragraph}</p>
);

const ButtonPrimary = ({ text }) => (
    <Link to="/signin" className={style.login}>
        {text}
    </Link>
);


const HeroBackground = () => (
    <div className={style.background}>
        <img src={HeroImage} alt="Business Hero" className={style.backgroundImage} />
        <div className={style.transparent}>
            <div className={style.left}></div>
            <div className={style.overlay}></div>
            <div className={style.gradient}></div>
        </div>
    </div>
);

const Hero = () => {
    return (
        <section id="home" className={style.section}>
            <div className={style.hero}>
                <HeroBackground />
                <div className={style.foreground}>
                    <Tagline
                        text1="Empowered Youth,"
                        text2="Empowered Democracy."
                    />
                    <Description
                        paragraph="Know your rights, demand transparent leadership."
                    />

                    <ButtonPrimary text="Login" />

                </div>
            </div>
        </section>
    );
};

export default Hero;
