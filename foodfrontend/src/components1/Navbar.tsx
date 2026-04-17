import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.webp"
            alt="FoodShare Logo"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="text-2xl font-bold text-green-600">FoodShare</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 font-medium md:flex">
          <Link to="/" className="transition hover:text-green-600">
            Home
          </Link>

          <Link to="/about" className="transition hover:text-green-600">
            About
          </Link>

          <Link
            to="/admin-login"
            className="transition hover:text-green-600"
          >
            Admin
          </Link>

          <Link
            to="/volunteer-Register"
            className="rounded-lg bg-green-100 px-4 py-2 text-green-700 transition hover:bg-green-200"
          >
            Join as Volunteer
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="transition hover:text-green-600"
              >
                Dashboard
              </Link>

              <Link
                to="/admin-dashboard"
                className="transition hover:text-green-600"
              >
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-green-500 px-5 py-2 text-white transition hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-3xl text-green-600 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 bg-white px-6 pb-4 font-medium shadow-lg md:hidden">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-600"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-600"
          >
            About
          </Link>

          <Link
            to="/admin-login"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-600"
          >
            Admin
          </Link>

          <Link
            to="/volunteer-Register"
            onClick={() => setMenuOpen(false)}
            className="font-semibold text-green-700"
          >
            Join as Volunteer
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-600"
              >
                Dashboard
              </Link>

              <Link
                to="/admin-dashboard"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-600"
              >
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-left font-semibold text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-green-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}