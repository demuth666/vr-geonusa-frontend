/**
 * Ikon SVG inline — disalin apa adanya dari VR-GeoNusa LFS (public/index.html).
 * Semua dekoratif (aria-hidden); label aksesibel ada di elemen induknya.
 */
type P = { className?: string };
const a = { 'aria-hidden': true } as const;

export const CompassIcon = ({ stroke = '#fff', fill = '#fff' }: { stroke?: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    <path d="m10 10 1.5 4 1.5-4L14 8l-4 2z" fill={fill} />
  </svg>
);

export const FlagIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PlayIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...a}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

export const BookIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const HomeIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LayersIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MapPinIcon = ({ thin }: { thin?: boolean }) =>
  thin ? (
    <svg viewBox="0 0 24 24" fill="none" {...a}>
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" {...a}>
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

export const GlobeIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const GlobeThinIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const CheckIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ArrowRightIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GamepadIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 12h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15 10h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="2" y="6" width="20" height="12" rx="5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const NavigateIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M3 11l19-9-9 19-2-8-8-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MouseIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <rect x="6" y="3" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="2" />
    <path d="M12 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HeadsetIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <rect x="2" y="7" width="20" height="11" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="15.5" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 12.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const UsersIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const StarIcon = (_: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...a}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" />
  </svg>
);

/** Logo splash tur 360° LFS (public/vr/tour-borobudur.html). */
export const SplashLogo = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...a}>
    <circle cx="32" cy="32" r="30" stroke="#818CF8" strokeWidth="1.5" opacity="0.4" />
    <polygon points="32,8 52,44 12,44" stroke="#38BDF8" strokeWidth="1.8" fill="rgba(56,189,248,0.08)" />
    <rect x="22" y="44" width="20" height="8" rx="2" stroke="#A78BFA" strokeWidth="1.5" fill="rgba(167,139,250,0.08)" />
    <circle cx="32" cy="28" r="5" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.1)" />
  </svg>
);
