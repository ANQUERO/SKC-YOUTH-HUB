import React from 'react';
import style from '@styles/landingpage.module.scss';
import aboutImage from '@images/about.png'

const AboutUs = () => {
    return (
        <section className={style.about}>
            <div className={style.container}>
                <div className={style.row}>

                    {/* Image Column */}
                    <div className={style.image_wrapper}>
                        <div className={style.image_container}>
                            <img src={aboutImage} alt="sample" />
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className={style.text_wrapper}>
                        <h1>Headline</h1>
                        <p>Description goes here in 2–4 lines to give just a brief outline</p>
                        <button className={style.cta_button}>CTA</button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutUs;
