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

  // ✅ FIXED
  const handleView = (passId) => {
    navigate(`/view`);
  };

  const handleDelete = (e, passId) => {
    e.stopPropagation(); // prevent card click
    deletepass(passId);
  };

  return (
    <div className="min-h-screen relative text-slate-200 font-sans overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Title */}
        <div className="flex justify-center mt-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
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
            className="px-4 py-2 rounded-lg bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 backdrop-blur"
          />

          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-lg"
            onClick={() => setsort(!sort)}
          >
            {sort ? "Reset Order" : "Sort A-Z"}
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-10 p-8">
          {Object.entries(groupedPasswords).map(([groupName, groupPasses]) => (
            <div key={groupName}>
              
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
                      onClick={() => handleView(pass._id)} // ✅ card click
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all flex justify-between items-center"
                    >
                      {/* Info */}
                      <div className="space-y-2">
                        <p>
                          <span className="text-slate-400">Name:</span> {pass.name}
                        </p>

                        <p className="flex items-center gap-2">
                          <span className="text-slate-400">Password:</span>
                          {visibleIds.includes(pass._id)
                            ? pass.password
                            : "••••••••"}

                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ prevent card click
                              toggleView(pass._id);
                            }}
                            className="text-indigo-400"
                          >
                            {visibleIds.includes(pass._id) ? "🙈" : "👁️"}
                          </button>
                        </p>

                        <p className="text-sm text-gray-400">
                          {new Date(pass.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Buttons */}
<button
  onClick={(e) => handleDelete(e, pass._id)}
  className="p-[2px] rounded-full bg-gradient-to-r from-red-500 to-pink-500 
             hover:scale-110 transition"
  title="Delete"
>
  <span className="flex items-center justify-center bg-slate-900 rounded-full p-2 text-red-400">
    ❌
  </span>
</button>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => navigate("/ranpass")}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xl hover:scale-110 transition"
          >
            +
          </button>
        </div>

      </div>
    </div>
  );
};