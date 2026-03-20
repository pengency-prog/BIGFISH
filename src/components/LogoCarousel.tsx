'use client';

import styles from './LogoCarousel.module.css';

const logos = [
  { name: 'Kinso', src: '/images/logos/Kinso.jpg' },
  { name: 'Whisper Flow', src: '/images/logos/Whisper Flow.png' },
  { name: 'Penegncy', src: '/images/logos/Penegncy.png' },
  { name: 'KORREY', src: '/images/logos/KORREY.webp' },
  { name: 'Interface', src: 'https://www.bigfork.co.uk/assets/Uploads/Logos/interface-v2__ScaleWidthWzIwMF0.png' },
  { name: 'Snap-on', src: 'https://www.bigfork.co.uk/assets/Uploads/Logos/snap-on__ScaleWidthWzIwMF0.png' },
  { name: 'Quartix', src: 'https://www.bigfork.co.uk/assets/Uploads/Logos/quartix__ScaleWidthWzIwMF0.png' },
  { name: 'Probe', src: 'https://www.bigfork.co.uk/assets/Uploads/Logos/probe__ScaleWidthWzIwMF0.png' },
  { name: 'Onyx', src: 'https://www.bigfork.co.uk/assets/Uploads/Logos/onyx__ScaleWidthWzIwMF0.png' },
];

export default function LogoCarousel() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>
          <span className="word-effect"><span>TRUSTED&nbsp;</span></span>
          <span className="word-effect"><span>BY&nbsp;</span></span>
          <span className="word-effect"><span>B2B&nbsp;</span></span>
          <span className="word-effect"><span>BRANDS</span></span>
        </h2>
      </div>

      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          {/* Double the logos for seamless scrolling */}
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className={styles.logoItem}>
              <img src={logo.src} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
