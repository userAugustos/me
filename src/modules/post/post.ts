import { createActor } from 'xstate';
import { subscribeToLocale } from '../../i18n';
import { createLoadingMachine } from '../../lib/loading-machine';
import { loadPost } from './load';
import {
  renderGeneratedPost,
  renderPostError,
  renderPostSkeleton,
} from './render-post';
import type { GeneratedPost } from './types';

export function renderPost(
  root: HTMLElement,
  params: Record<string, string>,
): () => void {
  // should not be `postId` here, but we're loading by name for now
  const slug = params.postId;
  const actor = createActor(
    createLoadingMachine<GeneratedPost>(() => loadPost(slug)),
  );

  const updateView = (): void => {
    const snapshot = actor.getSnapshot();

    if (snapshot.matches('loading')) {
      renderPostSkeleton(root);
    } else if (snapshot.matches('error')) {
      renderPostError(root, () => actor.send({ type: 'TRIGGER' }));
    } else if (snapshot.matches('idle') && snapshot.context.data) {
      renderGeneratedPost(root, snapshot.context.data);
    }
  };
  actor.subscribe(() => {
    updateView();
  });

  actor.start();
  actor.send({ type: 'TRIGGER' });
  const localeCleanup = subscribeToLocale(updateView);

  return () => {
    localeCleanup();
    actor.stop();
  };
}
