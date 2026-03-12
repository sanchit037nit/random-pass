import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import { usePasStore } from "../store/usepasstore.js";
import Navbar from "../components/Navbar.jsx";
import "@splinetool/viewer";

export const Ranpass = () => {
  const navigate = useNavigate();

  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

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

    setPassword(pass);
    setGeneratedPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="min-h-screen text-slate-200 font-sans">

      <Navbar />

      {/* Background */}
      {/* <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer> */}

      <div className="flex justify-center items-center mt-16 px-4">

        {/* Card */}
        <div className="w-full max-w-xl backdrop-blur-xl bg-slate-900/60 border border-slate-700 rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Password Generator
          </h1>

          {/* Password field */}
          <div className="flex gap-2 mb-6">

            <input
              type="text"
              value={password}
              readOnly
              ref={passwordRef}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none"
            />

            <button
              onClick={copyPasswordToClipboard}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              Copy
            </button>

            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Save
            </button>

          </div>

          {/* Slider */}
          <div className="mb-6">

            <label className="block mb-2 text-slate-400">
              Length: {length}
            </label>

            <input
              type="range"
              min={6}
              max={20}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer"
            />

          </div>

          {/* Options */}
          <div className="flex gap-8 mb-8">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="accent-indigo-500"
              />
              Numbers
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="accent-indigo-500"
              />
              Symbols
            </label>

          </div>

          {/* Navigation */}
          <div className="flex justify-center">

            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              Your Password Vault
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};