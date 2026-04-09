import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const NAV_LINKS = ['Questions', 'Companies', 'Practice', 'FAQ'];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 w-full max-w-[1440px] mx-auto">
      <Link to="/" className="font-bold text-white text-sm leading-tight text-center">
        Mock Me<br />Logo
      </Link>

      <div className="flex items-center gap-1 border border-white/15 rounded-full px-4 py-1.5">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-white/75 hover:text-white text-sm px-3 py-1 rounded-full transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      <Link to="/login">
        <Button variant="primary">Login</Button>
      </Link>
    </nav>
  );
}
