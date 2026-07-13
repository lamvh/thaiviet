import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Toast { message: string; ok: boolean; }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useContactForm() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending auto-dismiss on unmount so we never setState after teardown.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function show(message: string, ok: boolean) {
    setToast({ message, ok });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 5000);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !email || !message) { show('Please fill in all required fields.', false); return; }
    if (!EMAIL_RE.test(email)) { show('Please enter a valid email address.', false); return; }

    const payload = {
      name,
      email,
      message,
      phone: String(data.get('phone') ?? '').trim() || null,
      service: String(data.get('service') ?? '').trim() || null,
      address: String(data.get('address') ?? '').trim() || null,
    };

    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert(payload);
      if (error) throw error;
      show("Thank you! We'll be in touch within 1 business day.", true);
      form.reset();
    } catch {
      show('Sorry, something went wrong sending your request. Please call us or try again.', false);
    } finally {
      setSubmitting(false);
    }
  }

  return { toast, submitting, submit };
}
