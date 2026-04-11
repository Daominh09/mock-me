import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Set Up an Interview', href: '/dashboard' },
  { label: 'My Progress', href: '/progress' },
  { label: 'Setting', href: '/settings' },
];

const BROWSE_ITEMS = [
  { label: 'All Role', href: '/roles' },
  { label: 'All Company', href: '/companies' },
  { label: 'All Category', href: '/categories' },
];

const RESOURCE_ITEMS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
];

function PlaceholderIcon() {
  return (
    <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center shrink-0">
      <div className="w-2.5 h-2 border border-white/30 rounded-sm" />
    </div>
  );
}

function NavItem({ href, label }) {
  const location = useLocation();
  const active = location.pathname === href;
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-white hover:bg-white/8 hover:text-white'
      }`}
    >
      <PlaceholderIcon />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen sticky top-0 px-4 py-6 border-r border-white/10">
      <Link to="/" className="font-bold text-white text-sm leading-tight mb-8 px-2">
        Mock Me<br />Logo
      </Link>

      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider px-2 mb-2">
        Dashboard
      </p>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <hr className="border-white/10 my-4" />

      <nav className="flex flex-col gap-0.5">
        {BROWSE_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <hr className="border-white/10 my-4" />

      <p className="text-white/40 text-xs px-2 mb-2">Resources</p>
      <nav className="flex flex-col gap-0.5">
        {RESOURCE_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
}
