import { Camera } from '../modules/camera';
import { Health } from '../modules/health';
import { HUD } from '../modules/hud';
import { Storage } from '../modules/storage';

export function visionPage(container: HTMLElement): void {
  document.body.classList.add('vision-active');

  container.innerHTML = `
    <div class="vision-root">
      <video id="cameraFeed" autoplay playsinline muted></video>
      <canvas id="demoCanvas" class="hidden"></canvas>

      <div class="visor-overlay">
        <div class="visor-curve top"></div>
        <div class="visor-curve bottom"></div>
        <div class="visor-left"></div>
        <div class="visor-right"></div>
        <div class="glass-glare"></div>
        <div class="scan-line"></div>
        <div class="scan-grid"></div>
      </div>

      <div id="hud" class="hud">
        <div class="hud-panel top-center">
          <div class="mission-name" id="missionName">MISSION: ARTEMIS-VII</div>
          <div class="mission-meta">
            <div class="meta-item"><span class="lbl">MET</span><span class="val" id="metClock">00:00:00</span></div>
            <div class="meta-item"><span class="lbl">UTC</span><span class="val" id="utcClock">--:--:--</span></div>
            <div class="meta-item"><span class="lbl">STATUS</span><span class="val status-eva" id="evaStatus">EVA ACTIVE</span></div>
          </div>
        </div>

        <div class="hud-panel top-left">
          <div class="panel-title">◈ ENVIRONMENT</div>
          <div class="telemetry-row"><span>Suit Pressure</span><b id="tPressure">4.3 psi</b></div>
          <div class="telemetry-row"><span>Cabin Temp</span><b id="tTemp">22.1 °C</b></div>
          <div class="telemetry-row"><span>O₂ Level</span><b id="tO2">98.2 %</b></div>
          <div class="telemetry-row"><span>CO₂</span><b id="tCO2">0.4 %</b></div>
          <div class="telemetry-row"><span>Radiation</span><b id="tRad">0.12 mSv</b></div>
        </div>

        <div class="hud-panel top-right">
          <div class="panel-title">◈ VITALS <span class="demo-badge">SIM</span></div>
          <div class="telemetry-row"><span>Heart Rate</span><b id="tHR">72 bpm</b></div>
          <div class="telemetry-row"><span>SpO₂</span><b id="tSpO2">98 %</b></div>
          <div class="telemetry-row"><span>Resp Rate</span><b id="tRR">14 /min</b></div>
          <div class="telemetry-row"><span>Body Temp</span><b id="tBody">36.7 °C</b></div>
          <canvas id="heartWave" width="220" height="42"></canvas>
        </div>

        <div class="hud-panel left-body">
          <div class="panel-title">◈ BODY SYSTEMS</div>
          <svg class="body-svg" viewBox="0 0 80 160" aria-hidden="true">
            <circle cx="40" cy="16" r="10" class="body-part" data-sys="neuro"/>
            <rect x="28" y="30" width="24" height="40" rx="6" class="body-part" data-sys="cardio"/>
            <rect x="20" y="34" width="6" height="28" rx="3" class="body-part" data-sys="resp"/>
            <rect x="54" y="34" width="6" height="28" rx="3" class="body-part" data-sys="resp"/>
            <rect x="30" y="72" width="20" height="30" rx="4" class="body-part" data-sys="immune"/>
            <rect x="30" y="104" width="8" height="48" rx="3" class="body-part" data-sys="musculo"/>
            <rect x="42" y="104" width="8" height="48" rx="3" class="body-part" data-sys="musculo"/>
          </svg>
          <div class="sys-legend">
            <span data-sys="cardio" class="sys-item">Cardio</span>
            <span data-sys="resp" class="sys-item">Resp</span>
            <span data-sys="immune" class="sys-item">Immune</span>
            <span data-sys="musculo" class="sys-item">Musculo</span>
            <span data-sys="neuro" class="sys-item">Neuro</span>
          </div>
        </div>

        <div class="hud-panel right-ai">
          <div class="panel-title">◈ AI HEALTH INTELLIGENCE</div>
          <div id="aiAlerts" class="ai-alerts">
            <div class="alert-item ok">All vitals within baseline</div>
          </div>
          <div class="ai-recommendation" id="aiRec">Recommendation: Maintain hydration. Continue monitoring.</div>
          <button id="runScanBtn" class="mini-btn">RUN HEALTH SCAN</button>
        </div>

        <div class="hud-panel bottom-left">
          <div class="id-line"><span>CREW</span><b>CDR. A. VEGA</b></div>
          <div class="id-line"><span>MISSION ID</span><b>AX-7741</b></div>
          <div class="id-line"><span>SUIT ID</span><b>EMU-3921</b></div>
        </div>

        <div class="hud-panel bottom-right">
          <div class="comms-status"><span class="dot online"></span><b id="commsState">ONLINE</b></div>
          <div class="id-line"><span>SIGNAL DELAY</span><b id="signalDelay">1.3 s</b></div>
          <div class="id-line"><span>LINK</span><b>DSN-14</b></div>
        </div>

        <div class="hud-controls">
          <button class="ctrl-btn" id="scanCtrl" title="Health Scan">◉<span>SCAN</span></button>
          <button class="ctrl-btn" id="aiCtrl" title="AI Copilot">✦<span>COPILOT</span></button>
          <button class="ctrl-btn danger" id="emergCtrl" title="Emergency">✚<span>EMERGENCY</span></button>
          <button class="ctrl-btn" id="camSwitchCtrl" title="Switch Camera">⇄<span>CAM</span></button>
          <button class="ctrl-btn" id="camToggleCtrl" title="Camera On/Off">◐<span>FEED</span></button>
          <button class="ctrl-btn" id="fsCtrl" title="Fullscreen">⛶<span>FULL</span></button>
          <button class="ctrl-btn" id="exitCtrl" title="Return Home">↩<span>EXIT</span></button>
        </div>

        <div id="scanOverlay" class="scan-overlay hidden">
          <div class="scan-circle"></div>
          <div class="scan-text" id="scanText">ANALYZING…</div>
        </div>
      </div>

      <div id="copilotPanel" class="side-panel hidden">
        <div class="side-panel-head">
          <h3>AI MEDICAL COPILOT</h3>
          <button class="close-btn" data-close="copilotPanel">✕</button>
        </div>
        <div id="chatLog" class="chat-log">
          <div class="msg bot">Hello Commander. I'm ASTRA Copilot. Ask me about your vitals, risks, or protocols.</div>
        </div>
        <div class="chat-input">
          <input id="chatInput" type="text" placeholder="Ask a health question…" />
          <button id="chatSend">SEND</button>
        </div>
        <div class="quick-prompts">
          <button data-prompt="What is my current health status?">Status</button>
          <button data-prompt="Any risk of bone loss?">Bone Loss</button>
          <button data-prompt="What should I do in a medical emergency?">Emergency</button>
          <button data-prompt="How is my cardiovascular system?">Cardio</button>
        </div>
      </div>

      <div id="emergencyPanel" class="side-panel hidden emergency">
        <div class="side-panel-head">
          <h3>⚠ EMERGENCY MEDICAL ASSISTANCE</h3>
          <button class="close-btn" data-close="emergencyPanel">✕</button>
        </div>
        <div class="emergency-body">
          <p class="pulse-red">EMERGENCY PROTOCOL ENGAGED</p>
          <ol>
            <li>Verify airway, breathing, circulation (ABC).</li>
            <li>Contact Mission Control — link status shown bottom right.</li>
            <li>Administer onboard medical kit per crew medical officer checklist.</li>
            <li>Record incident in the log below.</li>
          </ol>
          <textarea id="incidentLog" placeholder="Describe the incident…"></textarea>
          <button id="recordIncidentBtn" class="btn-primary" style="width:100%;justify-content:center;">RECORD INCIDENT</button>
          <div id="incidentSaved" class="saved-note hidden">✓ Incident recorded locally.</div>
        </div>
      </div>

      <div id="toast" class="toast hidden"></div>
    </div>
  `;

  // --- Wire up elements ---
  const video = document.getElementById('cameraFeed') as HTMLVideoElement;
  const canvas = document.getElementById('demoCanvas') as HTMLCanvasElement;
  Camera.init(video, canvas);

  const demoIntent = sessionStorage.getItem('astra_demo_mode');
  if (demoIntent === '1') {
    Camera.startDemo();
    sessionStorage.removeItem('astra_demo_mode');
  } else {
    Camera.start('environment').catch(() => {
      Camera.startDemo();
      HUD.toast('Camera unavailable — Demo Mode active');
    });
  }

  HUD.init();
  HUD.updateVitals(Health.update());
  HUD.renderAlerts(Health.analyze());
  HUD.updateComms(1.3);

  let metSeconds = 0;
  const metStart = Date.now();
  let healthTimer: number | null = null;
  let commsDelay = 1.3;

  const metTimer = window.setInterval(() => {
    metSeconds = (Date.now() - metStart) / 1000;
    HUD.updateClocks(metSeconds);
  }, 1000);

  healthTimer = window.setInterval(() => {
    HUD.updateVitals(Health.update());
    HUD.drawHeartbeat();
    if (Math.random() < 0.15) HUD.renderAlerts(Health.analyze());
  }, 1000);

  const commsTimer = window.setInterval(() => {
    commsDelay = Math.max(0.4, Math.min(4.8, commsDelay + (Math.random() - 0.5) * 0.6));
    HUD.updateComms(commsDelay);
  }, 4000);

  HUD.updateClocks(0);
  HUD.drawHeartbeat();

  // Controls
  document.getElementById('exitCtrl')?.addEventListener('click', () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  document.getElementById('camSwitchCtrl')?.addEventListener('click', async () => {
    const res = await Camera.switchCamera();
    if (res.demo) HUD.toast('Demo Mode — camera switching disabled');
    else if (res.ok) HUD.toast(`Camera: ${res.facing === 'user' ? 'FRONT' : 'REAR'}`);
    else HUD.toast('Camera switch failed');
  });

  document.getElementById('camToggleCtrl')?.addEventListener('click', () => {
    const s = Camera.getState();
    Camera.toggle(!s.isOn);
    HUD.toast(!s.isOn ? 'Camera ON' : 'Camera OFF');
  });

  document.getElementById('fsCtrl')?.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        HUD.toast('Fullscreen ON');
      } else {
        await document.exitFullscreen();
        HUD.toast('Fullscreen OFF');
      }
    } catch {
      HUD.toast('Fullscreen unavailable');
    }
  });

  async function runScan(): Promise<void> {
    HUD.showScanOverlay(true, 'INITIALIZING…');
    HUD.toast('Health scan started');
    const analysis = await Health.runScan((text) => HUD.showScanOverlay(true, text));
    HUD.showScanOverlay(false);
    HUD.renderAlerts(analysis);
    HUD.toast('Scan complete');
  }
  document.getElementById('scanCtrl')?.addEventListener('click', runScan);
  document.getElementById('runScanBtn')?.addEventListener('click', runScan);

  // Copilot
  const chatLog = document.getElementById('chatLog') as HTMLDivElement | null;
  const chatInput = document.getElementById('chatInput') as HTMLInputElement | null;
  const chatSend = document.getElementById('chatSend') as HTMLButtonElement | null;

  function addMsg(text: string, who: 'bot' | 'user'): void {
    if (!chatLog) return;
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function sendChat(text?: string): void {
    const q = (text ?? chatInput?.value ?? '').trim();
    if (!q) return;
    addMsg(q, 'user');
    if (chatInput) chatInput.value = '';
    setTimeout(() => addMsg(Health.copilotReply(q), 'bot'), 500);
  }

  document.getElementById('aiCtrl')?.addEventListener('click', () => {
    document.getElementById('copilotPanel')?.classList.remove('hidden');
    chatInput?.focus();
  });
  chatSend?.addEventListener('click', () => sendChat());
  chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
  document.querySelectorAll<HTMLButtonElement>('.quick-prompts button').forEach(btn => {
    btn.addEventListener('click', () => sendChat(btn.dataset.prompt));
  });

  // Emergency
  document.getElementById('emergCtrl')?.addEventListener('click', () => {
    document.getElementById('emergencyPanel')?.classList.remove('hidden');
  });
  document.getElementById('recordIncidentBtn')?.addEventListener('click', () => {
    const ta = document.getElementById('incidentLog') as HTMLTextAreaElement | null;
    const text = ta?.value.trim();
    if (!text) { HUD.toast('Enter incident details first'); return; }
    Storage.saveIncident(text);
    document.getElementById('incidentSaved')?.classList.remove('hidden');
    HUD.toast('Incident recorded locally');
    if (ta) ta.value = '';
  });

  // Close buttons
  document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.close;
      if (id) document.getElementById(id)?.classList.add('hidden');
    });
  });

  // Cleanup on leaving vision
  const cleanup = (): void => {
    clearInterval(metTimer);
    if (healthTimer) clearInterval(healthTimer);
    clearInterval(commsTimer);
    Camera.stop();
    document.body.classList.remove('vision-active');
    window.removeEventListener('popstate', cleanup);
  };
  window.addEventListener('popstate', cleanup);
}
