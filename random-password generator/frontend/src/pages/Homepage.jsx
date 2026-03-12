import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { usePasStore } from "../store/usepasstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import "@splinetool/viewer";

export const Homepage = () => {
  const { authUser } = useAuthStore();
  const { getpass, passes, deletepass } = usePasStore();
  const navigate = useNavigate();

  const [visibleIds, setVisibleIds] = useState([]);
  const [spass, setspass] = useState("");
  const [sort, setsort] = useState(false);

  const orderedpasses = [...passes];

  if (sort) {
    orderedpasses.sort((a, b) => a.name.localeCompare(b.name));
  }

  const toggleView = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const id = authUser?._id;

  useEffect(() => {
    if (id) getpass(id);
  }, [id]);

  const handleView = (e, passId) => {
    e.preventDefault();
    usePasStore.getState().viewpass(passId, navigate);
  };

  const handleDelete = (e, passId) => {
    e.preventDefault();
    deletepass(passId);
  };

  const handleCopy = (e, id) => {
    e.preventDefault();
    const pass = passes.find((p) => p._id === id);
    navigator.clipboard.writeText(pass.password);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-200 font-sans">

      <Navbar />

      {/* 3D Background */}
      {/* <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer> */}

      {/* Title */}
      <div className="flex justify-center mt-6">
        <h1 className="text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          My Password Vault
        </h1>
      </div>

      {/* Search + Sort */}
      <div className="flex justify-between items-center mx-10 mt-8">

        <input
          type="text"
          value={spass}
          onChange={(e) => setspass(e.target.value)}
          placeholder="Search passwords..."
          className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
        />

        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-lg"
          onClick={() => setsort(!sort)}
        >
          {sort ? "Reset Order" : "Sort A-Z"}
        </button>
      </div>

      {/* Password Cards */}
      <div className="space-y-5 p-8">

        {orderedpasses
          ?.filter((pass) =>
            pass.name.toLowerCase().includes(spass.toLowerCase())
          )
          .map((pass) => (
            <motion.div
              key={pass._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all flex justify-between items-center"
            >
              {/* Password info */}
              <div className="space-y-2">

                <p className="text-lg">
                  <span className="text-slate-400">Name:</span>{" "}
                  <span className="text-white">{pass.name}</span>
                </p>

                <p className="text-lg flex items-center gap-2">
                  <span className="text-slate-400">Password:</span>

                  <span className="text-white">
                    {visibleIds.includes(pass._id)
                      ? pass.password
                      : "••••••••"}
                  </span>

                  <button
                    onClick={() => toggleView(pass._id)}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {visibleIds.includes(pass._id) ? "🙈" : "👁️"}
                  </button>
                </p>

              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  onClick={(e) => handleView(e, pass._id)}
                  className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  View
                </button>

                <button
                  onClick={(e) => handleCopy(e, pass._id)}
                  className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition"
                >
                  Copy
                </button>

                <button
                  onClick={(e) => handleDelete(e, pass._id)}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
                >
                  Delete
                </button>

              </div>

            </motion.div>
          ))}

      </div>
    </div>
  );
};