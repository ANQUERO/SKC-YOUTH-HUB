import style from '@styles/navbar.module.scss';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
                <a
                    href={link.href}
                    onClick={onLinkClick}
                    className={style.link}
                >
                    {link.text}
                </a>
            </li>
        ))}
    </ul>
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
        { href: '#about', text: 'About' },
        { href: '#officials', text: 'Officials' },
        { href: '#discover', text: 'Discover' },
        { href: '/signup', text: 'Sign Up' },
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
