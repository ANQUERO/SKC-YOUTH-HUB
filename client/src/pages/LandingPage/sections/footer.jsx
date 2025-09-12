import React from 'react';
import style from '@styles/landingpage.module.scss';
import Logo from '@images/logo.jpg'
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className={style.footer} id="footer">

            <h1 className={style.tagline}>
                kabataan ang pag-asa ng bayan,
                <span className={style.subTagline}>
                    let's turn that hope into action
                </span>
            </h1 >

            <div className={style.footerLinks}>

                <div className={style.logo}>

                    <img
                        src={Logo}
                        alt="Logo"
                        className={style.logoImage}
                    />

                    <h1 className={style.logoText}>SKC</h1>

                </div>

                <ul className={style.navLinks}>
                    <li className={style.links}>
                        About
                    </li>
                    <li className={style.links}>
                        Officials
                    </li>
                    <li className={style.links}>
                        Discover
                    </li>
                    <li className={style.links}>
                        Location
                    </li>
                </ul>

                <div className={style.socialLinks}>
                    <ul className={style.social}>
                        <li className={style.socLinks}>
                            <a href="">
                                <Facebook />
                            </a>
                        </li>
                        <li className={style.socLinks}>
                            <a href="">
                                <Instagram />
                            </a>
                        </li>
                        <li className={style.socLinks}>
                            <a href="">
                                <Youtube />
                            </a>
                        </li>
                    </ul>
                </div>


            </div>






        </footer >
    );
};

export default Footer;
