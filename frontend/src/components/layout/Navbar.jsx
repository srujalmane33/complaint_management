import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
        
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
              C
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              CMS Portal
            </span>
    
          {user && (
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase">
              {user.role}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-800">{user.email}</p>
                <p className="text-[11px] text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}