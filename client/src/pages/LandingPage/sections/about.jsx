import React from 'react';
import style from '@styles/landingpage.module.scss';
import aboutImage from '@images/about.png';
import { Link } from 'react-router-dom'

const AboutUs = () => {
    return (
        <section className={style.about}>
            <div className={style.container}>
                <div className={style.row}>

                    {/* Image Column */}
                    <div className={style.image_wrapper}>
                        <div className={style.image_container}>
                            <img src={aboutImage} alt="Team collaboration illustration" />
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className={style.text_wrapper}>
                        <h1>Know your rights, demand transparent leadership.</h1>
                        <p>When empowered with knowledge and opportunities,
                            young people drive a stronger, more inclusive
                            democracy fueled by passion and innovation.</p>
                        <button className={style.cta_button}>
                            <Link to='/adminAuth'>Get to Know Us</Link>
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutUs;
