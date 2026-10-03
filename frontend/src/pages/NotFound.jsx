import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-black text-gray-900">404</h1>
      <p className="text-sm text-gray-500 mt-2 mb-6">The requested page does not exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
      >
        Return Home
      </Link>
    </div>
  );
}