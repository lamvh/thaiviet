import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { MESSENGER } from '../../data/nav';

const AVATAR = 'https://project.vinapage.com/thaivietconz/images/support.png';

export function ChatWidget() {
  const { open, openChat, closeChat, toggle, messages, typing, send } = useChat();
  const [greeting, setGreeting] = useState(false);
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setGreeting(true), 3500); return () => clearTimeout(t); }, []);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [messages, typing, open]);

  const submit = () => { send(text); setText(''); };

  return (
    <>
      {greeting && !open && (
        <button onClick={() => { setGreeting(false); openChat(); }} className="fixed bottom-[90px] right-[86px] z-[9997] bg-white rounded-[16px_16px_4px_16px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] pl-[54px] pr-4 py-3 text-left text-[13.5px] max-w-[230px] leading-snug">
          <img src={AVATAR} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full object-cover" />
          👋 Hi! Need help with your painting project? I'm here to assist!
        </button>
      )}

      <a href={MESSENGER} target="_blank" rel="noopener" aria-label="Messenger" className="fixed bottom-[96px] right-6 z-[9999] w-[60px] h-[60px] rounded-full bg-white border-[3px] border-[#0084FF] shadow-[0_4px_20px_rgba(0,132,255,0.35)] flex items-center justify-center hover:scale-110 transition-transform">
        <svg viewBox="0 0 36 36" className="w-[34px] h-[34px] fill-[#0084FF]"><path d="M18 2.7C9.4 2.7 2.7 9 2.7 17.5c0 4.5 1.9 8.4 4.9 11.1.3.2.4.6.4.9l.1 2.7c0 .9.9 1.4 1.7 1.1l3-1.3c.3-.1.5-.1.8-.1 1.4.4 2.9.6 4.5.6 8.6 0 15.3-6.3 15.3-14.8S26.6 2.7 18 2.7zm9.2 11.7l-4.5 7.1c-.7 1.1-2.3 1.4-3.3.6l-3.6-2.7c-.3-.2-.8-.2-1.1 0l-4.8 3.7c-.6.5-1.5-.3-1-1l4.5-7.1c.7-1.1 2.3-1.4 3.3-.6l3.6 2.7c.3.2.8.2 1.1 0l4.8-3.7c.6-.5 1.5.3 1 1z" /></svg>
      </a>

      <button onClick={toggle} aria-label="Chat" className="fixed bottom-6 right-6 z-[9999] w-[60px] h-[60px] rounded-full bg-white border-[3px] border-primary shadow-[0_4px_20px_rgba(186,0,19,0.35)] overflow-hidden hover:scale-110 transition-transform">
        <img src={AVATAR} alt="Chat" className="w-full h-full object-cover" />
      </button>

      {open && (
        <div className="fixed bottom-[90px] right-6 z-[9998] w-[360px] max-w-[calc(100vw-32px)] h-[480px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-3.5 flex items-center gap-2.5">
            <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover bg-white" />
            <div className="flex-1"><strong className="block text-sm">Ngoc Nguyen — Thai Viet Ltd</strong><span className="text-xs opacity-85">● Online now</span></div>
            <button onClick={closeChat} aria-label="Close" className="opacity-80 hover:opacity-100">✕</button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
            {messages.map((m, i) => (
              <div key={i} className={'max-w-[82%] px-3 py-2.5 rounded-2xl text-[13.5px] leading-normal ' + (m.role === 'user' ? 'bg-primary text-white self-end rounded-br-sm' : 'bg-zinc-100 text-on-surface self-start rounded-bl-sm')}>{m.content}</div>
            ))}
            {typing && <div className="bg-zinc-100 self-start rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-on-surface-variant text-sm">…</div>}
          </div>
          <div className="p-3 border-t border-zinc-200 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Type a message..." className="flex-1 border border-zinc-200 rounded-full px-3.5 py-2 text-[13.5px] outline-none focus:border-primary" />
            <button onClick={submit} aria-label="Send" className="w-[38px] h-[38px] rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-[#950010]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
