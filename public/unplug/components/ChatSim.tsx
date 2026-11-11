'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MESSAGES, type ChatMessage } from '@/content/messages';
import { HERO } from '@/content/site';
import { Icon } from './Icons';
import { useInView, usePrefersReducedMotion } from './lib';

const MILD = MESSAGES.filter((m) => !m.severe);
const SEVERE = MESSAGES.filter((m) => m.severe);
const SENDER_COLORS = ['#C2410C', '#1D6FD1', '#0F766E', '#9D174D', '#7C3AED', '#B45309', '#0369A1'];

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** בוחר 2–3 הודעות לא קשורות (מקטגוריות וערים שונות), בלי לחזור על הודעות אחרונות */
function pickRound(round: number, recent: Set<number>): ChatMessage[] {
  const count = Math.random() < 0.5 ? 2 : 3;
  const allowSevere = round >= 3 && Math.random() < 0.3;
  const out: ChatMessage[] = [];
  const cats = new Set<string>();
  const cities = new Set<string>();
  if (allowSevere) {
    const s = shuffle(SEVERE).find((m) => !recent.has(m.id));
    if (s) {
      out.push(s);
      cats.add(s.category);
      cities.add(s.city);
    }
  }
  for (const m of shuffle(MILD)) {
    if (out.length >= count) break;
    if (recent.has(m.id) || cats.has(m.category) || cities.has(m.city)) continue;
    out.push(m);
    cats.add(m.category);
    cities.add(m.city);
  }
  return shuffle(out);
}

function clock(base: number, i: number) {
  const t = base + i * 2;
  const h = 20 + Math.floor(t / 60);
  return `${String(h % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

export default function ChatSim() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(0);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(47);
  const recent = useRef<Set<number>>(new Set());
  const [baseMin, setBaseMin] = useState(105);
  useEffect(() => {
    setBaseMin(60 + Math.floor(Math.random() * 90));
  }, [round]);

  const newRound = useCallback((r: number) => {
    const picked = pickRound(r, recent.current);
    picked.forEach((m) => recent.current.add(m.id));
    if (recent.current.size > 40) recent.current = new Set([...recent.current].slice(-24));
    setMsgs(picked);
    setShown(0);
    setTyping(false);
    setRound(r);
  }, []);

  useEffect(() => {
    newRound(0);
  }, [newRound]);

  useEffect(() => {
    if (paused || !inView || msgs.length === 0) return;
    let t: ReturnType<typeof setTimeout>;
    if (shown < msgs.length) {
      if (!typing) {
        t = setTimeout(() => setTyping(true), shown === 0 ? 500 : 900);
      } else {
        const len = msgs[shown].text.length;
        const dur = reduced ? 300 : Math.min(2000, 900 + len * 14);
        t = setTimeout(() => {
          setTyping(false);
          setShown((s) => s + 1);
          setUnread((u) => u + 1 + Math.floor(Math.random() * 4));
        }, dur);
      }
    } else {
      const words = msgs.reduce((n, m) => n + m.text.split(' ').length, 0);
      const read = Math.min(9500, Math.max(5000, 2600 + words * 230));
      t = setTimeout(() => newRound(round + 1), read);
    }
    return () => clearTimeout(t);
  }, [paused, inView, msgs, shown, typing, reduced, round, newRound]);

  const typer = typing && shown < msgs.length ? msgs[shown] : null;
  const who = (m: ChatMessage) => (m.sender === 'f' ? 'תלמידה' : 'תלמיד');

  return (
    <div className="chat-wrap" ref={ref}>
      <div className="phone" role="group" aria-label="הדמיה של קבוצת וואטסאפ כיתתית">
        <div className="phone-btn phone-btn-a" aria-hidden />
        <div className="phone-btn phone-btn-b" aria-hidden />
        <div className="phone-screen">
          <div className="status-bar" aria-hidden>
            <span>{clock(baseMin, 0)}</span>
            <span className="island" />
            <span className="status-icons">
              <i className="sig" />
              <i className="wifi" />
              <i className="batt" />
            </span>
          </div>

          <div className="chat-head">
            <span className="chat-back" aria-hidden>
              <Icon name="next" size={22} style={{ transform: 'scaleX(-1)' }} />
              <b>{unread}</b>
            </span>
            <span className="chat-avatar" aria-hidden>
              🔥
            </span>
            <span className="chat-title">
              <b>{HERO.groupName}</b>
              <AnimatePresence mode="wait" initial={false}>
                <motion.small
                  key={typer ? `t${typer.id}` : 'meta'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className={typer ? 'is-typing' : ''}
                >
                  {typer ? `${who(typer)} מכיתה ${typer.grade}׳ ${typer.sender === 'f' ? 'מקלידה' : 'מקליד'}...` : HERO.groupMeta}
                </motion.small>
              </AnimatePresence>
            </span>
          </div>

          <div className="chat-body" role="log" aria-live="off" aria-label="הודעות בקבוצה">
            <div className="chat-day">היום</div>
            <AnimatePresence mode="popLayout">
              {msgs.slice(0, shown).map((m, i) => (
                <motion.div
                  layout="position"
                  key={`${round}-${m.id}`}
                  className="bubble in"
                  initial={{ opacity: 0, scale: 0.92, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24, transition: { duration: 0.25 } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  style={{ transformOrigin: 'right bottom' }}
                >
                  <span className="bubble-from" style={{ color: SENDER_COLORS[m.id % SENDER_COLORS.length] }}>
                    {who(m)} · כיתה {m.grade}׳ · {m.city}
                  </span>
                  <span className="bubble-text">{m.text}</span>
                  <span className="bubble-time">{clock(baseMin, i)}</span>
                </motion.div>
              ))}
              {typer && (
                <motion.div
                  key="typing"
                  className="bubble in typing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
                  aria-hidden
                >
                  <i />
                  <i />
                  <i />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="chat-input" aria-hidden>
            <span className="chat-field">הודעה</span>
            <span className="chat-mic">
              <Icon name="sms" size={18} />
            </span>
          </div>
        </div>
      </div>

      <div className="chat-controls">
        <button className="ctrl" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          <Icon name={paused ? 'playBtn' : 'pause'} size={16} />
          {paused ? 'המשך' : 'עצירה'}
        </button>
        <button
          className="ctrl"
          onClick={() => {
            newRound(round + 1);
          }}
        >
          <Icon name="replay" size={16} />
          הודעות אחרות
        </button>
      </div>
    </div>
  );
}
