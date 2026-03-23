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

  // Group passwords by "group" field
  const groupedPasswords = orderedpasses.reduce((acc, pass) => {
    const group = pass.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(pass);
    return acc;
  }, {});

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

  return (
    <div className="flex flex-col min-h-screen text-slate-200 font-sans">
      <Navbar />

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

        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-lg"
            onClick={() => setsort(!sort)}
          >
            {sort ? "Reset Order" : "Sort A-Z"}
          </button>
        </div>
      </div>

      {/* Password Cards Grouped */}
      <div className="space-y-10 p-8">
        {Object.entries(groupedPasswords).map(([groupName, groupPasses]) => (
          <div key={groupName}>
            {/* Group Title */}
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              {groupName} ({groupPasses.length})
            </h2>

            <div className="space-y-5">
              {groupPasses
                .filter((pass) =>
                  pass.name.toLowerCase().includes(spass.toLowerCase())
                )
                .map((pass) => (
                  <motion.div
                    key={pass._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all flex justify-between items-center"
                  >
                    {/* Password Info */}
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
                          className="text-indigo-400"
                        >
                          {visibleIds.includes(pass._id) ? "🙈" : "👁️"}
                        </button>
                      </p>

                      <p className="text-lg">
                        <span className="text-slate-400">Created @:</span>{" "}
                        {new Date(pass.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => handleView(e, pass._id)}
                        className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
                      >
                        View
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, pass._id)}
                        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Group Button */}
      <div className="fixed bottom-4 right-4 group">
        <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110">
          +
        </button>

        <span className="absolute bottom-20 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          Add New Group
        </span>
      </div>
    </div>
  );
};