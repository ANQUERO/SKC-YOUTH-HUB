import React from 'react'
import style from '@styles/hero.module.scss'
import HeroImage from '@images/Hero.jpg'

const Tagline = ({ text1, text2 }) => (
    <h1 className={style.title}>
        <span className={style.block}>{text1}</span>
        <span className={style.block}>{text2}</span>
    </h1>
)

const Description = ({ paragraph }) => (
    <p className={style.paragraphs}>{paragraph}</p>
);

const Button1 = ({ text }) => (
    <button className={style.button1}>
        <span className={style.buttonBlock}>{text}</span>
    </button>
)

const Button2 = ({ text }) => (
    <button className={style.button2}>
        <span className={style.buttonBlock}>{text}</span>
    </button>
)

const BackGround = () => (
    <div className={style.background}>
        <img
            src={HeroImage}
            alt="Background"
            className={style.backgroundImage}
        />
        <div className={style.transparent}>
            <div className={style.left}></div>
            <div className={style.overlay}></div>
        </div>
    </div>

);

const Hero = () => {
    return (
        <main id='home' className={style.main}>
            <BackGround />
            <div className={style.foreground}>

                <Tagline
                    text1="Empowered Youth,"
                    text2="Empowered Democracy."
                />

                <Description
                    paragraph="Know your rights, demand transparent leadership."
                />


                <div className={style.taglineButtons}>

                    <Button1
                        text="Login"
                    />
                    <Button2
                        text="Location"
                    />
                </div>
            </div>
        </main>
    );
};

export default Hero