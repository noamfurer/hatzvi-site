'use client';
import { motion } from 'framer-motion';
import { HERO } from '@/content/site';
import ChatSim from './ChatSim';
import { Icon } from './Icons';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden>
        <span className="cloud c1" />
        <span className="cloud c2" />
        <span className="cloud c3" />
        <span className="ring r1" />
        <span className="ring r2" />
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <span className="dot" /> {HERO.eyebrow}
          </motion.p>
          <motion.h1
            id="hero-title"
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
          >
            רק <span className="mark">הודעה אחת</span>
            <br />
            בקבוצה<span className="dots">...</span>
          </motion.h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {HERO.subtitle}
          </motion.p>

          <motion.div
            className="hero-closing hide-mobile"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p>{HERO.closing}</p>
            <a href="#why" className="btn btn-primary btn-lg">
              {HERO.cta}
              <Icon name="arrow" size={20} />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-phone"
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
        >
          <ChatSim />
          <p className="disclaimer">
            <Icon name="shield" size={18} />
            <span>{HERO.disclaimer}</span>
          </p>
        </motion.div>

        <div className="hero-closing show-mobile">
          <p>{HERO.closing}</p>
          <a href="#why" className="btn btn-primary btn-lg btn-block">
            {HERO.cta}
            <Icon name="arrow" size={20} />
          </a>
        </div>
      </div>

      <svg className="wave wave-bottom" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path d="M0 50C240 90 480 10 720 40s480 50 720 10v40H0Z" fill="var(--navy-900)" />
      </svg>
    </section>
  );
}
