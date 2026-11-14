import { renderNavbar } from '../components/navbar';
import { renderFooter } from '../components/footer';
import { Camera } from '../modules/camera';

export function permissionPage(container: HTMLElement): void {
  container.innerHTML = `
    ${renderNavbar()}
    <div class="center-page">
      <div class="perm-card">
        <div class="perm-icon">◉</div>
        <h2>CAMERA PERMISSION REQUIRED</h2>
        <p id="permMessage">
          ASTRA uses your device's rear camera to render the first-person astronaut visor view.
          Your camera feed is processed <strong>only on this device</strong> and is never uploaded.
        </p>
        <div class="perm-actions">
          <button id="grantCamBtn" class="btn-primary" style="width:100%;justify-content:center;">GRANT CAMERA ACCESS</button>
          <button id="demoModeBtn" class="btn-ghost" style="width:100%;">ENTER DEMO MODE</button>
        </div>
        <div class="perm-help">
          <p><strong>Troubleshooting:</strong></p>
          <ul>
            <li>Ensure the site runs on <code>https://</code> or <code>localhost</code>.</li>
            <li>iOS Safari: Settings → Safari → Camera → Allow</li>
            <li>Chrome: lock icon → Site settings → Camera → Allow</li>
          </ul>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;

  const grantBtn = document.getElementById('grantCamBtn') as HTMLButtonElement | null;
  const demoBtn = document.getElementById('demoModeBtn') as HTMLButtonElement | null;
  const message = document.getElementById('permMessage');

  grantBtn?.addEventListener('click', async () => {
    grantBtn.textContent = 'REQUESTING…';
    try {
      // Pre-check by warming up camera, then navigate.
      // visionPage will re-init and reuse.
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      testStream.getTracks().forEach(t => t.stop());
      window.history.pushState({}, '', '/vision');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      grantBtn.textContent = 'GRANT CAMERA ACCESS';
      if (message) {
        const errorName = (err as Error).name || 'Unknown';
        message.innerHTML = `
          <strong style="color:#ff6b8a;">Camera access denied or unavailable.</strong><br><br>
          Enable camera permission in your browser, or use Demo Mode to explore the HUD.<br>
          <small>Error: ${errorName}</small>
        `;
      }
    }
  });

  demoBtn?.addEventListener('click', () => {
    Camera.startDemo();
    // Persist demo intent through navigation
    sessionStorage.setItem('astra_demo_mode', '1');
    window.history.pushState({}, '', '/vision');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}
