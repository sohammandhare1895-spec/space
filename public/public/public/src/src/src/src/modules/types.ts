export interface Vitals {
  hr: number;
  spo2: number;
  rr: number;
  temp: number;
  suitPressure: number;
  cabinTemp: number;
  o2: number;
  co2: number;
  radiation: number;
}

export interface Alert {
  level: 'ok' | 'warn' | 'crit';
  text: string;
}

export interface Analysis {
  alerts: Alert[];
  systems: Record<string, 'nominal' | 'elevated' | 'watch'>;
  recommendation: string;
}

export interface CameraState {
  isDemo: boolean;
  isOn: boolean;
  facing: 'environment' | 'user';
  hasStream: boolean;
}

export interface Incident {
  text: string;
  ts: string;
}
