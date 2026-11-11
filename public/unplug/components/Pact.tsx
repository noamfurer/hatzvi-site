'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PACT } from '@/content/site';
import { CONFIG } from '@/content/config';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

type Counts = Record<string, number>;
type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function Pact() {
  const [grade, setGrade] = useState('');
  const [klass, setKlass] = useState('');
  const [stance, setStance] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [counts, setCounts] = useState<Counts | null>(null);
  const [err, setErr] = useState('');

  const endpoint = CONFIG.formEndpoint;
  const wantsContact = interests.length > 0;

  useEffect(() => {
    if (!endpoint || !CONFIG.showCommunityCounter) return;
    fetch(`${endpoint}?action=counts`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.published && d.counts && Object.keys(d.counts).length) setCounts(d.counts);
      })
      .catch(() => undefined);
  }, [endpoint]);

  const toggle = (id: string) => setInterests((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade || !stance) {
      setErr('בחרו שכבה ועמדה, וזהו.');
      return;
    }
    if (hp) return;
    setErr('');
    setStatus('sending');
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ grade, klass, stance, interests, name: name.trim(), contact: contact.trim(), ts: new Date().toISOString() }),
      });
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="pact" id="pact" aria-labelledby="pact-title">
      <div className="pact-bg" aria-hidden />
      <div className="wrap pact-grid">
        <Reveal className="pact-copy">
          <p className="kicker kicker-light">{PACT.kicker} · לא לבד. ביחד.</p>
          <h2 id="pact-title" className="h-display light">
            {PACT.title}
          </h2>
          <p className="lede light">{PACT.text}</p>

          {counts && (
            <ul className="counter" aria-label="משפחות שהצטרפו לפי שכבה">
              {Object.entries(counts).map(([g, n]) => (
                <li key={g}>
                  <b>{n}</b>
                  <span>משפחות בשכבה {g}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <div className="pact-card">
          <AnimatePresence mode="wait">
            {status === 'ok' ? (
              <motion.div key="ok" className="pact-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} role="status">
                <span className="ok-badge">
                  <Icon name="check" size={40} />
                </span>
                <h3>{PACT.success}</h3>
                <p>עכשיו הכי חשוב: לשלוח את האתר להורה אחד נוסף מהכיתה.</p>
                <a href="#finale" className="btn btn-primary">
                  לשיתוף <Icon name="share" size={18} />
                </a>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <fieldset>
                  <legend>באיזו שכבה הילד/ה?</legend>
                  <div className="grade-row">
                    {PACT.grades.map((g) => (
                      <label key={g} className={`grade ${grade === g ? 'is-on' : ''}`}>
                        <input type="radio" name="grade" value={g} checked={grade === g} onChange={() => setGrade(g)} />
                        {g}
                      </label>
                    ))}
                  </div>
                  <label className="field small">
                    <span>מספר כיתה (רשות)</span>
                    <input inputMode="numeric" maxLength={2} value={klass} onChange={(e) => setKlass(e.target.value.replace(/\D/g, ''))} placeholder="למשל 2" />
                  </label>
                </fieldset>

                <fieldset>
                  <legend>איפה אתם עומדים?</legend>
                  <div className="stance-col">
                    {PACT.stances.map((s) => (
                      <label key={s.id} className={`stance ${stance === s.id ? 'is-on' : ''}`}>
                        <input type="radio" name="stance" value={s.id} checked={stance === s.id} onChange={() => setStance(s.id)} />
                        <span className="radio-dot" aria-hidden />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>נשמח גם... (רשות)</legend>
                  <div className="interest-row">
                    {PACT.interests.map((it) => (
                      <label key={it.id} className={`chk ${interests.includes(it.id) ? 'is-on' : ''}`}>
                        <input type="checkbox" checked={interests.includes(it.id)} onChange={() => toggle(it.id)} />
                        <span className="chk-box" aria-hidden>
                          <Icon name="check" size={14} />
                        </span>
                        {it.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <AnimatePresence>
                  {wantsContact && (
                    <motion.fieldset initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="contact-set">
                      <legend>איך נחזור אליכם? (רשות)</legend>
                      <div className="contact-row">
                        <label className="field">
                          <span>שם</span>
                          <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
                        </label>
                        <label className="field">
                          <span>טלפון או מייל</span>
                          <input autoComplete="tel" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={80} dir="ltr" />
                        </label>
                      </div>
                    </motion.fieldset>
                  )}
                </AnimatePresence>

                <label className="hp" aria-hidden>
                  אל תמלאו שדה זה
                  <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>

                <p className="privacy">
                  <Icon name="lock" size={16} /> {PACT.privacy}
                </p>

                {err && (
                  <p className="form-err" role="alert">
                    {err}
                  </p>
                )}
                {status === 'error' && (
                  <p className="form-err" role="alert">
                    {PACT.error}
                  </p>
                )}

                {endpoint ? (
                  <button className="btn btn-sun btn-lg btn-block" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'שולחים…' : PACT.submit}
                  </button>
                ) : (
                  <p className="soon" role="note">
                    {PACT.soon}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
