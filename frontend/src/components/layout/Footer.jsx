import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'Contact', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Popular Interview Questions', href: '#' },
  { label: 'Your account', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 mt-20">
      <div className="max-w-5xl mx-auto flex gap-20">
        <Link to="/" className="font-bold text-white text-sm leading-tight shrink-0">
          Mock Me<br />Logo
        </Link>
        <div className="text-sm text-white/55">
          <p className="text-white/35 text-xs mb-3">Typical Footer Content</p>
          <ul className="space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">
                  • {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
