'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (p: string) => `${BASE}${p}`;

/** העתקה ללוח עם משוב קצר */
export function useCopy(timeout = 2200) {
  const [copied, setCopied] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = useCallback(
    async (text: string, key = 'default') => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setCopied(key);
        if (t.current) clearTimeout(t.current);
        t.current = setTimeout(() => setCopied(null), timeout);
      } catch {
        setCopied(null);
      }
    },
    [timeout],
  );
  return { copied, copy };
}

export const waLink = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

/** שיתוף: Web Share אם קיים, אחרת וואטסאפ */
export async function shareSite(text: string, url: string) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: 'ארץ הצבי | נותנים לילדים לגדול', text, url });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  window.open(waLink(`${text}\n${url}`), '_blank', 'noopener');
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** האם האלמנט נראה כרגע במסך */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
