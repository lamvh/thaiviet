import { Link } from "react-router-dom"
import { Icon } from "../ui/Icon"
import { useSiteContent } from "../../lib/site-content-context"
import { SERVICES } from "../../data/services"

const COMPANY: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Why Choose Us", to: "/services" },
  { label: "Process", to: "/services" },
  { label: "Projects", to: "/projects" },
]

export function Footer() {
  const { contact } = useSiteContent()
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/15">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <div className="text-xl font-bold text-primary mb-6 font-headline">
            ThaiViet Ltd
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Wellington's experts in premium painting, plastering, decorating and
            renovation services across Wellington. Quality craftsmanship you can
            trust.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:text-primary transition-colors shadow-sm"
              href={contact.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <Icon name="share" />
            </a>
            <a
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:text-primary transition-colors shadow-sm"
              href={contact.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <Icon name="thumb_up" />
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-headline font-bold mb-6">Services</h5>
          <ul className="space-y-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="text-slate-600 hover:text-primary transition-colors text-sm"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-headline font-bold mb-6">Company</h5>
          <ul className="space-y-4">
            {COMPANY.map((c) => (
              <li key={c.label}>
                <Link
                  to={c.to}
                  className="text-slate-600 hover:text-primary transition-colors text-sm"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-headline font-bold mb-6">Contact Info</h5>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <Icon name="call" className="text-primary" />
              <a
                className="hover:text-primary transition-colors"
                href={"tel:" + contact.phone.replace(/\s/g, "")}
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="mail" className="text-primary" />
              <span>{contact.email}</span>
            </li>
            <li className="pt-4">
              <Link
                to="/"
                className="text-primary font-bold underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-widest">
        <p>© 2024 ThaiViet Ltd. All rights reserved.</p>
        <p>Designed for Quality & Durability</p>
      </div>
    </footer>
  )
}
