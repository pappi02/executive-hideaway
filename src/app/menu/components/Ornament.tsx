import { venue } from '../data/venue';
import { assetPath } from '../lib/basePath';

/** A centred rule with a lozenge at its middle — the book's section divider. */
export function Rule({ width = 120, tone = 'brass' }: { width?: number; tone?: 'brass' | 'ink' }) {
  const color = tone === 'brass' ? 'var(--color-brass)' : 'rgba(10,10,11,0.4)';
  return (
    <svg width={width} height="9" viewBox={`0 0 ${width} 9`} fill="none" aria-hidden="true">
      <line x1="0" y1="4.5" x2={width / 2 - 9} y2="4.5" stroke={color} strokeWidth="0.75" opacity="0.7" />
      <line x1={width / 2 + 9} y1="4.5" x2={width} y2="4.5" stroke={color} strokeWidth="0.75" opacity="0.7" />
      <path d={`M${width / 2} 0.5 L${width / 2 + 4} 4.5 L${width / 2} 8.5 L${width / 2 - 4} 4.5 Z`} fill={color} />
    </svg>
  );
}

/** Flat hairline used under running heads, where a lozenge would be fussy. */
export function Hairline({ width = 64, tone = 'brass' }: { width?: number; tone?: 'brass' | 'ink' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width,
        height: 1,
        background: tone === 'brass' ? 'var(--color-brass)' : 'rgba(10,10,11,0.35)',
        opacity: 0.8,
      }}
    />
  );
}

/** The house mark: the palm-and-sun emblem from the resort logo. `ink` is the navy cut for bone stock. */
export function Monogram({ size = 56, tone = 'brass' }: { size?: number; tone?: 'brass' | 'ink' }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetPath(tone === 'ink' ? '/images/hideaway-emblem.svg' : '/images/hideaway-emblem-light.svg')}
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round(size * (415 / 422))}
      style={{ display: 'inline-block' }}
      draggable={false}
    />
  );
}

/** The full resort logo: emblem and wordmark. */
export function BrandLogo({ width = 240 }: { width?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetPath('/images/hideaway-logo-light.svg')}
      alt={`${venue.name} ${venue.descriptor}`}
      width={width}
      height={Math.round(width * (591 / 509))}
      style={{ display: 'block', marginInline: 'auto', height: 'auto', maxWidth: '100%' }}
      draggable={false}
    />
  );
}

/** Corner filigree for the cover — four thin brass brackets. */
export function CornerBrackets({ inset = 26, length = 46 }: { inset?: number; length?: number }) {
  const corners = [
    { x: inset, y: inset, dx: 1, dy: 1 },
    { x: 720 - inset, y: inset, dx: -1, dy: 1 },
    { x: inset, y: 1000 - inset, dx: 1, dy: -1 },
    { x: 720 - inset, y: 1000 - inset, dx: -1, dy: -1 },
  ];
  return (
    <svg
      viewBox="0 0 720 1000"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 3 }}
    >
      {corners.map((c, i) => (
        <path
          key={i}
          d={`M${c.x} ${c.y + c.dy * length} L${c.x} ${c.y} L${c.x + c.dx * length} ${c.y}`}
          stroke="var(--color-brass)"
          strokeWidth="0.9"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}
