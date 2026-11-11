'use client';
import { motion } from 'framer-motion';
import { TOOLKIT } from '@/content/site';
import { Icon } from './Icons';
import { asset } from './lib';

export default function ToolkitIntro() {
  return (
    <section className="toolkit" id="toolkit" aria-labelledby="toolkit-title">
      <div className="wrap">
        <div className="kit-label">
          <motion.img
            className="peek"
            src={asset('/img/mascot-head.webp')}
            alt=""
            width={150}
            height={131}
            loading="lazy"
            initial={{ y: 60, rotate: -8 }}
            whileInView={{ y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          />
          <p className="kit-stamp">{TOOLKIT.kicker}</p>
          <h2 id="toolkit-title" className="h-section">
            {TOOLKIT.title}
          </h2>
          <ol className="tool-index">
            {TOOLKIT.tools.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
              >
                <a href={`#${t.id}`}>
                  <span className="ti-n">{t.n}</span>
                  <span className="ti-l">{t.label}</span>
                  <Icon name="down" size={18} />
                </a>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
