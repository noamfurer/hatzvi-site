'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '@/content/site';
import { Icon } from './Icons';
import { asset } from './lib';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="ארץ הצבי – לראש העמוד">
          <img src={asset('/img/logo-mark.webp')} alt="" width={44} height={58} />
          <span className="brand-text">
            <b>ארץ הצבי</b>
            <small>נותנים לילדים לגדול</small>
          </span>
        </a>

        <nav className="nav-desktop" aria-label="ניווט ראשי">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="#pact" className="btn btn-sun btn-sm">
            מצטרפים ליוזמה
          </a>
          <button
            className="menu-btn"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="nav-mobile"
            aria-label="ניווט"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {NAV.map((n, i) => (
              <motion.a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <span>{n.label}</span>
                <Icon name="arrow" size={20} />
              </motion.a>
            ))}
            <a href="#pact" className="btn btn-sun btn-block" onClick={() => setOpen(false)}>
              מצטרפים ליוזמה
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
