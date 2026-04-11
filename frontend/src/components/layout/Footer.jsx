import { Link } from 'react-router-dom';

const PRODUCT_LINKS = [
  { label: 'Dashboard',    to: '/dashboard' },
  { label: 'Pricing',      to: '#' },
  { label: 'How it works', to: '/#how' },
];

const SUPPORT_LINKS = [
  { label: 'FAQ & Help', to: '/faq' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
];

const ACCOUNT_LINKS = [
  { label: 'Log in',  to: '/login' },
  { label: 'Sign up', to: '/signup' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-16 mb-10">
          {/* Brand */}
          <div className="shrink-0">
            <Link to="/" className="font-bold text-white text-sm leading-tight block mb-3">
              Mock Me<br />Logo
            </Link>
            <p className="text-white/35 text-xs leading-relaxed max-w-[160px]">
              AI-powered mock interviews for top tech jobs.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 flex-wrap">
            <div>
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-3">Product</p>
              <ul className="space-y-2">
                {PRODUCT_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-white/55 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-3">Support</p>
              <ul className="space-y-2">
                {SUPPORT_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-white/55 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-3">Account</p>
              <ul className="space-y-2">
                {ACCOUNT_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-white/55 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex items-center justify-between">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} MockMe. All rights reserved.</p>
          <Link to="/faq" className="text-white/25 text-xs hover:text-white/50 transition-colors">
            Need help?
          </Link>
        </div>
      </div>
    </footer>
  );
}
