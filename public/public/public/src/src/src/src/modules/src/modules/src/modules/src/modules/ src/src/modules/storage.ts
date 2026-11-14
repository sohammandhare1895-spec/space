import type { Incident } from './types';

const INCIDENT_KEY = 'astra_incidents';

export const Storage = {
  saveIncident(text: string): Incident {
    const incident: Incident = { text, ts: new Date().toISOString() };
    try {
      const raw = localStorage.getItem(INCIDENT_KEY);
      const logs: Incident[] = raw ? JSON.parse(raw) : [];
      logs.push(incident);
      localStorage.setItem(INCIDENT_KEY, JSON.stringify(logs));
    } catch {
      // silently ignore quota / privacy errors
    }
    return incident;
  },
  getIncidents(): Incident[] {
    try {
      const raw = localStorage.getItem(INCIDENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};
