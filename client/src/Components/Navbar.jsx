import style from '@styles/navbar.module.scss';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogout } from '@hooks/useLogout';

const Logo = () => (
    <div className={style.logo}>
        <h1 className={style.logo_name}>SKC</h1>
    </div>
);

const MenuButton = ({ isMenuOpen, setIsMenuOpen }) => (
    <button
        type="button"
        className={style.button}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
    >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
);

const NavLinks = ({ links, onLinkClick }) => (
    <ul className={style.nav_links}>
        {links.map((link, key) => (
            <li key={key}>
                {link.external ? (
                    <a
                        id={link.to}
                        onClick={onLinkClick}
                        className={`${style.link} ${link.text === 'Sign Up' ? style.sign_up : ''}`}
                    >
                        {link.text}
                    </a>
                ) : (
                    <Link
                        to={link.to}
                        onClick={onLinkClick}
                        className={`${style.link} ${link.text === 'Sign Up' ? style.sign_up : ''}`}
                    >
                        {link.text}
                    </Link>
                )}
            </li>
        ))}
    </ul >
);

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        {
            id: '/about',
            text: 'About'
        },
        {
            id: '/officials',
            text: 'Officials'
        },
        {
            id: '/discover',
            text: 'Discover'
        },
        {
            to: '/signup',
            text: 'Sign Up',
            external: false
        },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={style.header}>
            <nav className={`${style.nav} ${isScrolled ? style.scrolled : ''}`}>
                <Logo />
                <MenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

                <div className={`${style.menu} ${isMenuOpen ? style.open : ''}`}>
                    <NavLinks links={links} onLinkClick={handleLinkClick} />
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

    const links = [
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
    ];

    return (
        <header className={style.header}>
            <nav className={style.nav}>
                <Logo />
                <div>
                    <ProfileNavLinks links={links} />
                </div>
            </nav>
        </header>
    );
}
