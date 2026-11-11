import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { name: string; size?: number };

/** סט אייקונים אחיד: קו עגול 2.2, פינות רכות, מילוי משני ב-currentColor שקוף */
const paths: Record<string, React.ReactNode> = {
  'bell-off': (
    <>
      <path d="M8.5 4.8A6 6 0 0 1 18 9.6c0 3.3.8 5.2 1.7 6.4H8" />
      <path d="M6.2 7.4A6 6 0 0 0 6 9.6c0 3.3-.8 5.2-1.7 6.4H12" />
      <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
      <path d="M3 3l18 18" />
    </>
  ),
  moon: (
    <>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" fill="currentColor" fillOpacity=".15" />
      <path d="M16 3.5v2M15 4.5h2M19.5 8v1.6M18.7 8.8h1.6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="currentColor" fillOpacity=".12" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 20 20 4" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6.5 3h11M6.5 21h11" />
      <path d="M7.5 3c0 4.5 4.5 5.5 4.5 9s-4.5 4.5-4.5 9M16.5 3c0 4.5-4.5 5.5-4.5 9s4.5 4.5 4.5 9" />
      <path d="M9.5 18.5h5L12 16Z" fill="currentColor" />
    </>
  ),
  crowd: (
    <>
      <circle cx="12" cy="7.5" r="3" fill="currentColor" fillOpacity=".15" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="5" cy="9.5" r="2.2" />
      <circle cx="19" cy="9.5" r="2.2" />
      <path d="M1.8 18a3.6 3.6 0 0 1 4-3.3M22.2 18a3.6 3.6 0 0 0-4-3.3" />
    </>
  ),
  friends: (
    <>
      <circle cx="8" cy="8" r="3.2" fill="currentColor" fillOpacity=".15" />
      <circle cx="16.5" cy="9" r="2.7" />
      <path d="M2.5 20c.4-3.4 2.8-5.5 5.5-5.5s5.1 2.1 5.5 5.5M13.5 15.2c.9-.6 1.9-.9 3-.9 2.4 0 4.3 1.8 4.7 4.7" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" fill="currentColor" fillOpacity=".12" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  kite: (
    <>
      <path d="M14 3 21 10l-7 7-4-11Z" fill="currentColor" fillOpacity=".15" />
      <path d="M14 3l-4 3 4 11M21 10l-11-4" />
      <path d="M10 17c-1.5 1-1 2.6-3 3s-2.5-1-4 .5" />
    </>
  ),
  path: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.5 18h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" />
      <path d="M17 1.8 19.5 4 17 6.2" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.6" fill="currentColor" fillOpacity=".12" />
      <rect x="9" y="5" width="6" height="5" rx="1" />
      <path d="M9.5 13h.01M12 13h.01M14.5 13h.01M9.5 15.5h.01M12 15.5h.01M14.5 15.5h.01M9.5 18h.01M12 18h.01M14.5 18h.01" strokeWidth="2.6" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" fill="currentColor" fillOpacity=".12" />
      <path d="M10.5 5h3M11 18.5h2" />
    </>
  ),
  watch: (
    <>
      <path d="M8.5 6.5 9.5 2.5h5l1 4M8.5 17.5l1 4h5l1-4" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="currentColor" fillOpacity=".12" />
      <path d="M12 9.5V12l1.8 1.3" />
    </>
  ),
  none: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".1" />
      <path d="M8 15.5c1-1.4 2.4-2 4-2s3 .6 4 2" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="3" />
    </>
  ),
  call: (
    <path d="M5 3.5h3l1.6 4.2-2 1.3a10 10 0 0 0 7.4 7.4l1.3-2 4.2 1.6v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3 5.6a2 2 0 0 1 2-2.1Z" fill="currentColor" fillOpacity=".15" />
  ),
  sms: (
    <>
      <path d="M4 5h16v11H10l-4.5 3.5V16H4Z" fill="currentColor" fillOpacity=".12" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  parents: (
    <>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="11" r="2" fill="currentColor" fillOpacity=".2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M14 20a3 3 0 0 1 6 0" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".12" />
      <path d="M12 3.5c-2 2.5-2 14.5 0 17M3.5 12c2.5-2 14.5-2 17 0M5.5 6.5c3 1.5 10 1.5 13 0M5.5 17.5c3-1.5 10-1.5 13 0" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 10.8 15.8 6.7M8.2 13.2l7.6 4.1" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.2-4A8.3 8.3 0 1 1 8.4 19Z" />
      <path d="M9 8.5c0 3.5 2.8 6.5 6.4 6.6l.9-1.6-1.9-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-1.9Z" fill="currentColor" stroke="none" />
    </>
  ),
  arrow: <path d="M19 12H5M11 6l-6 6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pause: <path d="M9 5v14M15 5v14" strokeWidth="3" />,
  playBtn: <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />,
  next: <path d="M15 6l-6 6 6 6" />,
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  replay: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4.5h4.5" />
    </>
  ),
  shield: <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6Z" fill="currentColor" fillOpacity=".12" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity=".12" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  sparkle: <path d="M12 3c.8 4.5 2.5 6.2 7 7-4.5.8-6.2 2.5-7 7-.8-4.5-2.5-6.2-7-7 4.5-.8 6.2-2.5 7-7Z" fill="currentColor" fillOpacity=".2" />,
};

export function Icon({ name, size = 24, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name] ?? null}
    </svg>
  );
}
