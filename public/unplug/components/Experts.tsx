'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EXPERTS, SOURCES } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';
import { useInView, usePrefersReducedMotion } from './lib';

function CountUp({ to, decimals = 0, run }: { to: number; decimals?: number; run: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduced) return setV(to);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, reduced]);
  return <>{v.toFixed(decimals)}</>;
}

const AGES = Array.from({ length: 19 }, (_, i) => i);

export default function Experts() {
  const { ref, inView: seen } = useInView<HTMLDivElement>(0.3);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (seen) setInView(true);
  }, [seen]);
  const pct = EXPERTS.stat.value;

  return (
    <section className="experts" id="experts" aria-labelledby="experts-title">
      <div className="wrap">
        <Reveal className="experts-head">
          <p className="kicker kicker-light">מה ממליצים המומחים?</p>
          <h2 id="experts-title" className="h-section light">
            {EXPERTS.title}
          </h2>
          <p className="lede light">{EXPERTS.intro}</p>
        </Reveal>

        <div className="ruler" ref={ref} aria-hidden>
          <div className="ruler-line" />
          {AGES.map((a) => (
            <span key={a} className={`tick ${a % 3 === 0 ? 'major' : ''}`} style={{ insetInlineStart: `${(a / 18) * 100}%` }}>
              {a % 3 === 0 && <em>{a}</em>}
            </span>
          ))}
          <motion.span
            className="ruler-band"
            style={{ insetInlineStart: `${(9 / 18) * 100}%`, width: `${(2 / 18) * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <b>📞</b>
          </motion.span>
          {[13, 15].map((a, i) => (
            <motion.span
              key={a}
              className={`ruler-pin pin-${a}`}
              style={{ insetInlineStart: `${(a / 18) * 100}%` }}
              initial={{ y: -20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.6 + i * 0.25 }}
            >
              <b>{a === 13 ? '📱' : '💬'}</b>
            </motion.span>
          ))}
        </div>

        <ol className="ages">
          {EXPERTS.numbers.map((n, i) => (
            <motion.li
              key={n.value}
              className={`age age-${i + 1}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: i * 0.1 }}
            >
              <span className="age-label">{n.label}</span>
              <span className="age-num" aria-label={`גיל ${n.value}`}>
                {n.from === n.to ? (
                  <CountUp to={n.from} run={inView} />
                ) : (
                  <>
                    <CountUp to={n.from} run={inView} />–<CountUp to={n.to} run={inView} />
                  </>
                )}
              </span>
              <span className="age-text">{n.text}</span>
            </motion.li>
          ))}
        </ol>

        <Reveal className="stat-card">
          <div className="stat-ring" aria-hidden>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="ring-bg" />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                className="ring-fg"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: pct / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </svg>
          </div>
          <div className="stat-body">
            <p className="stat-num">
              {pct}%
            </p>
            <p className="stat-text">{EXPERTS.stat.text}</p>
            <p className="fine">{EXPERTS.stat.note}</p>
          </div>
        </Reveal>

        <p className="source-line">
          <Icon name="external" size={16} />
          מקור:{' '}
          <a href={SOURCES.mohYnet} target="_blank" rel="noopener noreferrer">
            {EXPERTS.sourceLabel}
          </a>
          <span aria-hidden> · </span>
          <a href={SOURCES.mohKan} target="_blank" rel="noopener noreferrer">
            כאן חדשות
          </a>
        </p>
      </div>
    </section>
  );
}
