import type { Post } from '../../lib/types';

export function BlogCard({ post }: { post: Post }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer">
      <div className="aspect-[16/10] overflow-hidden bg-surface-container-low">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={post.image} alt={post.title} loading="lazy" />
      </div>
      <div className="p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{post.category}</span>
        <h2 className="font-headline text-xl font-bold mt-2 mb-3 text-on-surface">{post.title}</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>{post.date}</span><span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
