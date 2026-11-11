'use client';
import { motion } from 'framer-motion';
import { FINALE, SOURCES } from '@/content/site';
import { CONFIG } from '@/content/config';
import { Icon } from './Icons';
import { asset, shareSite } from './lib';

export default function Finale() {
  return (
    <>
      <section className="finale" id="finale" aria-labelledby="finale-title">
        <div className="finale-sky" aria-hidden>
          <span className="sun" />
          <span className="cloud c1" />
          <span className="cloud c2" />
          <span className="hill h1" />
          <span className="hill h2" />
        </div>
        <div className="wrap finale-grid">
          <div className="finale-copy">
            <motion.h2
              id="finale-title"
              className="h-display"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              הילדות שלהם.
              <br />
              <span className="blue-text">ההחלטה שלנו.</span>
            </motion.h2>
            <p className="lede">{FINALE.text}</p>
            <div className="finale-actions">
              <a href="#pact" className="btn btn-primary btn-lg">
                {FINALE.primary}
              </a>
              <button className="btn btn-outline btn-lg" onClick={() => shareSite(FINALE.shareText, CONFIG.siteUrl.replace(/\/$/, ''))}>
                <Icon name="share" size={20} /> {FINALE.secondary}
              </button>
            </div>
          </div>
          <motion.div
            className="finale-mascot"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            <span className="finale-bubble">נתראה בהפסקה! ⚽</span>
            <img src={asset('/img/mascot.webp')} alt="הצבי של ארץ הצבי בדרך לבית הספר" width={360} height={806} loading="lazy" />
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <span className="logo-chip">
              <img src={asset('/img/logo-full.webp')} alt="לוגו בית הספר ארץ הצבי – ממ״ד קהילתי-תורני, חנוך לנער על פי דרכו" width={120} height={203} loading="lazy" />
            </span>
            <p>{CONFIG.credit}</p>
          </div>
          <nav className="footer-links" aria-label="קישורים">
            <a href={SOURCES.school} target="_blank" rel="noopener noreferrer">
              אתר בית הספר
            </a>
            <a href={SOURCES.tnuligdol} target="_blank" rel="noopener noreferrer">
              תנו לגדול על שקט
            </a>
            <a href={SOURCES.devices} target="_blank" rel="noopener noreferrer">
              מכשירים בטוחים
            </a>
            <a href={SOURCES.mohYnet} target="_blank" rel="noopener noreferrer">
              המלצות משרד הבריאות (ynet)
            </a>
          </nav>
          <p className="footer-fine">
            ההודעות באתר מבוססות על הודעות אמיתיות שנשלחו ע״י ילדים ברחבי הארץ ומוצגות להמחשה בלבד. התרחישים בחוויות האינטראקטיביות בדיוניים.
          </p>
        </div>
      </footer>
    </>
  );
}
