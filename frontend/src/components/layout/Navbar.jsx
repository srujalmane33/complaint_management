import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const roleNavLinks = {
  STUDENT: [
    { to: "/student/dashboard",      label: "My Complaints" },
    { to: "/student/complaints/new", label: "+ New Complaint" },
  ],
  TEACHER: [
    { to: "/teacher/dashboard", label: "Pending Reviews" },
  ],
  ADMIN: [
    { to: "/admin/dashboard",   label: "Dashboard" },
    { to: "/admin/complaints",  label: "Complaints" },
  ],
};

const roleStyle = {
  STUDENT: "bg-blue-100 text-blue-700",
  TEACHER: "bg-violet-100 text-violet-700",
  ADMIN:   "bg-rose-100 text-rose-700",
};

const roleAccent = {
  STUDENT: "blue",
  TEACHER: "violet",
  ADMIN:   "rose",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = user ? roleNavLinks[user.role] || [] : [];
  const badgeClass = user ? roleStyle[user.role] || "bg-gray-100 text-gray-600" : "";
  const accent = user ? roleAccent[user.role] || "blue" : "blue";

  const activeCls = `bg-${accent}-600 text-white shadow-sm`;
  const inactiveCls = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4" style={{ height: 60 }}>

        {/* ── Left: Logo + Nav ── */}
        <div className="flex items-center gap-5 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow">
              C
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight hidden sm:block">
              CMS Portal
            </span>
          </Link>

          {user && (
            <span className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
              {user.role}
            </span>
          )}

          {/* Desktop Nav Links */}
          {navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${isActive ? activeCls : inactiveCls}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* ── Right: User + Logout ── */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[160px]">
                  {user.name || user.email}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">{user.role?.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95"
              >
                Logout
              </button>

              {/* Mobile menu toggle */}
              {navLinks.length > 0 && (
                <button
                  className="md:hidden p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition">
                Sign In
              </Link>
              <Link to="/register" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {mobileOpen && navLinks.length > 0 && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive ? activeCls : inactiveCls}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}