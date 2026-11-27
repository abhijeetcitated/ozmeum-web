import { SITE } from '../config';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="container-x flex flex-col gap-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-fg-2">
            White-label cost calculators for SEO and web agencies. ${SITE.price} flat, invoiced after you approve staging.
          </p>
        </div>
        <div className="text-sm text-fg-3 sm:text-right">
          <a href={`mailto:${SITE.contactEmail}`} className="text-fg-2 transition-colors hover:text-fg">
            {SITE.contactEmail}
          </a>
          <p className="mt-1">© {new Date().getFullYear()} Ozmeum</p>
        </div>
      </div>
    </footer>
  );
}
