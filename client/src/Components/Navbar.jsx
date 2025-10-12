import style from '@styles/navbar.module.scss';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogout } from '@hooks/useLogout';
import { useAuthContext } from '@context/AuthContext';
import Logo from './Logo';

const MenuButton = ({ isMenuOpen, setIsMenuOpen }) => (
    <button
        type="button"
        className={style.button}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
    >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
);

/* NavLinks accepts an optional className so we can use different styles for mobile */
const NavLinks = ({ links, onLinkClick, className }) => (
    <ul className={className || style.nav_links}>
        {links.map((link, idx) => (
            <li key={idx}>
                {link.external ? (
                    <a
                        href={link.to}
                        onClick={onLinkClick}
                        className={`${style.link} ${link.text === 'Sign-up' ? style.sign_up : ''}`}
                    >
                        {link.text}
                    </a>
                ) : (
                    <Link
                        to={link.to}
                        onClick={onLinkClick}
                        className={`${style.link} ${link.text === 'Sign-up' ? style.sign_up : ''}`}
                    >
                        {link.text}
                    </Link>
                )}
            </li>
        ))}
    </ul>
);

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // lock body scroll while mobile menu is open and ensure it's reset
    useEffect(() => {
        const previous = document.body.style.overflow;
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previous || '';
        }
        return () => {
            document.body.style.overflow = previous || '';
        };
    }, [isMenuOpen]);

    // close menu on escape
    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMenuOpen]);

    const mainLinks = [
        { to: '/about', text: 'About' },
        { to: '/discover', text: 'Discover' },
        { to: '/officials', text: 'Officials' },
    ];

    const authLinks = [
        { to: '/login', text: 'Sign-in' },
        { to: '/signup', text: 'Sign-up' },
    ];

    const handleLinkClick = () => setIsMenuOpen(false);

    // close when clicking on overlay background (not inside the centered content)
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
        }
    };

    return (
        <header className={style.header}>
            <nav className={`${style.nav} ${isScrolled ? style.scrolled : ''}`}>
                <div className={style.navContent}>
                    {/* LEFT */}
                    <div className={style.leftSide}>
                        <Logo />
                        <h1 className={style.title}>
                            SANGGUNIANG <span className={style.titleSpan}>KABATAAN</span>
                        </h1>
                    </div>

                    {/* DESKTOP CENTER & RIGHT */}
                    <div className={style.centerLinks}>
                        <NavLinks links={mainLinks} onLinkClick={handleLinkClick} />
                    </div>

                    <div className={style.rightSide}>
                        <NavLinks links={authLinks} onLinkClick={handleLinkClick} />
                    </div>

                    {/* Mobile Menu Button (visible on small screens) */}
                    <MenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                </div>

                {/* MOBILE FULLSCREEN OVERLAY */}
                <div
                    className={`${style.mobileMenu} ${isMenuOpen ? style.open : ''}`}
                    onClick={handleOverlayClick}
                    role="presentation"
                >
                    {/* Close button inside overlay (top-right) */}
                    <button
                        className={style.mobileClose}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>

                    <div className={style.mobileInner}>
                        <div className={style.mobileTop}>
                            <Logo />
                            <h2 className={style.titleMobile}>
                                SANGGUNIANG <span className={style.titleSpan}>KABATAAN</span>
                            </h2>
                        </div>

                        <NavLinks
                            links={mainLinks}
                            onLinkClick={handleLinkClick}
                            className={style.mobile_nav_links}
                        />

                        <NavLinks
                            links={authLinks}
                            onLinkClick={handleLinkClick}
                            className={style.mobile_auth_links}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}

const ProfileNavLinks = ({ links }) => (
    <ul className={style.nav_links}>
        {links.map((link, key) => (
            <li key={key}>
                {link.onClick ? (
                    <button
                        className={style.link}
                        onClick={link.onClick}>
                        {link.text}
                    </button>
                ) : (
                    <Link to={link.to} className={style.link}>
                        {link.text}
                    </Link>
                )}
            </li>
        ))}
    </ul>
);

export function ProfileNavbar() {
    const logout = useLogout();
    const { authUser } = useAuthContext();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;

    const links = [
        canManage && {
            to: "/dashboard",
            text: "Dashboard",
        },
        {
            to: "/feed",
            text: "News Feed",
        },
        {
            to: "/account",
            text: "Settings",
        },
        {
            text: "Logout",
            onClick: logout,
        },
    ].filter(Boolean);

    return (
        <header className={style.header}>
            <nav className={style.nav}>
                <Logo />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'User')}`}
                            alt="User Avatar"
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%'
                            }}
                        />
                        <span style={{ fontWeight: 600 }}>
                            {authUser?.name || 'User'}
                        </span>
                    </div>
                    <ProfileNavLinks links={links} />
                </div>
            </nav>
        </header>
    );
}
