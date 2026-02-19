import { PatternConfig } from './types';

export const patterns: PatternConfig[] = [
  {
    id: 'none',
    name: 'None',
    css: '',
  },
  {
    id: 'dots',
    name: 'Dots',
    css: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
  },
  {
    id: 'lines',
    name: 'Lines',
    css: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      currentColor 10px,
      currentColor 11px
    )`,
  },
  {
    id: 'grid',
    name: 'Grid',
    css: `linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(90deg, currentColor 1px, transparent 1px)`,
  },
  {
    id: 'grain',
    name: 'Grain',
    css: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
  },
  {
    id: 'topographic',
    name: 'Topographic',
    css: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10c22 0 40 18 40 40s-18 40-40 40S10 72 10 50 28 10 50 10z' fill='none' stroke='currentColor' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M50 20c17 0 30 13 30 30s-13 30-30 30-30-13-30-30 13-30 30-30z' fill='none' stroke='currentColor' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M50 30c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z' fill='none' stroke='currentColor' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  },
  {
    id: 'waves',
    name: 'Waves',
    css: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10' fill='none' stroke='currentColor' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  },
  {
    id: 'crosshatch',
    name: 'Crosshatch',
    css: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      currentColor 10px,
      currentColor 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      currentColor 10px,
      currentColor 11px
    )`,
  },
];

export function getPatternStyle(patternId: string, color: string): React.CSSProperties {
  const pattern = patterns.find((p) => p.id === patternId);
  if (!pattern || pattern.id === 'none') return {};

  const bgSize =
    patternId === 'dots'
      ? '20px 20px'
      : patternId === 'grid'
        ? '20px 20px'
        : patternId === 'topographic'
          ? '100px 100px'
          : patternId === 'waves'
            ? '100px 20px'
            : undefined;

  // Replace currentColor with actual color
  const css = pattern.css.replace(/currentColor/g, color);

  return {
    backgroundImage: css,
    backgroundSize: bgSize,
    opacity: 0.08,
  };
}
