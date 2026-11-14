import { renderNavbar } from '../components/navbar';
import { renderFooter } from '../components/footer';

export function notFoundPage(container: HTMLElement): void {
  container.innerHTML = `
    ${renderNavbar()}
    <div class="center-page">
      <div class="perm-card">
        <div class="perm-icon">⚠</div>
        <h2>404 — SIGNAL LOST</h2>
        <p>This sector of the orbital map is uncharted.</p>
        <a href="/" data-link class="btn-primary" style="margin-top:20px;">RETURN TO BASE</a>
      </div>
    </div>
    ${renderFooter()}
  `;
}
