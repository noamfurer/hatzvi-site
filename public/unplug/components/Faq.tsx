'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <Reveal className="faq-head">
          <p className="kicker">שאלות ותשובות</p>
          <h2 id="faq-title" className="h-section">
            רגע, אבל
            <br />
            מה עושים אם<span className="blue-text">...?</span>
          </h2>
          <p className="lede">תשובות קצרות לשאלות שעולות בכל קבוצת הורים.</p>
        </Reveal>

        <ul className="faq-list">
          {FAQ.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`qa ${isOpen ? 'is-open' : ''}`}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`a-${i}`} id={`q-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="qa-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="qa-q">{f.q}</span>
                    <span className="qa-plus" aria-hidden>
                      <Icon name="plus" size={20} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`a-${i}`}
                      role="region"
                      aria-labelledby={`q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                      className="qa-a"
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
