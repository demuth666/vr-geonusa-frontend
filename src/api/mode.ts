export const isMock: boolean = (import.meta.env.VITE_API_MODE ?? 'mock') !== 'real';
export const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? '';
