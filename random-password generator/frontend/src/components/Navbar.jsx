import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useauthstore.js";
import { Trash2, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout, deleteaccount } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-[#0A0E14]/85 shadow-xl z-50 border-b border-[#1F2937]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/ranpass")}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34D399]" />
          </span>
          <h1 className="text-2xl font-bold font-mono tracking-[0.15em] text-[#E6E8EC] hover:text-[#34D399] transition-colors">
            PASSGEN
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {/* Auth Buttons */}
          {authUser && (
            <>
              {/* Dashboard */}
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
                           hover:border-[#7C6FF0] hover:shadow-[0_0_16px_rgba(124,111,240,0.3)] transition-all"
              >
                Dashboard
              </button>

              {/* Recycle Bin */}
              <button
                onClick={() => navigate("/recycle-bin")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
                           hover:border-red-400/60 hover:text-red-400 hover:shadow-[0_0_16px_rgba(248,113,113,0.25)] transition-all"
              >
                <Trash2 size={18} />
                Recycle bin
              </button>
            </>
          )}

          {/* Account Dropdown */}
          {authUser && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111827]/80 backdrop-blur-md
                           border border-[#1F2937] text-[#E6E8EC] hover:border-[#34D399]/50 transition-all"
              >
                <User size={18} />
                Account
                <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111827]/95 backdrop-blur-xl border border-[#1F2937] rounded-xl shadow-2xl flex flex-col py-1 z-50">

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="text-left px-4 py-2 text-[#E6E8EC] hover:bg-[#1F2937] hover:text-[#34D399] transition rounded-md"
                  >
                    Logout
                  </button>

                  <button
                    onClick={() => {
                      deleteaccount();
                      setDropdownOpen(false);
                    }}
                    className="text-left px-4 py-2 text-[#E6E8EC] hover:bg-red-500/10 hover:text-red-400 transition rounded-md"
                  >
                    Delete account
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
                className="px-4 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
                           hover:border-[#7C6FF0] hover:shadow-[0_0_16px_rgba(124,111,240,0.3)] transition-all"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-lg bg-[#34D399] text-[#0A0E14] font-semibold
                           hover:shadow-[0_0_20px_rgba(52,211,153,0.45)] transition-all"
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