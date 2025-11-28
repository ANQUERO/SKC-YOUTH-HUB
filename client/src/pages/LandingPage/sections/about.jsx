import React from 'react';
import style from '@styles/landingpage.module.scss';
import AboutIMage from '@images/about.png'
import { Link } from 'react-router-dom'

const Taglines = ({ text1, text2, paragraph }) => {
    return (
        <>
            <h1 className={style.title}>
                {text1}
            </h1>
            <h1 className={style.title}>
                {text2}
            </h1>
            <p className={style.paragraph}>
                {paragraph}
            </p>
        </>
    )
}

const features = [
    {
        title: "Transparency",
        description: "Real-time access to government activities and decisions."
    },
    {
        title: "News Feed",
        description: "Stay updated with the latest community news and announcements."
    },
    {
        title: "Tracker",
        description: "Monitor project progress and government initiatives."
    },
]

const AboutUs = () => {
    return (
        <section className={style.about} id='about'>
            <div className={style.container}>

                {/**Left Side */}
                <div className={style.content}>
                    
                    <Taglines
                        text1="Know your right demand"
                        text2="transparent leadership."
                        paragraph="When empowered with knowledge and opportunities,
                         young people drive a stronger, more inclusive democracy 
                         fueled by passion and innovation."
                    />

                    <article className={style.buttonGroup}>
                        <button className={style.primaryButton}>Get to know us</button>
                        <button className={style.secondaryButton}>See Features</button>
                    </article>

                </div>

                {/** Right Side */}
                <div className={style.imageSection}>
                    <img
                        src={AboutIMage}
                        alt="About our platform"
                        className={style.aboutImage}
                    />
                </div>

            </div>

            {/** Features Section */}
            <section id="features" className={style.features}>
                {features.map((feature, index) => (
                    <div key={index} className={style.featureCard}>
                        <h3 className={style.featureTitle}>{feature.title}</h3>
                        <p className={style.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </section>

        </section>
    );
};

export default AboutUs;