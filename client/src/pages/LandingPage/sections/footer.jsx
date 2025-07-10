import React from 'react';
import style from '@styles/landingpage.module.scss';
import Logo from '@images/logo.jpg'

const Footer = () => {
    return (
        <footer className={style.footer} id="footer">
            <div className={style.footerLogo}>
                <img src={Logo} alt="Logo" />
                <h1 className={style.logoText}>SKC</h1>

            </div>

            <ul className={style.links}>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">FAQ's</a></li>
                <li><a href="#">Help</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
            </ul>

            <p>&copy; 2025 SK Catarman. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
