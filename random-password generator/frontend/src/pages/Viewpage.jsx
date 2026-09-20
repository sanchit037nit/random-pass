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
  if (!selectedpass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E14] text-[#8B93A7] font-mono text-sm tracking-widest uppercase">
        Loading record...
      </div>
    );
  }

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
    <div className="min-h-screen relative text-[#E6E8EC] overflow-hidden bg-[#0A0E14]">
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
      <div className="relative z-10 flex flex-col items-center">
        <Navbar />

        {/* Card */}
        <div
          className="mt-24 mb-16 w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937]
                        shadow-2xl rounded-2xl p-8 hover:shadow-[#7C6FF0]/10 transition"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-1">
                Record details
              </p>
              <h2 className="text-2xl font-bold font-mono text-[#E6E8EC]">
                View / update
              </h2>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-full hover:bg-[#7C6FF0]/10 text-[#8B93A7] hover:text-[#7C6FF0] transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Name */}
            <div>
              <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
                Name
              </label>
              <input
                type="text"
                value={formdata.name}
                onChange={(e) =>
                  setformdata({ ...formdata, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0A0E14]/70 border border-[#1F2937] text-[#E6E8EC]
                           focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
                Password
              </label>
              <input
                type="text"
                value={formdata.password}
                onChange={(e) =>
                  setformdata({ ...formdata, password: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0A0E14]/70 border border-[#1F2937] text-[#E6E8EC]
                           font-mono focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
                Description
              </label>
              <textarea
                value={formdata.description}
                onChange={(e) =>
                  setformdata({ ...formdata, description: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0A0E14]/70 border border-[#1F2937] text-[#E6E8EC]
                           resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
              />
            </div>

            {/* Group */}
            <div>
              <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
                Group
              </label>
              <select
                value={formdata.group}
                onChange={(e) =>
                  setformdata({ ...formdata, group: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0A0E14]/70 border border-[#1F2937] text-[#E6E8EC]
                           focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
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
              className="w-full bg-[#34D399] text-[#0A0E14] font-semibold
                         hover:shadow-[0_0_24px_rgba(52,211,153,0.45)] hover:-translate-y-0.5
                         py-2 rounded-lg transition-all"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Viewpage;
