'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SMARTPHONE } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

const LOGO: Record<string, React.ReactNode> = {
  android: (
    <svg viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="12" fill="#EAF6FF" />
      <path d="M11 24a9 9 0 0 1 18 0Z" fill="#2563B8" />
      <circle cx="16" cy="20" r="1.3" fill="#fff" />
      <circle cx="24" cy="20" r="1.3" fill="#fff" />
      <path d="M14 14l2 3M26 14l-2 3" stroke="#2563B8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  iphone: (
    <svg viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="12" fill="#EAF6FF" />
      <circle cx="20" cy="20" r="9" fill="none" stroke="#123B72" strokeWidth="2.2" />
      <path d="M20 14.5V20l3.6 2.4" stroke="#3489E8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="12" fill="#EAF6FF" />
      <path d="M11 29l1.6-4.6A9 9 0 1 1 16 27.6Z" fill="none" stroke="#2563B8" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M17 17.5c0 3 2.3 5.5 5.3 5.6" stroke="#2563B8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

export default function Smartphone() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="tool tool-smart" id="smartphone" aria-labelledby="smart-title">
      <div className="wrap">
        <Reveal className="tool-head">
          <span className="tool-n">02</span>
          <h2 id="smart-title" className="h-section">
            {SMARTPHONE.title}
          </h2>
          <p className="lede">{SMARTPHONE.intro}</p>
        </Reveal>

        <div className="guides">
          {SMARTPHONE.guides.map((g, i) => {
            const isOpen = open === g.id;
            return (
              <motion.article
                key={g.id}
                className={`guide ${isOpen ? 'is-open' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
              >
                <div className="guide-top">
                  <span className="guide-logo">{LOGO[g.id]}</span>
                  <span className="guide-device">{g.device}</span>
                </div>
                <h3>{g.brand}</h3>
                <p>{g.summary}</p>
                <button
                  className={`btn ${isOpen ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  aria-expanded={isOpen}
                  aria-controls={`steps-${g.id}`}
                  onClick={() => setOpen(isOpen ? null : g.id)}
                >
                  {isOpen ? 'סגירה' : g.button}
                  <Icon name="down" size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`steps-${g.id}`}
                      className="steps-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    >
                      <ol className="steps">
                        {g.steps.map((s, k) => (
                          <motion.li
                            key={k}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * k + 0.1 }}
                          >
                            <span className="step-n">{k + 1}</span>
                            <span>{s}</span>
                          </motion.li>
                        ))}
                      </ol>
                      <p className="fine">{g.caveat}</p>
                      <a href={g.link} target="_blank" rel="noopener noreferrer" className="link-arrow">
                        {g.linkLabel} <Icon name="external" size={16} />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <Reveal className="big-note">
          <Icon name="friends" size={30} />
          <p>{SMARTPHONE.note}</p>
        </Reveal>
        <p className="fine center">{SMARTPHONE.menuNote}</p>
      </div>
    </section>
  );
}
