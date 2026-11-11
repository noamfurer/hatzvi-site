'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REPLIES } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';
import { useCopy } from './lib';

export default function Replies() {
  const [idx, setIdx] = useState(0);
  const { copied, copy } = useCopy();
  const cur = REPLIES.items[idx];

  return (
    <section className="replies" id="replies" aria-labelledby="replies-title">
      <div className="wrap">
        <Reveal className="tool-head">
          <span className="tool-n tool-n-light">03</span>
          <p className="kicker kicker-light">"אבל לכולם יש!"</p>
          <h2 id="replies-title" className="h-section light">
            {REPLIES.title}
          </h2>
        </Reveal>

        <div className="replies-grid">
          <div className="kid-picks">
            <p className="pick-hint">{REPLIES.hint}</p>
            <div className="kid-list" role="tablist" aria-label="משפטים של ילדים">
              {REPLIES.items.map((r, i) => (
                <button
                  key={r.kid}
                  role="tab"
                  id={`kid-tab-${i}`}
                  aria-selected={idx === i}
                  aria-controls="reply-panel"
                  className={`kid-chip ${idx === i ? 'is-on' : ''}`}
                  onClick={() => setIdx(i)}
                >
                  "{r.kid}"
                </button>
              ))}
            </div>
          </div>

          <div className="convo" id="reply-panel" role="tabpanel" aria-labelledby={`kid-tab-${idx}`} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={idx} className="convo-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  className="say say-kid"
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                >
                  <span className="say-who">הילד/ה</span>
                  <span className="say-text">{cur.kid}</span>
                </motion.div>

                <motion.div
                  className="say say-parent"
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.45 }}
                >
                  <span className="say-who">אפשר לענות</span>
                  <span className="say-text">{cur.parent}</span>
                  <button className="copy-btn" onClick={() => copy(cur.parent, `r${idx}`)} aria-label="העתקת התשובה">
                    <Icon name={copied === `r${idx}` ? 'check' : 'copy'} size={16} />
                    {copied === `r${idx}` ? 'הועתק!' : 'העתקת התשובה'}
                  </button>
                </motion.div>

                <motion.p className="why-works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <Icon name="sparkle" size={16} /> למה זה עובד: {cur.why}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
