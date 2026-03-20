'use client';

import { useRef } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  title: string[];
  subtitle: string[];
}

export default function Hero({ title, subtitle }: HeroProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const HeroContent = ({ styleClass }: { styleClass: string }) => (
    <div className={`${styles.textHalf} ${styleClass}`}>
      <div className={`${styles.innerContent} container`}>
        <h1 className={styles.title}>
          {title.map((word, index) => (
            <span key={index} className="word-effect">
              <span>{word}&nbsp;</span>
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>
          {subtitle.map((word, index) => (
            <span key={index} className="word-effect">
              <span style={{ animationDelay: `${0.4 + index * 0.1}s` }}>{word}&nbsp;</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );

  return (
    <section className={styles.hero}>
      {/* Sticky Image Layer (Z-index: 1) */}
      <div className={styles.stickyLayer}>
        <img src="/images/hero-fish.webp" alt="Luxurious Fish" className={styles.backgroundImage} />
      </div>

      {/* Scrolling Content Layer (Z-index: 2) */}
      <div className={styles.scrollLayer}>
        {/* Left Yellow Background */}
        <div className={styles.leftBackground} />

        {/* Text Layer (Contains two clipped versions of the same text) */}
        <div className={styles.textLayer}>
          <HeroContent styleClass={styles.textBlack} />
          <HeroContent styleClass={styles.textWhite} />
        </div>
      </div>

      <div className={styles.scrollIndicator} ref={scrollRef}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
