'use client';
import { motion } from 'framer-motion';
import { GAINS } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';
import { asset } from './lib';

const TAPE = ['יותר משחק', 'יותר חברים', 'יותר שינה', 'יותר דמיון', 'יותר תנועה', 'יותר שקט', 'יותר ילדות'];

export default function Gains() {
  return (
    <section className="gains" id="gains" aria-labelledby="gains-title">
      <svg className="wave wave-top" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0h1440v40c-240 50-480-30-720 0S240 80 0 40Z" fill="var(--night)" />
      </svg>

      <div className="tape" aria-hidden>
        <div className="tape-track">
          {[...TAPE, ...TAPE, ...TAPE].map((t, i) => (
            <span key={i}>
              {t} <Icon name="sparkle" size={18} />
            </span>
          ))}
        </div>
      </div>

      <div className="wrap gains-grid">
        <div className="gains-head">
          <Reveal>
            <p className="kicker">מה דווקא מרוויחים?</p>
            <h2 id="gains-title" className="h-section">
              פחות מסך.
              <br />
              <span className="blue-text">יותר מהדברים שבאמת חשובים.</span>
            </h2>
          </Reveal>
        </div>

        <div className="gains-mascot">
          <motion.div
            className="speech"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 }}
          >
            {GAINS.mascotBubble}
          </motion.div>
          <motion.img
            src={asset('/img/mascot.webp')}
            alt="הצבי של ארץ הצבי, עם תיק גב, הולך בשמחה"
            width={420}
            height={940}
            loading="lazy"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
          <span className="mascot-shadow" aria-hidden />
        </div>

        <ul className="gain-list">
          {GAINS.items.map((g, i) => (
            <motion.li
              key={g.title}
              className={`gain gain-${i + 1}`}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: i * 0.08 }}
            >
              <span className="gain-icon">
                <Icon name={g.icon} size={30} />
              </span>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
