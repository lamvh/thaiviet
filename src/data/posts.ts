import type { Post } from '../lib/types';
import content from '../content/site-content.json';

// Editable blog posts — sourced from site-content.json (managed via /admin).
export const POSTS: Post[] = content.posts as unknown as Post[];
