import type { Vitals, Analysis } from './types';

export const Health = (() => {
  const baseline = { hr: 68, spo2: 98, rr: 14, temp: 36.6 };

  const vitals: Vitals = {
    hr: 72, spo2: 98, rr: 14, temp: 36.7,
    suitPressure: 4.3, cabinTemp: 22.1, o2: 98.2, co2: 0.4, radiation: 0.12
  };

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }
  function rand(a: number, b: number): number {
    return Math.random() * (b - a) + a;
  }

  function update(): Vitals {
    vitals.hr = clamp(vitals.hr + rand(-2, 2), 58, 96);
    vitals.spo2 = clamp(vitals.spo2 + rand(-0.4, 0.4), 94, 100);
    vitals.rr = clamp(vitals.rr + rand(-0.6, 0.6), 10, 22);
    vitals.temp = clamp(vitals.temp + rand(-0.05, 0.05), 36.0, 37.8);
    vitals.suitPressure = clamp(vitals.suitPressure + rand(-0.02, 0.02), 4.0, 4.6);
    vitals.cabinTemp = clamp(vitals.cabinTemp + rand(-0.1, 0.1), 20, 24);
    vitals.o2 = clamp(vitals.o2 + rand(-0.1, 0.1), 96, 100);
    vitals.co2 = clamp(vitals.co2 + rand(-0.01, 0.01), 0.2, 0.8);
    vitals.radiation = clamp(vitals.radiation + rand(-0.005, 0.005), 0.05, 0.3);
    return { ...vitals };
  }

  function getVitals(): Vitals { return { ...vitals }; }
  function getBaseline() { return { ...baseline }; }

  function analyze(): Analysis {
    const alerts: Analysis['alerts'] = [];
    const hrDev = Math.abs(vitals.hr - baseline.hr);
    const spo2Dev = baseline.spo2 - vitals.spo2;
    const tempDev = Math.abs(vitals.temp - baseline.temp);

    if (spo2Dev >= 2.5) alerts.push({ level: 'crit', text: `SpO₂ drop ${spo2Dev.toFixed(1)}% below baseline` });
    else if (spo2Dev >= 1.2) alerts.push({ level: 'warn', text: `SpO₂ trending low (−${spo2Dev.toFixed(1)}%)` });
    if (hrDev >= 18) alerts.push({ level: 'crit', text: `Heart rate deviation ${hrDev.toFixed(0)} bpm` });
    else if (hrDev >= 10) alerts.push({ level: 'warn', text: `Heart rate above baseline (+${hrDev.toFixed(0)})` });
    if (tempDev >= 0.8) alerts.push({ level: 'warn', text: `Body temp deviation ${tempDev.toFixed(1)}°C` });
    if (vitals.radiation > 0.22) alerts.push({ level: 'warn', text: 'Radiation dose trending high' });
    if (vitals.co2 > 0.6) alerts.push({ level: 'warn', text: `Cabin CO₂ elevated (${vitals.co2.toFixed(2)}%)` });
    if (alerts.length === 0) alerts.push({ level: 'ok', text: 'All vitals within personal baseline' });

    const systems: Analysis['systems'] = {
      cardio: hrDev < 12 && vitals.spo2 > 95 ? 'nominal' : 'elevated',
      resp: vitals.spo2 > 95 && vitals.rr < 20 ? 'nominal' : 'watch',
      immune: vitals.temp < 37.5 ? 'nominal' : 'watch',
      musculo: 'nominal',
      neuro: 'nominal'
    };

    let recommendation = 'Maintain hydration. Continue monitoring.';
    if (alerts.some(a => a.level === 'crit')) {
      recommendation = 'Recommend resting, contacting flight surgeon, and re-scanning in 5 minutes.';
    } else if (alerts.some(a => a.level === 'warn')) {
      recommendation = 'Recommend reducing exertion and repeating health scan in 10 minutes.';
    }
    return { alerts, systems, recommendation };
  }

  async function runScan(onProgress?: (text: string, pct: number) => void): Promise<Analysis> {
    const steps = [
      'CALIBRATING SENSORS…',
      'SAMPLING VITALS…',
      'COMPARING BASELINE…',
      'ANALYZING CARDIO…',
      'ANALYZING RESPIRATORY…',
      'EVALUATING RISK MODEL…',
      'SCAN COMPLETE'
    ];
    for (let i = 0; i < steps.length; i++) {
      onProgress?.(steps[i], i / (steps.length - 1));
      await new Promise(r => setTimeout(r, 500));
    }
    return analyze();
  }

  function copilotReply(question: string): string {
    const q = question.toLowerCase();
    const v = vitals;
    if (q.includes('status') || q.includes('how am i')) {
      return `Commander, your heart rate is ${v.hr.toFixed(0)} bpm, SpO₂ ${v.spo2.toFixed(0)}%, respiration ${v.rr.toFixed(0)}/min, body temp ${v.temp.toFixed(1)}°C. All indicators are within your simulated baseline. Note: these are simulated demo readings.`;
    }
    if (q.includes('bone') || q.includes('musculo')) {
      return 'Long-duration microgravity causes ~1–1.5% bone loss per month without countermeasures. Musculoskeletal risk is nominal. Bone density measurement requires future onboard DEXA hardware.';
    }
    if (q.includes('emergency') || q.includes('hurt')) {
      return 'EMERGENCY PROTOCOL: 1) Check airway, breathing, circulation. 2) Open the Emergency panel. 3) Contact Mission Control via comms. 4) Record the incident locally.';
    }
    if (q.includes('cardio') || q.includes('heart')) {
      return `Cardiovascular: HR ${v.hr.toFixed(0)} bpm vs baseline 68. SpO₂ ${v.spo2.toFixed(0)}%. No arrhythmia pattern in simulated waveform. This is decision-support, not a diagnosis.`;
    }
    if (q.includes('radiat')) {
      return `Current simulated radiation dose is ${v.radiation.toFixed(2)} mSv. Maintain shielding protocols and track cumulative dose.`;
    }
    if (q.includes('oxygen') || q.includes('spo2')) {
      return `SpO₂ is ${v.spo2.toFixed(0)}%. Real SpO₂ needs a pulse oximeter — a browser camera cannot measure it. Treat as simulated.`;
    }
    return "I'm analyzing your simulated health data. Ask about vitals, bone loss, radiation, cardiovascular, or emergency protocols. All readings in this demo are simulated.";
  }

  return { update, getVitals, getBaseline, analyze, runScan, copilotReply };
})();
