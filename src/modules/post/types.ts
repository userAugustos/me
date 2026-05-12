import type { FeedKind } from '../feed/types';

export interface GeneratedPost {
  slug: string;
  kind: FeedKind;
  date: string;
  meta: string;
  title: string;
  html: string;
  tags: string[];
}
