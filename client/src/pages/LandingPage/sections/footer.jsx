import React from 'react';
import style from '@styles/landingpage.module.scss';
import Logo from '@images/logo.jpg';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={style.footer} id="footer">
            {/* Tagline Section */}
            <div className={style.tagline}>
                <h1>
                    Kabataan ang pag-asa ng bayan,
                    <span className={style.subTagline}>
                        let's turn that hope into action
                    </span>
                </h1>
            </div>

            {/* Main Content */}
            <div className={style.footerMain}>
                {/* Left Section - Logo and Description */}
                <div className={style.footerSection}>
                    <div className={style.logo}>
                        <img
                            src={Logo}
                            alt="SKC Logo"
                            className={style.logoImage}
                        />
                        <h1 className={style.logoText}>SKC</h1>
                    </div>
                    <p className={style.description}>
                        Empowering the youth through leadership, service, and community development.
                        Together, we build a better future for our barangay.
                    </p>

                    {/* Contact Info */}
                    <div className={style.contactInfo}>
                        <div className={style.contactItem}>
                            <MapPin size={16} />
                            <span>Barangay SKC, City, Philippines</span>
                        </div>
                        <div className={style.contactItem}>
                            <Phone size={16} />
                            <span>+63 912 345 6789</span>
                        </div>
                        <div className={style.contactItem}>
                            <Mail size={16} />
                            <span>info@skc-official.ph</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Quick Links */}
                <div className={style.footerSection}>
                    <h3 className={style.sectionTitle}>Quick Links</h3>
                    <ul className={style.navLinks}>
                        <li className={style.links}>About Us</li>
                        <li className={style.links}>Officials</li>
                        <li className={style.links}>Projects</li>
                        <li className={style.links}>Events</li>
                        <li className={style.links}>Gallery</li>
                        <li className={style.links}>Contact</li>
                    </ul>
                </div>

                {/* Right Section - Social Media */}
                <div className={style.footerSection}>
                    <h3 className={style.sectionTitle}>Follow Us</h3>
                    <p className={style.socialDescription}>
                        Stay updated with our latest activities and announcements
                    </p>
                    <div className={style.socialLinks}>
                        <ul className={style.social}>
                            <li className={style.socLinks}>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <Facebook size={24} />
                                    <span>Facebook</span>
                                </a>
                            </li>
                            <li className={style.socLinks}>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <Instagram size={24} />
                                    <span>Instagram</span>
                                </a>
                            </li>
                            <li className={style.socLinks}>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                    <Youtube size={24} />
                                    <span>YouTube</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className={style.bottomRow}>
                <div className={style.copyright}>
                    © {currentYear} Sangguniang Kabataan Council. All rights reserved.
                </div>
                <div className={style.legalLinks}>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-of-service">Terms of Service</a>
                    <a href="/accessibility">Accessibility</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;