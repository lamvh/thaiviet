import { Icon } from '../components/ui/Icon';
import { Container } from '../components/ui/Container';
import { useSiteContent } from '../lib/site-content-context';

// Privacy policy page ("/privacy"). All copy is admin-editable (admin → Privacy Policy);
// the contact block pulls email + phone live from Contact & Social so they never drift.
export function PrivacyPage() {
  const { privacy, contact } = useSiteContent();

  return (
    <section className="py-20 md:py-28 bg-surface">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">{privacy.title}</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-12">{privacy.intro}</p>

          <div className="flex flex-col gap-10">
            {privacy.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-headline text-2xl font-bold mb-4">{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-on-surface-variant leading-relaxed mb-4">{p}</p>
                ))}
                {s.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 mt-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-on-surface-variant">
                        <Icon name="check_circle" className="text-primary text-lg mt-0.5" /> <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact block — company + location static, email + phone from Contact & Social. */}
            <div>
              <h2 className="font-headline text-2xl font-bold mb-4">{privacy.contactHeading}</h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">{privacy.contactIntro}</p>
              <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-3">
                <p className="font-bold text-on-surface">ThaiViet Ltd</p>
                <p className="flex items-center gap-3 text-on-surface-variant">
                  <Icon name="mail" className="text-primary" />
                  <a className="hover:text-primary transition-colors" href={'mailto:' + contact.email}>{contact.email}</a>
                </p>
                <p className="flex items-center gap-3 text-on-surface-variant">
                  <Icon name="call" className="text-primary" />
                  <a className="hover:text-primary transition-colors" href={'tel:' + contact.phone.replace(/\s/g, '')}>{contact.phone}</a>
                </p>
                <p className="flex items-center gap-3 text-on-surface-variant">
                  <Icon name="location_on" className="text-primary" /> <span>Wellington, New Zealand</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant/80 leading-relaxed mt-12 pt-8 border-t border-outline-variant/20">{privacy.closing}</p>
        </div>
      </Container>
    </section>
  );
}
