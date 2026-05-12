import { mountTopbar } from './components/topbar/topbar';
import { initializeI18n } from './i18n';
import { syncProfileFavicon } from './lib/profile';
import './router';
import './style.css';

function pick<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`main: missing element matching '${selector}'`);
  return element;
}

initializeI18n();
syncProfileFavicon();
mountTopbar(pick('#topbar'));
