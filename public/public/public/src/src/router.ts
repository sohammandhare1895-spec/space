export interface Route {
  path: string;
  render: (container: HTMLElement) => void | Promise<void>;
}

export class Router {
  private routes: Route[];
  private container: HTMLElement | null = null;

  constructor(routes: Route[]) {
    this.routes = routes;
    window.addEventListener('popstate', () => this.resolve());
  }

  mount(container: HTMLElement): void {
    this.container = container;
    this.resolve();
    // Intercept internal link clicks
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('[data-link]');
      if (target && target instanceof HTMLAnchorElement) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.navigate(href);
        }
      }
    });
  }

  navigate(path: string): void {
    if (window.location.pathname !== path) {
      history.pushState({}, '', path);
    }
    this.resolve();
  }

  private resolve(): void {
    if (!this.container) return;
    const path = window.location.pathname;
    const route = this.routes.find(r => r.path === path) 
                ?? this.routes.find(r => r.path === '*');
    if (route) {
      this.container.innerHTML = '';
      // Leave vision mode: stop camera
      if (path !== '/vision') {
        import('./modules/camera').then(m => m.Camera.stop());
      }
      route.render(this.container);
    }
  }
}
