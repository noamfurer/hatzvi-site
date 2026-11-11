'use client';
import { motion } from 'framer-motion';
import { FRIENDS } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

export default function Friends() {
  return (
    <section className="friends" id="friends" aria-labelledby="friends-title">
      <div className="wrap">
        <Reveal className="tool-head">
          <span className="tool-n">04</span>
          <p className="kicker">אפשר להיות חברים גם בלי וואטסאפ</p>
          <h2 id="friends-title" className="h-section">
            {FRIENDS.title}
          </h2>
        </Reveal>

        <div className="friends-grid">
          <ol className="ways">
            {FRIENDS.ways.map((w, i) => (
              <motion.li
                key={w.title}
                className={`way way-${i + 1}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
              >
                <span className="way-icon">
                  <Icon name={w.icon} size={28} />
                </span>
                <span className="way-body">
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </span>
              </motion.li>
            ))}
          </ol>

          <Reveal className="pledge" delay={0.15}>
            <span className="pledge-kicker">{FRIENDS.pledgeKicker}</span>
            <p className="pledge-quote">"{FRIENDS.pledge}"</p>
            <p>{FRIENDS.pledgeText}</p>
            <a href="#pact" className="btn btn-sun btn-sm">
              אני בעד <Icon name="arrow" size={16} />
            </a>
            <span className="pledge-seal" aria-hidden>
              🤝
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
