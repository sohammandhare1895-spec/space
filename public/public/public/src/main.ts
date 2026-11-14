import './styles.css';
import { Router } from './router';
import { landingPage } from './pages/landing';
import { permissionPage } from './pages/permission';
import { visionPage } from './pages/vision';
import { aboutPage } from './pages/about';
import { notFoundPage } from './pages/notfound';

const router = new Router([
  { path: '/', render: landingPage },
  { path: '/about', render: aboutPage },
  { path: '/permission', render: permissionPage },
  { path: '/vision', render: visionPage },
  { path: '*', render: notFoundPage }
]);

const app = document.getElementById('app');
if (app) router.mount(app);

// Cleanup stream on navigation away from vision
window.addEventListener('beforeunload', () => {
  import('./modules/camera').then(m => m.Camera.stop());
});
