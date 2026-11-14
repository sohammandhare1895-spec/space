import type { CameraState } from './types';

export const Camera = (() => {
  let stream: MediaStream | null = null;
  let videoEl: HTMLVideoElement | null = null;
  let demoCanvas: HTMLCanvasElement | null = null;
  let currentFacing: 'environment' | 'user' = 'environment';
  let isDemo = false;
  let demoTimer: number | null = null;
  let isOn = true;

  function init(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    videoEl = video;
    demoCanvas = canvas;
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('muted', '');
  }

  async function start(facing: 'environment' | 'user' = 'environment'): Promise<{ ok: boolean; facing: string }> {
    stop();
    isOn = true;
    isDemo = false;
    currentFacing = facing;
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: facing },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoEl) {
      videoEl.srcObject = stream;
      await videoEl.play().catch(() => {});
      videoEl.classList.remove('hidden');
    }
    if (demoCanvas) demoCanvas.classList.add('hidden');
    return { ok: true, facing };
  }

  async function switchCamera(): Promise<{ ok: boolean; facing?: string; demo?: boolean; error?: unknown }> {
    if (isDemo) return { ok: false, demo: true };
    const next = currentFacing === 'environment' ? 'user' : 'environment';
    try {
      await start(next);
      return { ok: true, facing: next };
    } catch (err) {
      try { await start(currentFacing); } catch {}
      return { ok: false, error: err };
    }
  }

  function toggle(on: boolean): void {
    isOn = on;
    if (on) {
      if (isDemo) { startDemo(); return; }
      start(currentFacing).catch(() => startDemo());
    } else {
      stop();
      if (videoEl) videoEl.classList.add('hidden');
    }
  }

  function stop(): void {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (videoEl) videoEl.srcObject = null;
    if (demoTimer !== null) { clearInterval(demoTimer); demoTimer = null; }
  }

  function startDemo(): { ok: boolean; demo: boolean } {
    isDemo = true;
    isOn = true;
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (videoEl) videoEl.classList.add('hidden');
    if (demoCanvas) {
      demoCanvas.classList.remove('hidden');
      renderDemo();
    }
    return { ok: true, demo: true };
  }

  function renderDemo(): void {
    if (!demoCanvas) return;
    const ctx = demoCanvas.getContext('2d');
    if (!ctx) return;
    const W = demoCanvas.width = window.innerWidth;
    const H = demoCanvas.height = window.innerHeight;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      v: Math.random() * 0.3 + 0.05
    }));
    const nebula = [
      { x: W * 0.3, y: H * 0.4, r: 220, c: 'rgba(29,233,255,0.10)' },
      { x: W * 0.7, y: H * 0.6, r: 260, c: 'rgba(120,80,255,0.10)' },
      { x: W * 0.5, y: H * 0.3, r: 180, c: 'rgba(255,120,180,0.07)' }
    ];
    let t = 0;
    if (demoTimer !== null) clearInterval(demoTimer);
    demoTimer = window.setInterval(() => {
      ctx.fillStyle = '#000814';
      ctx.fillRect(0, 0, W, H);
      nebula.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.c);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,240,255,${0.4 + Math.sin(t * s.v) * 0.3})`;
        ctx.fill();
      });
      t += 0.05;
    }, 66);
  }

  function getState(): CameraState {
    return { isDemo, isOn, facing: currentFacing, hasStream: !!stream };
  }

  window.addEventListener('pagehide', stop);
  window.addEventListener('beforeunload', stop);

  return { init, start, switchCamera, toggle, stop, startDemo, getState };
})();
