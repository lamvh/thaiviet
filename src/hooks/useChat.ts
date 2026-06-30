import { useState, useCallback } from 'react';
import { useSiteContent } from '../lib/site-content-context';

export interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const WELCOME = "Hi! I'm Ngoc Nguyen from Thai Viet Ltd. How can I help you today? Feel free to ask about our painting services, free quotes, or anything else! \uD83D\uDE0A";

export function useChat() {
  const { contact } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);

  const ensureWelcome = useCallback(() => {
    setMessages((prev) => {
      if (prev.length) return prev;
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ role: 'assistant', content: WELCOME }]);
      }, 1400);
      return prev;
    });
  }, []);

  const openChat = useCallback(() => { setOpen(true); ensureWelcome(); }, [ensureWelcome]);
  const closeChat = useCallback(() => setOpen(false), []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((p) => [...p, { role: 'user', content: trimmed }]);
    setTyping(true);
    // TODO: replace with real POST /api/chat
    setTimeout(() => {
      setTyping(false);
      setMessages((p) => [...p, { role: 'assistant', content: `Thanks! Our team will get back to you shortly, or call ${contact.phone}.` }]);
    }, 1200);
  }, [contact.phone]);

  return { open, openChat, closeChat, toggle: () => (open ? closeChat() : openChat()), messages, typing, send };
}
