import type { Vitals, Analysis } from './types';

export const HUD = (() => {
  let heartCtx: CanvasRenderingContext2D | null = null;
  let heartCanvas: HTMLCanvasElement | null = null;
  const waveData: number[] = new Array(60).fill(0);
  let waveIndex = 0;

  function init(): void {
    heartCanvas = document.getElementById('heartWave') as HTMLCanvasElement | null;
    if (heartCanvas) heartCtx = heartCanvas.getContext('2d');
  }

  function setText(id: string, text: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fmtClock(sec: number): string {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function updateClocks(metSeconds: number): void {
    setText('metClock', fmtClock(metSeconds));
    setText('utcClock', new Date().toISOString().slice(11, 19));
  }

  function updateVitals(v: Vitals): void {
    setText('tPressure', `${v.suitPressure.toFixed(1)} psi`);
    setText('tTemp', `${v.cabinTemp.toFixed(1)} °C`);
    setText('tO2', `${v.o2.toFixed(1)} %`);
    setText('tCO2', `${v.co2.toFixed(2)} %`);
    setText('tRad', `${v.radiation.toFixed(2)} mSv`);
    setText('tHR', `${Math.round(v.hr)} bpm`);
    setText('tSpO2', `${Math.round(v.spo2)} %`);
    setText('tRR', `${Math.round(v.rr)} /min`);
    setText('tBody', `${v.temp.toFixed(1)} °C`);
  }

  function drawHeartbeat(): void {
    if (!heartCtx || !heartCanvas) return;
    const W = heartCanvas.width, H = heartCanvas.height;
    waveIndex++;
    const phase = (waveIndex % 30) / 30;
    let val = 0;
    if (phase < 0.05) val = 1;
    else if (phase < 0.12) val = -0.3;
    else if (phase < 0.2) val = 0.5;
    else if (phase < 0.5) val = 0.1 * Math.sin(phase * 40);
    waveData.shift();
    waveData.push(val);

    heartCtx.clearRect(0, 0, W, H);
    heartCtx.strokeStyle = '#1de9ff';
    heartCtx.lineWidth = 1.5;
    heartCtx.shadowColor = '#1de9ff';
    heartCtx.shadowBlur = 6;
    heartCtx.beginPath();
    const step = W / (waveData.length - 1);
    waveData.forEach((v, i) => {
      const x = i * step;
      const y = H / 2 - v * (H / 2 - 3);
      i === 0 ? heartCtx!.moveTo(x, y) : heartCtx!.lineTo(x, y);
    });
    heartCtx.stroke();
    heartCtx.shadowBlur = 0;
  }

  function renderAlerts(analysis: Analysis): void {
    const box = document.getElementById('aiAlerts');
    if (!box) return;
    box.innerHTML = '';
    analysis.alerts.forEach(a => {
      const div = document.createElement('div');
      const cls = a.level === 'ok' ? 'ok' : a.level === 'warn' ? 'warn' : 'crit';
      div.className = `alert-item ${cls}`;
      div.textContent = a.text;
      box.appendChild(div);
    });
    setText('aiRec', `Recommendation: ${analysis.recommendation}`);
    highlightSystems(analysis.systems);
  }

  function highlightSystems(systems: Record<string, string>): void {
    document.querySelectorAll<HTMLElement>('.body-part, .sys-item').forEach(el => {
      const sys = el.dataset.sys;
      if (sys) {
        const state = systems[sys];
        el.classList.toggle('active', state === 'elevated' || state === 'watch');
      }
    });
  }

  function updateComms(delay: number): void {
    const online = delay < 5;
    setText('commsState', online ? 'ONLINE' : 'DELAYED');
    setText('signalDelay', `${delay.toFixed(1)} s`);
    const dot = document.querySelector('.comms-status .dot');
    if (dot) dot.classList.toggle('online', online);
  }

  function toast(msg: string, ms = 2200): void {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    const timerId = (t as any)._timer as number | undefined;
    if (timerId) clearTimeout(timerId);
    (t as any)._timer = window.setTimeout(() => t.classList.add('hidden'), ms);
  }

  function showScanOverlay(show: boolean, text?: string): void {
    const o = document.getElementById('scanOverlay');
    if (!o) return;
    o.classList.toggle('hidden', !show);
    if (text) setText('scanText', text);
  }

  function applyBrightness(pct: number): void {
    const v = document.querySelector<HTMLElement>('.vision-root');
    if (v) v.style.filter = `brightness(${pct / 100})`;
  }

  return {
    init, updateClocks, updateVitals, drawHeartbeat,
    renderAlerts, updateComms, toast, showScanOverlay, applyBrightness, setText
  };
})();
