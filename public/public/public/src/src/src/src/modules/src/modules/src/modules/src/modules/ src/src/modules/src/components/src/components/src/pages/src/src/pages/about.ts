import { renderNavbar } from '../components/navbar';
import { renderFooter } from '../components/footer';

export function aboutPage(container: HTMLElement): void {
  container.innerHTML = `
    ${renderNavbar()}
    <section class="page-section">
      <div class="container">
        <h2>ABOUT ASTRA</h2>
        <p>
          Project ASTRA is an immersive astronaut health intelligence system built for the
          NASA Space Apps Challenge. It explores how future crews on long-duration missions
          can monitor their own health, understand risks, and act autonomously when Earth
          communication is delayed.
        </p>
        <p>
          The experience uses your device's camera to render a first-person astronaut helmet
          visor. All processing happens locally — your camera feed is never uploaded.
        </p>
        <h2 style="margin-top:60px;">KEY FEATURES</h2>
        <div class="feature-list">
          <div class="feature-item">
            <h3>LIVE VISION</h3>
            <p>Full-screen camera feed with a curved helmet visor HUD and animated scan lines.</p>
          </div>
          <div class="feature-item">
            <h3>HEALTH TELEMETRY</h3>
            <p>Simulated vitals (HR, SpO₂, respiration, temperature) with ECG waveform.</p>
          </div>
          <div class="feature-item">
            <h3>AI HEALTH COPILOT</h3>
            <p>Ask health questions and receive contextual, on-device guidance.</p>
          </div>
          <div class="feature-item">
            <h3>EMERGENCY MODE</h3>
            <p>Medical checklist, incident logging, and offline-first workflow.</p>
          </div>
          <div class="feature-item">
            <h3>BODY SYSTEMS VIEW</h3>
            <p>Cardio, respiratory, immune, musculoskeletal, and neurological status.</p>
          </div>
          <div class="feature-item">
            <h3>DECISION SUPPORT</h3>
            <p>Baseline comparison and risk alerts — never a medical diagnosis.</p>
          </div>
        </div>
        <h2 style="margin-top:60px;">IMPORTANT DISCLAIMER</h2>
        <p>
          A browser camera cannot measure SpO₂, blood pressure, radiation dose, bone density,
          or immune function. All such readings in this app are explicitly labeled as simulated
          demo data. Real integrations require onboard medical hardware and APIs.
        </p>
      </div>
    </section>
    ${renderFooter()}
  `;
}
