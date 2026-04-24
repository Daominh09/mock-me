import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Companies',  href: '#companies' },
  { label: 'Questions',  href: '#questions' },
  { label: 'Interview',  href: '/dashboard' },
  { label: 'FAQ',        href: '/faq' },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-5 w-full max-w-5xl mx-auto">
      <Link to="/" className="font-bold text-white text-sm leading-tight text-center">
        Mock Me<br />Logo
      </Link>

      <div className="flex items-center gap-1 border border-white/15 rounded-full px-4 py-1.5">
        {NAV_LINKS.map(({ label, href }) => (
          href.startsWith('/') ? (
            <Link
              key={label}
              to={href}
              className="text-white/75 hover:text-white text-sm px-3.5 py-1 rounded-full transition-all duration-500 hover:bg-white/10"
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              className="text-white/75 hover:text-white text-sm px-3.5 py-1 rounded-full transition-all duration-500 hover:bg-white/10"
            >
              {label}
            </a>
          )
        ))}
      </div>

      <Link to="/login">
        <Button variant="primary">Login</Button>
      </Link>
    </nav>
  );
}
