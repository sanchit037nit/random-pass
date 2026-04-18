import { usePasStore } from "../store/usepasstore.js";
import React, { useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Viewpage = () => {
  const navigate = useNavigate();
  const { updatepass } = usePasStore();
  const { authUser } = useAuthStore();

  const selectedpass = usePasStore((state) => state.selectedpass);
  if (!selectedpass) return <div className="text-white">Loading...</div>;

  const [formdata, setformdata] = useState({
    name: selectedpass.password.name,
    password: selectedpass.password.password,
    description: selectedpass.password.description,
    group: selectedpass.password.group || "General",
    createdby: authUser?._id,
  });

  const handleupdate = (e) => {
    e.preventDefault();
    updatepass(formdata, selectedpass.password._id);
    navigate("/home");
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">

      {/* 🌈 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>

      {/* 💡 Glow Effects */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <Navbar />

        {/* Card */}
        <div className="mt-20 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-8 hover:shadow-violet-500/20 transition">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide">
              View / Update Password
            </h2>

            <button
              onClick={() => navigate("/home")}
              className="text-gray-400 hover:text-red-500 text-xl transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-gray-300 text-sm">Name</label>
              <input
                type="text"
                value={formdata.name}
                onChange={(e) =>
                  setformdata({ ...formdata, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="text"
                value={formdata.password}
                onChange={(e) =>
                  setformdata({ ...formdata, password: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-300 text-sm">Description</label>
              <textarea
                value={formdata.description}
                onChange={(e) =>
                  setformdata({ ...formdata, description: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>

            {/* Group */}
            <div>
              <label className="text-gray-300 text-sm">Group</label>
              <select
                value={formdata.group}
                onChange={(e) =>
                  setformdata({ ...formdata, group: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Social">Social</option>
                <option value="Banking">Banking</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            {/* Update Button */}
            <button
              onClick={handleupdate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30 py-2 rounded-lg font-semibold transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Viewpage;