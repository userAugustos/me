import { mountFeed } from '../feed/feed';
import { items as tickerItems } from '../ticker/items';
import { renderTicker } from '../ticker/render-ticker';
import { items as elsewhereLinks } from './components/elsewhere/items';
import { renderElsewhere } from './components/elsewhere/render-elsewhere';
import { items as shippingItems } from './components/now-shipping/items';
import { renderNowShipping } from './components/now-shipping/render-now-shipping';
import template from './home.html?raw';
// import { mountCommitChart } from '../commit-chart/commit-chart'
import { attachIntroParallax } from './components/intro-parallax/intro-parallax';
import { subscribeToLocale, t, translateFragment } from '../../i18n';

function pick<T extends HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`home: missing element matching '${selector}'`);
  return element;
}

export function renderHome(root: HTMLElement): () => void {
  document.title = t('site.title');
  root.innerHTML = template;
  translateFragment(root);

  renderTicker(pick(root, '[data-ticker]'), tickerItems);
  const feedCleanup = mountFeed(
    pick(root, '[data-feed]'),
    pick(root, '[data-filters]'),
  );
  renderNowShipping(pick(root, '[data-now-shipping]'), shippingItems);
  // const commitChartCleanup = mountCommitChart(pick(root, '[data-commit-chart]'))
  renderElsewhere(pick(root, '[data-elsewhere]'), elsewhereLinks);
  const parallaxCleanup = attachIntroParallax(
    pick(root, '[data-parallax-target]'),
  );
  const localeCleanup = subscribeToLocale(() => {
    document.title = t('site.title');
    translateFragment(root);
  });

  return () => {
    localeCleanup();
    feedCleanup();
    // commitChartCleanup()
    parallaxCleanup();
  };
}
