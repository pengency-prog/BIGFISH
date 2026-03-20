'use client';

import { useEffect } from 'react';
import styles from './CalendlyButton.module.css';

declare global {
  interface Window {
    Calendly: any;
  }
}

export default function CalendlyButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: 'https://calendly.com/pengency/30min' });
    } else {
      window.open('https://calendly.com/pengency/30min', '_blank');
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      Book Your Free Website Assessment Call
    </button>
  );
}
