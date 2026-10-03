import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      {/* Main content with max-width container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-sm py-3.5 text-center text-[11px] text-gray-400 font-medium">
        CMS Portal &mdash; College Complaint Management System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}