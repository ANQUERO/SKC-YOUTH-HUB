import React from 'react';
import style from '@styles/landingpage.module.scss';
import Card2 from '@images/postCard2.png'
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className={style.home}>

            <div className={style.hero}>
                <p className={style.eyebrow}>SK Catarman Youth Hub</p>
                <h1 className={style.title}>Your voice can shape Catarman&apos;s future.</h1>
                <p className={style.paragraph}>
                    Join a safer, simpler space to follow youth initiatives, discover opportunities,
                    and take part in your community.
                </p>

                <div className={style.heroActions}>
                    <Link to='/signup' className={style.cta}>
                        Join the community
                    </Link>
                    <a href="#about" className={style.secondaryCta}>Explore how it works</a>
                </div>

                <div className={style.heroPreview} aria-label="Community update preview">
                    <img src={Card2} alt="A youth community activity" fetchPriority="high" />
                    <div>
                        <span>Stay in the loop</span>
                        <strong>Updates, projects, and opportunities in one place.</strong>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
