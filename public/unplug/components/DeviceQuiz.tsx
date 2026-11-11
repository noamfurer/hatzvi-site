'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DEVICE_NOTE, DEVICE_OPTIONS, DEVICE_QUIZ, SOURCES } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

export default function DeviceQuiz() {
  const [pick, setPick] = useState<string | null>(null);
  const chosen = DEVICE_QUIZ.options.find((o) => o.id === pick);

  return (
    <section className="tool tool-device" id="device" aria-labelledby="device-title">
      <div className="wrap">
        <Reveal className="tool-head">
          <span className="tool-n">01</span>
          <h2 id="device-title" className="h-section">
            {DEVICE_QUIZ.title}
          </h2>
        </Reveal>

        <div className="quiz-card">
          <div className="quiz-q">
            <p className="quiz-label" id="quiz-q">
              {DEVICE_QUIZ.question}
            </p>
            <div className="quiz-options" role="radiogroup" aria-labelledby="quiz-q">
              {DEVICE_QUIZ.options.map((o) => (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={pick === o.id}
                  className={`opt ${pick === o.id ? 'is-on' : ''}`}
                  onClick={() => setPick(o.id)}
                >
                  <span className="opt-emoji" aria-hidden>
                    {o.emoji}
                  </span>
                  <span>{o.label}</span>
                  <span className="opt-check" aria-hidden>
                    <Icon name="check" size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-a" aria-live="polite">
            <AnimatePresence mode="wait">
              {chosen ? (
                <motion.div
                  key={chosen.id}
                  className="answer"
                  initial={{ opacity: 0, y: 18, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <span className="answer-tag">ההמלצה שלנו</span>
                  <h3>{chosen.result.title}</h3>
                  <p>{chosen.result.text}</p>
                  <p className="answer-tip">
                    <b>טיפ:</b> {chosen.result.tip}
                  </p>
                  <div className="answer-actions">
                    {chosen.id === 'everyone' ? (
                      <a href="#pact" className="btn btn-primary btn-sm">
                        לאמנת ההורים
                      </a>
                    ) : (
                      <a href={SOURCES.devices} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        למכשירים בטוחים <Icon name="external" size={16} />
                      </a>
                    )}
                    <button className="btn-text" onClick={() => setPick(null)}>
                      לבחור שוב
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="answer-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="big-q" aria-hidden>
                    ?
                  </span>
                  <p>בחרו תשובה, ונציע את הפתרון שהכי מתאים לכם.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <h3 className="compare-title">ארבע אפשרויות, בלי פילטרים</h3>
        <ul className="compare">
          {DEVICE_OPTIONS.map((d, i) => (
            <motion.li
              key={d.id}
              className={`cmp cmp-${d.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.07 }}
            >
              <div className="cmp-head">
                <span className="cmp-icon">
                  <Icon name={d.icon} size={28} />
                </span>
                <h4>{d.name}</h4>
              </div>
              <dl>
                <div>
                  <dt>
                    <span className="sym plus" aria-hidden>
                      +
                    </span>
                    יתרון
                  </dt>
                  <dd>{d.pro}</dd>
                </div>
                <div>
                  <dt>
                    <span className="sym minus" aria-hidden>
                      −
                    </span>
                    חיסרון
                  </dt>
                  <dd>{d.con}</dd>
                </div>
                <div>
                  <dt>
                    <span className="sym fit" aria-hidden>
                      ✓
                    </span>
                    למי מתאים
                  </dt>
                  <dd>{d.fit}</dd>
                </div>
              </dl>
            </motion.li>
          ))}
        </ul>
        <p className="note-row">
          <Icon name="shield" size={18} />
          <span>
            {DEVICE_NOTE}{' '}
            <a href={SOURCES.devices} target="_blank" rel="noopener noreferrer">
              השוואת מכשירים בטוחים באתר "תנו לגדול על שקט"
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}
