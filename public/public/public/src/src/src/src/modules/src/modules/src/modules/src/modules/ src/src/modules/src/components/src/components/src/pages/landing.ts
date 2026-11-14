import { renderNavbar } from '../components/navbar';
import { renderFooter } from '../components/footer';

export function landingPage(container: HTMLElement): void {
  container.innerHTML = `
    ${renderNavbar()}
    <section class="landing">
      <div class="stars-bg"></div>
      <div class="container">
        <div class="landing-grid">
          <div>
            <h1>ASTRA</h1>
            <p class="sub">ASTRONAUT HEALTH INTELLIGENCE SYSTEM</p>
            <p class="lead">
              Long-duration missions expose astronauts to radiation, isolation, altered gravity,
              and closed environments. ASTRA monitors health indicators locally and provides
              AI decision-support — even when Earth communication is delayed.
            </p>
            <div class="landing-cta">
              <a href="/permission" data-link class="btn-primary">ENTER ASTRONAUT VISION ◈</a>
              <a href="/about" data-link class="btn-ghost">LEARN MORE</a>
            </div>
          </div>
          <div class="orbit-panel">
            <div class="orbit-core"></div>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat"><b>05</b><span>BODY SYSTEMS MONITORED</span></div>
          <div class="stat"><b>09</b><span>LIVE TELEMETRY CHANNELS</span></div>
          <div class="stat"><b>100%</b><span>ON-DEVICE PROCESSING</span></div>
        </div>
      </div>
    </section>
    ${renderFooter()}
  `;
}
