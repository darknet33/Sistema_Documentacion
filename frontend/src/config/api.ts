export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_PREFIX = '/api/' + (import.meta.env.VITE_API_VERSION || 'v1');

export const FULL_API_URL = `${API_BASE_URL}${API_PREFIX}`;
