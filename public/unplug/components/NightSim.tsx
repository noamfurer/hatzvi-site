'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NIGHT } from '@/content/site';
import { Icon } from './Icons';
import { usePrefersReducedMotion } from './lib';

const SLEEP_OPTS = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
const WAKE_OPTS = ['06:00', '06:30', '07:00', '07:30', '08:00'];
const DURATION = 11000;

const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

type Phase = 'idle' | 'running' | 'done';

export default function NightSim() {
  const reduced = usePrefersReducedMotion();
  const [sleep, setSleep] = useState('21:00');
  const [wake, setWake] = useState('07:00');
  const [phase, setPhase] = useState<Phase>('idle');
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  const s = toMin(sleep);
  const span = toMin(wake) + 1440 - s;
  const scale = span / 600;

  const events = useMemo(
    () =>
      NIGHT.events.map((e) => ({
        ...e,
        time: fmt(Math.round((s + e.at * span) / 5) * 5),
        burst: Math.max(1, Math.round(e.burst * scale)),
      })),
    [s, span, scale],
  );

  const passed = events.filter((e) => e.at <= p);
  const ambient = Math.floor(38 * scale * Math.sqrt(p));
  const count = passed.reduce((n, e) => n + e.burst, 0) + ambient;
  const now = s + p * span;

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const run = () => {
    stop();
    if (reduced) {
      setP(1);
      setPhase('done');
      return;
    }
    setPhase('running');
    setP(0);
    start.current = performance.now();
    let last = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start.current) / DURATION);
      if (t - last > 33 || k === 1) {
        // האטה בשעות המאוחרות כדי שהתחלת הלילה (העמוסה) תהיה קריאה
        setP(k < 1 ? 1 - Math.pow(1 - k, 1.6) : 1);
        last = t;
      }
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else {
        raf.current = null;
        setPhase('done');
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => stop, []);

  const skip = () => {
    stop();
    setP(1);
    setPhase('done');
  };

  const visible = [...passed].reverse().slice(0, 4);
  const hidden = Math.max(0, passed.length - 4);
  const dawn = Math.max(0, (p - 0.8) / 0.2);

  return (
    <section className="night" id="night" aria-labelledby="night-title">
      <div className="stars" aria-hidden />
      <div className="wrap night-grid">
        <div className="night-copy">
          <p className="kicker kicker-light">{NIGHT.kicker}</p>
          <h2 id="night-title" className="h-section light">
            {NIGHT.title}
          </h2>
          <p className="lede light">{NIGHT.intro}</p>

          <div className="night-form">
            <label className="time-field">
              <span>
                <Icon name="moon" size={18} /> הלך לישון ב-
              </span>
              <select value={sleep} onChange={(e) => setSleep(e.target.value)} disabled={phase === 'running'}>
                {SLEEP_OPTS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="time-field">
              <span>
                <Icon name="sparkle" size={18} /> התעורר ב-
              </span>
              <select value={wake} onChange={(e) => setWake(e.target.value)} disabled={phase === 'running'}>
                {WAKE_OPTS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            {phase === 'running' ? (
              <button className="btn btn-ghost-light" onClick={skip}>
                דלגו לבוקר
              </button>
            ) : (
              <button className="btn btn-sun" onClick={run}>
                {phase === 'done' ? (
                  <>
                    <Icon name="replay" size={18} /> שוב
                  </>
                ) : (
                  <>
                    {NIGHT.button} <Icon name="arrow" size={18} />
                  </>
                )}
              </button>
            )}
          </div>
          <p className="fine light">{NIGHT.disclaimer}</p>
        </div>

        <div className="night-stage">
          <div className="lock" style={{ ['--dawn' as string]: dawn }}>
            <div className="lock-glow" aria-hidden />
            <div className="lock-top">
              <span className="lock-icon">
                <Icon name="lock" size={16} />
              </span>
              <span className="lock-time" aria-live="off">
                {fmt(now)}
              </span>
              <span className="lock-date">{p < 0.3 ? 'יום שלישי' : 'יום רביעי'}</span>
            </div>

            <div className="lock-counter" aria-live="polite" aria-atomic="true">
              <motion.b key={Math.floor(count / 5)} initial={{ scale: 1.15 }} animate={{ scale: 1 }}>
                {count}
              </motion.b>
              <span>הודעות שלא נקראו</span>
            </div>

            <ul className="lock-notifs">
              <AnimatePresence initial={false}>
                {visible.map((e) => (
                  <motion.li
                    key={e.text}
                    layout
                    initial={{ opacity: 0, y: -18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    <span className="ln-icon" aria-hidden>
                      {e.icon}
                    </span>
                    <span className="ln-body">
                      <span className="ln-top">
                        <b>ה׳ 2 הכי טובים 🔥</b>
                        <time>{e.time}</time>
                      </span>
                      <span>
                        {e.text} · +{e.burst}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {hidden > 0 && <li className="ln-more">ועוד {hidden} התראות קודמות</li>}
              {phase === 'idle' && <li className="ln-empty">הטלפון שקט. בינתיים.</li>}
            </ul>

            <div className="night-bar" aria-hidden>
              <Icon name="moon" size={16} />
              <span className="track">
                <span className="fill" style={{ transform: `scaleX(${p})` }} />
              </span>
              <span className="sun-dot" />
            </div>
          </div>

          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                className="night-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <p>{NIGHT.ending}</p>
                <a href="#kit" className="btn btn-primary">
                  {NIGHT.endingButton}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
