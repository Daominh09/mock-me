import { Link } from 'react-router-dom';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#1C1917] flex flex-col page-enter">
      {/* Logo */}
      <Link to="/" className="font-bold text-white text-sm leading-tight p-8 w-fit">
        Mock Me<br />Logo
      </Link>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white text-center mb-3">Sign up to Mock Me</h1>
          <p className="text-center text-white/50 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#60A5FA] font-medium hover:underline">
              Log in
            </Link>
          </p>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-xl py-3.5 text-white text-sm font-medium hover:bg-white/5 transition-colors mb-6">
            <GoogleIcon />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-white/15" />
            <span className="text-white/35 text-xs">or continue with</span>
            <div className="flex-1 border-t border-white/15" />
          </div>

          {/* Email / Password */}
          <div className="flex flex-col gap-3 mb-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Submit */}
          <button className="w-full bg-[#F0EDE8] hover:bg-white text-black font-semibold rounded-xl py-3.5 text-sm transition-colors mb-8">
            Sign Up
          </button>

          <p className="text-center text-white/40 text-xs leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#60A5FA] hover:underline">terms of service</a>
            {' '}and{' '}
            <a href="#" className="text-[#60A5FA] hover:underline">privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
