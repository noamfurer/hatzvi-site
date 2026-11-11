'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MEETUP } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';
import { useInView, usePrefersReducedMotion } from './lib';

const A = MEETUP.laneA;
const B = MEETUP.laneB;

export default function Meetup() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1); // -1 = לא התחיל
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const TOTAL = A.messages.length + 2;

  const play = () => {
    if (timer.current) clearInterval(timer.current);
    if (reduced) return setStep(TOTAL);
    setStep(0);
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL) {
          if (timer.current) clearInterval(timer.current);
          return s;
        }
        return s + 1;
      });
    }, 520);
  };
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);
  const { ref: lanesRef, inView } = useInView<HTMLDivElement>(0.45);
  const auto = useRef(false);
  useEffect(() => {
    if (inView && !auto.current) {
      auto.current = true;
      play();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const aShown = Math.max(0, Math.min(A.messages.length, step));
  const aDone = step >= TOTAL;
  // מסלול ב': שיחה – 0 מחייג, 1-3 שורות, 4 נקבע
  const bStage = step < 0 ? -1 : Math.min(4, Math.floor(step / 1.4));
  const bDone = bStage >= 4;

  return (
    <section className="meetup" id="meetup" aria-labelledby="meetup-title">
      <div className="wrap">
        <Reveal className="exp-head">
          <p className="kicker">{MEETUP.kicker}</p>
          <h2 id="meetup-title" className="h-section">
            {MEETUP.title}
          </h2>
          <button className="btn btn-primary" onClick={play}>
            {step < 0 ? (
              <>
                <Icon name="playBtn" size={18} /> {MEETUP.play}
              </>
            ) : (
              <>
                <Icon name="replay" size={18} /> שוב מההתחלה
              </>
            )}
          </button>
        </Reveal>

        <div className="lane-tabs" role="tablist" aria-label="בחירת מסלול">
          <button role="tab" aria-selected={tab === 'a'} className={tab === 'a' ? 'is-on' : ''} onClick={() => setTab('a')}>
            א׳ · וואטסאפ
          </button>
          <button role="tab" aria-selected={tab === 'b'} className={tab === 'b' ? 'is-on' : ''} onClick={() => setTab('b')}>
            ב׳ · שיחת טלפון
          </button>
        </div>

        <div className={`lanes show-${tab}`} ref={lanesRef}>
          {/* מסלול א' */}
          <article className="lane lane-a" aria-label={A.title}>
            <header>
              <span className="lane-badge">א׳</span>
              <h3>{A.title}</h3>
            </header>
            <div className="lane-screen wa">
              {step < 0 && <p className="lane-wait">לחצו על "הפעילו" כדי לראות איך זה מתגלגל</p>}
              <AnimatePresence>
                {A.messages.slice(0, aShown).map((m, i) => (
                  <motion.div
                    key={i}
                    className={`mini-bubble ${m.from === 'נועם' ? 'mine' : ''}`}
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  >
                    {m.from !== 'נועם' && <b>{m.from}</b>}
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ul className="lane-stats">
              {A.stats.map((s) => (
                <li key={s.label}>
                  <b>{aDone ? s.value : step < 0 ? 0 : Math.round((s.value * aShown) / A.messages.length)}</b>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
            <p className={`lane-end ${aDone ? 'is-on' : ''}`}>{A.end}</p>
          </article>

          {/* מסלול ב' */}
          <article className="lane lane-b" aria-label={B.title}>
            <header>
              <span className="lane-badge">ב׳</span>
              <h3>{B.title}</h3>
            </header>
            <div className="lane-screen call">
              {bStage < 0 && <p className="lane-wait">שיחה אחת. בואו נראה.</p>}
              {bStage >= 0 && (
                <div className={`call-card ${bStage >= 1 ? 'connected' : ''}`}>
                  <span className="call-avatar" aria-hidden>
                    <Icon name="call" size={26} />
                  </span>
                  <b>{bStage >= 1 ? 'איתי' : B.calling}</b>
                  <small>{bStage >= 1 ? `00:${String(Math.min(40, bStage * 12)).padStart(2, '0')}` : 'מחייג'}</small>
                </div>
              )}
              <AnimatePresence>
                {B.lines.slice(0, Math.max(0, bStage)).map((l, i) => (
                  <motion.div
                    key={i}
                    className={`talk ${l.who}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    {l.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {bDone && (
                  <motion.div
                    className="done-stamp"
                    initial={{ scale: 1.6, opacity: 0, rotate: -12 }}
                    animate={{ scale: 1, opacity: 1, rotate: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  >
                    <Icon name="check" size={22} /> {B.end}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ul className="lane-stats">
              {B.stats.map((s) => (
                <li key={s.label}>
                  <b>{bDone ? s.value : bStage < 0 ? 0 : s.label === 'שניות' ? Math.min(40, Math.max(0, bStage) * 12) : s.value}</b>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
            <p className={`lane-end ${bDone ? 'is-on' : ''}`}>16:00 אצל נועם. זהו.</p>
          </article>
        </div>

        <Reveal className="meetup-foot">
          <p className="meetup-msg">{MEETUP.message}</p>
          <p className="fine">{MEETUP.fair}</p>
        </Reveal>
      </div>
    </section>
  );
}
