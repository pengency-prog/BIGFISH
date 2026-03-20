'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.info}>
            <Link href="/" className={styles.logo}>BIGFISH by Peno</Link>
            <p className={styles.description}>
              The B2B Web Agency (UK and Nigeria) for High-Performance Websites.
            </p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.column}>
              <h4>Services</h4>
              <Link href="/b2b-website-design">B2B Website Design</Link>
              <Link href="/website-optimisation">Website Optimisation</Link>
            </div>
            <div className={styles.column}>
              <h4>Company</h4>
              <Link href="/about-us">About Us</Link>
              <Link href="/work">Work</Link>
              <Link href="/insights">Insights</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={styles.column}>
              <h4>Contact</h4>
              <a href="mailto:prince@getpeno.com">prince@getpeno.com</a>
              <a href="tel:+2347044366251">+234 7044366251 (NG)</a>
              <a href="tel:+447443059220">+44 7443059220 (UK)</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} BIGFISH by Peno. All rights reserved.</p>
          <div className={styles.legal}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
