import React from 'react';
import style from '@styles/landingpage.module.scss';
import AboutIMage from '@images/about.png'
import { Link } from 'react-router-dom'

const features = [
    {
        title: "Know what is happening",
        description: "Find community news, announcements, and youth activities without chasing updates across channels."
    },
    {
        title: "Take part with confidence",
        description: "Discover projects and opportunities that make it easier to contribute where your voice matters."
    },
    {
        title: "See public work clearly",
        description: "Follow initiatives and keep youth leadership accountable through accessible community information."
    },
]

const AboutUs = () => {
    return (
        <section className={style.about} id='about'>
            <div className={style.container}>

                {/**Left Side */}
                <div className={style.content}>
                    
                    <p className={style.eyebrow}>Built around your participation</p>
                    <h2 className={style.title}>More clarity. More ways to contribute.</h2>
                    <p className={style.paragraph}>
                        SK Catarman Youth Hub brings the information and connections young people need
                        to participate in a stronger, more inclusive community.
                    </p>

                    <article className={style.buttonGroup}>
                        <a href="#officials" className={style.primaryButton}>Meet the officials</a>
                        <a href="#features" className={style.secondaryButton}>See the benefits</a>
                    </article>

                </div>

                {/** Right Side */}
                <div className={style.imageSection}>
                    <img
                        src={AboutIMage}
                        alt="About our platform"
                        className={style.aboutImage}
                        loading="lazy"
                        decoding="async"
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
