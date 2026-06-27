import { useState } from 'react';

export interface Toast { message: string; ok: boolean; }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useContactForm() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function show(message: string, ok: boolean) {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 5000);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !email || !message) { show('Please fill in all required fields.', false); return; }
    if (!EMAIL_RE.test(email)) { show('Please enter a valid email address.', false); return; }
    setSubmitting(true);
    // TODO: replace with real POST to your backend
    setTimeout(() => {
      setSubmitting(false);
      show("Thank you! We'll be in touch within 1 business day.", true);
      form.reset();
    }, 1200);
  }

  return { toast, submitting, submit };
}
