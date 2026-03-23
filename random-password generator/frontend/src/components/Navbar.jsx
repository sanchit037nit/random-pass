import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useauthstore.js";
import { Trash2, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout, deleteaccount } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-gray-900/80 shadow-xl z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-3xl font-extrabold text-amber-400 animate-pulse">🔐</span>
          <h1 className="text-2xl font-bold text-white tracking-wide hover:text-amber-400 transition">PASSGEN</h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">

          {/* Main Links */}
          {authUser && (
            <>
              <button
                onClick={() => navigate("/ranpass")}
                className="px-4 py-2 rounded-full bg-amber-500 text-gray-900 font-medium hover:scale-105 hover:shadow-lg transition transform"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-full bg-amber-500 text-gray-900 font-medium hover:scale-105 hover:shadow-lg transition transform"
              >
                Dashboard
              </button>
            </>
          )}

          {/* Account Dropdown */}
          {authUser && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
              >
                <User size={18} />
                Account
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg flex flex-col py-1 z-50">
                  <Link
                    to="/recycle-bin"
                    className="px-4 py-2 hover:bg-red-600 hover:text-white transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 size={16} /> Recycle Bin
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="text-left px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => { deleteaccount(); setDropdownOpen(false); }}
                    className="text-left px-4 py-2 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login / Signup */}
          {!authUser && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-full bg-amber-500 text-gray-900 font-medium hover:scale-105 hover:shadow-lg transition transform"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-full bg-amber-500 text-gray-900 font-medium hover:scale-105 hover:shadow-lg transition transform"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;