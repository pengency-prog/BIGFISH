'use client';

import { useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroProps {
  title: string[];
  subtitle: string[];
}

const HeroContent = ({ 
  styleClass, 
  title, 
  subtitle 
}: { 
  styleClass: string; 
  title: string[]; 
  subtitle: string[]; 
}) => (
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

export default function Hero({ title, subtitle }: HeroProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.hero}>
      {/* Sticky Image Layer (Z-index: 1) */}
      <div className={styles.stickyLayer}>
        <Image 
          src="/images/hero-fish.webp" 
          alt="Luxurious Fish" 
          fill
          priority
          className={styles.backgroundImage}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Scrolling Content Layer (Z-index: 2) */}
      <div className={styles.scrollLayer}>
        {/* Left Yellow Background */}
        <div className={styles.leftBackground} />

        {/* Text Layer (Contains two clipped versions of the same text) */}
        <div className={styles.textLayer}>
          <HeroContent styleClass={styles.textBlack} title={title} subtitle={subtitle} />
          <HeroContent styleClass={styles.textWhite} title={title} subtitle={subtitle} />
        </div>
      </div>

      <div 
        className={styles.scrollIndicator} 
        ref={scrollRef}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
