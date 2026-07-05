import { useSiteContent } from '../../lib/site-content-context';

// Floating Messenger button. (The former support chat widget + its avatar were removed.)
export function ChatWidget() {
  const { contact } = useSiteContent();
  return (
    <a
      href={contact.messenger}
      target="_blank"
      rel="noopener"
      aria-label="Messenger"
      className="fixed bottom-6 right-6 z-[9999] w-[60px] h-[60px] rounded-full bg-white border-[3px] border-[#0084FF] shadow-[0_4px_20px_rgba(0,132,255,0.35)] flex items-center justify-center hover:scale-110 transition-transform"
    >
      <svg viewBox="0 0 36 36" className="w-[34px] h-[34px] fill-[#0084FF]"><path d="M18 2.7C9.4 2.7 2.7 9 2.7 17.5c0 4.5 1.9 8.4 4.9 11.1.3.2.4.6.4.9l.1 2.7c0 .9.9 1.4 1.7 1.1l3-1.3c.3-.1.5-.1.8-.1 1.4.4 2.9.6 4.5.6 8.6 0 15.3-6.3 15.3-14.8S26.6 2.7 18 2.7zm9.2 11.7l-4.5 7.1c-.7 1.1-2.3 1.4-3.3.6l-3.6-2.7c-.3-.2-.8-.2-1.1 0l-4.8 3.7c-.6.5-1.5-.3-1-1l4.5-7.1c.7-1.1 2.3-1.4 3.3-.6l3.6 2.7c.3.2.8.2 1.1 0l4.8-3.7c.6-.5 1.5.3 1 1z" /></svg>
    </a>
  );
}
