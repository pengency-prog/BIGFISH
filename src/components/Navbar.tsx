'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo} aria-label="BIGFISH by Peno">
          <span className={styles.logoText}>BIGFISH <small>by Peno</small></span>
        </Link>
        
        <div className={styles.actions}>
          <Link href="/work" className={styles.cta}>
            <span className={styles.ctaText}>SUCCESS STORIES</span>
          </Link>
          
          <button 
            className={`${styles.burger} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.burgerText}>Menu</span>
            <div className={styles.burgerLines}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Full Screen Menu */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <div className={styles.navContainer}>
          <ul className={styles.navList}>
            <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link href="/b2b-website-design" onClick={() => setIsMenuOpen(false)}>B2B Website Design</Link></li>
            <li><Link href="/website-optimisation" onClick={() => setIsMenuOpen(false)}>Website Optimisation</Link></li>
            <li><Link href="/work" onClick={() => setIsMenuOpen(false)}>Success Stories</Link></li>
            <li><Link href="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
            <li><Link href="/insights" onClick={() => setIsMenuOpen(false)}>Insights</Link></li>
            <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
