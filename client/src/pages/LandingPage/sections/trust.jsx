import React from 'react';
import { BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import style from '@styles/landingpage.module.scss';

const trustItems = [
    {
        icon: BadgeCheck,
        title: 'Community-led information',
        text: 'Connect with the Catarman SK community and its youth organizations in one dedicated hub.'
    },
    {
        icon: LockKeyhole,
        title: 'Protected account access',
        text: 'Password-based accounts and protected routes help keep member areas restricted to signed-in users.'
    },
    {
        icon: ShieldCheck,
        title: 'Privacy information available',
        text: 'Review how personal information is handled before you create an account.'
    }
];

const Trust = () => (
    <section className={style.trust} aria-labelledby="trust-title">
        <div className={style.sectionIntro}>
            <p className={style.eyebrow}>Designed to earn confidence</p>
            <h2 id="trust-title">A community hub you can join with clarity.</h2>
        </div>
        <div className={style.trustGrid}>
            {trustItems.map(({ icon, title, text }) => (
                <article className={style.trustCard} key={title}>
                    {React.createElement(icon, { 'aria-hidden': true, size: 26, strokeWidth: 2.25 })}
                    <h3>{title}</h3>
                    <p>{text}</p>
                </article>
            ))}
        </div>
    </section>
);

export default Trust;
