import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePasStore } from "../store/usepasstore.js";
import Navbar from "../components/Navbar.jsx";
import { RefreshCcw, Copy, Save } from "lucide-react";
import "@splinetool/viewer";
import zxcvbn from "zxcvbn";
import {
  isPlatformAuthenticatorAvailable,
  authenticateWithBiometric,
} from "../store/webauthn";
import { registerBiometric } from "../store/webauthn";
import toast from "react-hot-toast";

export const Ranpass = () => {
  const navigate = useNavigate();

  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [Strength, setStrength] = useState("");
  const [showVaultPassword, setShowVaultPassword] = useState(false);

  const { setGeneratedPassword } = usePasStore();

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    const strength = zxcvbn(password);
    setPassword(pass);
    setGeneratedPassword(pass);
    setStrength(strength);
  }, [length, numberAllowed, charAllowed, setGeneratedPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const openVault = async () => {
    try {
      const available = await isPlatformAuthenticatorAvailable();

      if (!available) {
        toast.error(
          "This device does not support biometric/passkey authentication.",
        );
        return;
      }

      try {
        await authenticateWithBiometric();
        console.log("Biometric authentication successful");
        return;
      } catch (error) {
        console.log("No existing biometric credential:", error);
        await registerBiometric();
        console.log("Biometric registration successful");
        return;
      }
    } catch (error) {
      console.error("Vault opening failed:", error);

      toast.error(error.message || "Unable to open vault.");
    }
  };

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const strengthLabel = Strength
    ? ["Very weak", "Weak", "Fair", "Strong", "Very strong"][Strength.score]
    : "";

  const strengthColor = !Strength
    ? "#8B93A7"
    : Strength.score < 2
    ? "#F87171"
    : Strength.score < 4
    ? "#FBBF24"
    : "#34D399";

  return (
    <div className="min-h-screen relative text-[#E6E8EC] font-sans overflow-hidden bg-[#0A0E14]">
      {/* Ambient glow field — matches Cipher Vault theme */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#34D399]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full bg-[#7C6FF0]/10 blur-[120px]" />

      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#1F2937 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
          <div className="w-full max-w-xl backdrop-blur-xl bg-[#111827]/80 border border-[#1F2937] rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold font-mono text-center mb-8 text-[#E6E8EC]">
              Password generator
            </h1>

            {/* Password field */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={password}
                readOnly
                ref={passwordRef}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0A0E14]/70 border border-[#1F2937] text-[#E6E8EC]
                           font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-[#34D399]/60"
              />

              {/* Refresh */}
              <button onClick={passwordGenerator} className="p-2 group">
                <RefreshCcw
                  size={22}
                  className="text-[#34D399] group-hover:text-[#34D399] group-hover:rotate-180 transition-transform duration-300"
                />
              </button>

              {/* Copy */}
              <button onClick={copyPasswordToClipboard} className="p-2">
                <Copy
                  size={22}
                  className="text-[#7C6FF0] hover:text-[#9C93F5] transition-colors"
                />
              </button>

              {/* Save */}
              <button onClick={() => navigate("/create")} className="p-2">
                <Save
                  size={22}
                  className="text-[#7C6FF0] hover:text-[#9C93F5] transition-colors"
                />
              </button>
            </div>

            {/* Strength meter */}
            <div className="mb-2">
              <div className="w-full h-2 rounded-full bg-[#1F2937] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: Strength ? `${(Strength.score + 1) * 20}%` : "0%",
                    backgroundColor: strengthColor,
                  }}
                />
              </div>

              <p
                className="mt-2 font-mono text-xs tracking-widest uppercase"
                style={{ color: strengthColor }}
              >
                {strengthLabel}
              </p>
            </div>

            <label className="block mb-6 text-[#8B93A7]/70 text-xs italic">
              *Include numbers and special characters for better security
            </label>

            {/* Length Slider */}
            <div className="mb-6">
              <label className="flex justify-between mb-2 font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
                <span>Length</span>
                <span className="text-[#34D399]">{length}</span>
              </label>

              <input
                type="range"
                min={6}
                max={20}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-[#34D399] cursor-pointer"
              />
            </div>

            {/* Options */}
            <div className="flex gap-8 mb-8">
              <label className="flex items-center gap-2 text-sm text-[#E6E8EC]">
                <input
                  type="checkbox"
                  checked={numberAllowed}
                  onChange={() => setNumberAllowed((prev) => !prev)}
                  className="accent-[#34D399]"
                />
                Numbers
              </label>

              <label className="flex items-center gap-2 text-sm text-[#E6E8EC]">
                <input
                  type="checkbox"
                  checked={charAllowed}
                  onChange={() => setCharAllowed((prev) => !prev)}
                  className="accent-[#34D399]"
                />
                Symbols
              </label>
            </div>

            {/* Navigation */}
            <div className="flex justify-center">
              <button
                onClick={openVault}
                className="px-6 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
               hover:border-[#7C6FF0] hover:shadow-[0_0_16px_rgba(124,111,240,0.3)] transition-all"
              >
                Your password vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
