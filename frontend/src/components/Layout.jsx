import { Link } from "react-router-dom";

export const Layout = ({ children }) => (
  <div className="min-h-screen">
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/" className="font-semibold text-slate-900">
          Live Polling
        </Link>
        <Link to="/results" className="text-slate-600 hover:text-slate-900">
          Live Results
        </Link>
        <Link to="/admin" className="text-slate-600 hover:text-slate-900">
          Admin
        </Link>
      </nav>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
  </div>
);
