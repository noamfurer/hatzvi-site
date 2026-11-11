'use client';
import { motion } from 'framer-motion';
import { WHY } from '@/content/site';
import { Icon } from './Icons';
import { Reveal } from './MotionProvider';

const STAMPS = ['עכשיו', 'לפני 2 דק׳', '23:41', 'לפני שעה', 'אתמול'];

export default function Why() {
  return (
    <section className="why" id="why" aria-labelledby="why-title">
      <div className="wrap why-grid">
        <div className="why-head">
          <Reveal>
            <p className="kicker kicker-light">{WHY.kicker}</p>
            <h2 id="why-title" className="h-display light">
              הסמארטפון
              <br />
              יכול לחכות.
              <br />
              <span className="sun-text">הילדות לא.</span>
            </h2>
            <p className="why-lede">
              חמש התראות שאף ילד בכיתות היסוד לא צריך לקבל. <br className="hide-mobile" />
              ואף הורה לא צריך להתמודד איתן לבד.
            </p>
          </Reveal>
        </div>

        <ol className="notif-stack" aria-label="חמש סיבות לחכות">
          {WHY.items.map((it, i) => (
            <motion.li
              key={it.title}
              className={`notif notif-${i + 1}`}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: [0, -0.6, 0.8, -0.4, 0.3][i] }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.09 }}
            >
              <span className="notif-icon">
                <Icon name={it.icon} size={26} />
              </span>
              <span className="notif-body">
                <span className="notif-top">
                  <b>{it.title}</b>
                  <time>{STAMPS[i]}</time>
                </span>
                <span className="notif-text">{it.text}</span>
              </span>
              <span className="notif-num" aria-hidden>
                0{i + 1}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
