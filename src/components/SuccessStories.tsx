'use client';

import Link from 'next/link';
import styles from './SuccessStories.module.css';

const stories = [
  {
    title: 'TETRIS MOBILE APP',
    stat: '98% User Retention',
    image: '/images/stories/tetris_app.png',
    link: '/work/tetris'
  },
  {
    title: 'WISPR FLOW',
    stat: '4x Faster Than Typing',
    image: '/images/stories/wispr_flow.png',
    link: '/work/wispr-flow'
  },
  {
    title: 'QUARTIX',
    stat: '300% increase in web conversions',
    image: '/images/stories/quartix_african_man.png',
    link: '/work/quartix'
  }
];

export default function SuccessStories() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
            <h2 className={styles.title}>
                <span className="word-effect"><span>B2B&nbsp;</span></span>
                <span className="word-effect"><span>SUCCESS&nbsp;</span></span>
                <span className="word-effect"><span>STORIES</span></span>
            </h2>
            <div className={styles.line}></div>
        </div>

        <div className={styles.grid}>
          {stories.map((story, index) => (
            <Link href={story.link} key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={story.image} alt={story.title} />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.storyTitle}>{story.title}</h3>
                <p className={styles.storyStat}>{story.stat}</p>
                <div className={styles.arrow}>
                     <svg width="49" height="28" viewBox="0 0 49 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M48 14L34 0M48 14L34 28M48 14H0" stroke="currentColor" strokeWidth="2"/>
                     </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
