'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KIT } from '@/content/site';
import { CONFIG } from '@/content/config';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';
import { useCopy, waLink } from './lib';

export default function Kit() {
  const [concern, setConcern] = useState<string | null>(null);
  const [age, setAge] = useState('mid');
  const { copied, copy } = useCopy();

  const parentsMsg = concern
    ? `${KIT.parentsMessage.base} ${KIT.parentsMessage.addon[concern]}\n\n${KIT.parentsMessage.link}\n${CONFIG.siteUrl.replace(/\/$/, '')}`
    : '';
  const kidLine = concern ? KIT.kidLine[age][concern] : '';

  return (
    <section className="kit" id="kit" aria-labelledby="kit-title">
      <div className="wrap">
        <Reveal className="exp-head">
          <span className="tool-n">05</span>
          <p className="kicker">{KIT.kicker}</p>
          <h2 id="kit-title" className="h-section">
            {KIT.title}
          </h2>
        </Reveal>

        <div className="kit-q">
          <p className="quiz-label" id="kit-q">
            {KIT.question}
          </p>
          <div className="kit-options" role="radiogroup" aria-labelledby="kit-q">
            {KIT.concerns.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={concern === c.id}
                className={`kit-opt ${concern === c.id ? 'is-on' : ''}`}
                onClick={() => setConcern(c.id)}
              >
                <span className="kit-emoji" aria-hidden>
                  {c.emoji}
                </span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {concern ? (
            <motion.div key={concern} className="kit-cards" initial="hide" animate="show" exit="hide" aria-live="polite">
              {/* 1. הודעה להורים */}
              <motion.article
                className="kcard kcard-1"
                variants={{ hide: { opacity: 0, y: 40, rotate: 3 }, show: { opacity: 1, y: 0, rotate: 0 } }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              >
                <span className="kcard-n">1</span>
                <h3>הודעה להורים בכיתה</h3>
                <div className="wa-preview">
                  <p>{parentsMsg}</p>
                </div>
                <div className="kcard-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => copy(parentsMsg, 'p')}>
                    <Icon name={copied === 'p' ? 'check' : 'copy'} size={16} /> {copied === 'p' ? 'הועתק!' : 'העתקה'}
                  </button>
                  <a className="btn btn-wa btn-sm" href={waLink(parentsMsg)} target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" size={18} /> שיתוף בוואטסאפ
                  </a>
                </div>
              </motion.article>

              {/* 2. מה להגיד לילד */}
              <motion.article
                className="kcard kcard-2"
                variants={{ hide: { opacity: 0, y: 40, rotate: -3 }, show: { opacity: 1, y: 0, rotate: 0 } }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.1 }}
              >
                <span className="kcard-n">2</span>
                <h3>מה להגיד לילד?</h3>
                <div className="age-chips" role="radiogroup" aria-label="גיל הילד">
                  {KIT.ages.map((a) => (
                    <button key={a.id} role="radio" aria-checked={age === a.id} className={age === a.id ? 'is-on' : ''} onClick={() => setAge(a.id)}>
                      {a.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={age} className="kid-line" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    "{kidLine}"
                  </motion.p>
                </AnimatePresence>
                <div className="kcard-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => copy(kidLine, 'k')}>
                    <Icon name={copied === 'k' ? 'check' : 'copy'} size={16} /> {copied === 'k' ? 'הועתק!' : 'העתקה'}
                  </button>
                </div>
              </motion.article>

              {/* 3. פתרון טכנולוגי */}
              <motion.article
                className="kcard kcard-3"
                variants={{ hide: { opacity: 0, y: 40, rotate: 2 }, show: { opacity: 1, y: 0, rotate: 0 } }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.2 }}
              >
                <span className="kcard-n">3</span>
                <h3>{KIT.tech.title}</h3>
                <div className="tech-art" aria-hidden>
                  <Icon name="phone" size={44} />
                  <Icon name="watch" size={44} />
                </div>
                <p>{KIT.tech.text}</p>
                <div className="kcard-actions">
                  <a className="btn btn-primary btn-sm" href={KIT.tech.link} target="_blank" rel="noopener noreferrer">
                    להשוואת המכשירים <Icon name="external" size={16} />
                  </a>
                  {concern === 'already' && (
                    <a className="btn-text" href="#smartphone">
                      מדריכי הגדרות
                    </a>
                  )}
                </div>
              </motion.article>
            </motion.div>
          ) : (
            <motion.div key="empty" className="kit-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="kit-box" aria-hidden>
                <span className="lid" />
                <span className="box" />
              </div>
              <p>בחרו מה הכי מטריד אתכם, והערכה נפתחת.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
