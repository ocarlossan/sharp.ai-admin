export type ThemeMode = 'light' | 'dark';

const dark = {
  bg: '#0B0F14',
  surface: '#121821',
  surface2: '#1A2230',
  border: '#222C3A',
  text: '#E6EAF0',
  textMid: '#9AA7B8',
  textDim: '#5B687A',
  accent: '#16A34A',
  accentSoft: 'rgba(22,163,74,0.12)',
  green: '#22C55E',
  red: '#EF4444',
  amber: '#F59E0B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
};

const light: typeof dark = {
  bg: '#F4F6F8',
  surface: '#FFFFFF',
  surface2: '#EEF2F7',
  border: '#E3E8EF',
  text: '#16181C',
  textMid: '#5B6672',
  textDim: '#98A2B3',
  accent: '#0B6E4F',
  accentSoft: 'rgba(11,110,79,0.10)',
  green: '#16A34A',
  red: '#DC2626',
  amber: '#D97706',
  blue: '#2563EB',
  purple: '#7C3AED',
};

const PALETTES = { light, dark };

// Objeto de tema ativo (mutável). Começa no escuro (padrão do admin).
export const T = { ...dark };

export function applyThemeMode(mode: ThemeMode) {
  Object.assign(T, PALETTES[mode]);
}

export const CHART_COLORS = ['#16A34A', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];
