import React from 'react';
import { Link } from 'react-router-dom';
import style from '@styles/landingpage.module.scss';

const FinalCta = () => (
    <section className={style.finalCta} aria-labelledby="join-title">
        <div>
            <p className={style.eyebrow}>Ready when you are</p>
            <h2 id="join-title">Be part of the next step for Catarman&apos;s youth.</h2>
            <p>Create your account to receive community updates and take part in the conversation.</p>
        </div>
        <Link className={style.cta} to="/signup">Create your account</Link>
    </section>
);

export default FinalCta;
