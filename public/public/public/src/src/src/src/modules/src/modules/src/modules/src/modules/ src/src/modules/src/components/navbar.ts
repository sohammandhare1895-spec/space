export function renderNavbar(): string {
  return `
    <header class="navbar">
      <a href="/" data-link class="brand">
        <span class="brand-dot"></span> ASTRA
      </a>
      <nav>
        <a href="/" data-link>HOME</a>
        <a href="/about" data-link>ABOUT</a>
        <a href="/permission" data-link>VISION</a>
      </nav>
    </header>
  `;
}
