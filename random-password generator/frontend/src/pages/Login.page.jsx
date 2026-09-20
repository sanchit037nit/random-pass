import { useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "@splinetool/viewer";

export const Loginpage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    emailid: "",
    password: "",
  });

  const handleclick = (e) => {
    e.preventDefault();

    if (!formdata.emailid || !formdata.password) {
      return toast.error("All fields required");
    }

    login(formdata);
  };

  const handlecross = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center overflow-hidden text-[#E6E8EC] bg-[#0A0E14]">
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

      {/* Form */}
      <form
        onSubmit={handleclick}
        className="relative z-10 space-y-7 w-full max-w-md p-8 rounded-2xl 
                   bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937] 
                   shadow-2xl hover:shadow-[#34D399]/10 transition"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-1">
              Vault access
            </p>
            <h2 className="text-2xl font-bold font-mono text-[#E6E8EC]">
              Login
            </h2>
          </div>

          <button
            onClick={handlecross}
            className="p-2 rounded-full hover:bg-[#7C6FF0]/10 text-[#8B93A7] hover:text-[#7C6FF0] transition"
          >
            ✕
          </button>
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
            Email
          </label>

          <input
            type="email"
            className="border border-[#1F2937] rounded-lg px-4 py-2 bg-[#0A0E14]/70 text-[#E6E8EC]
                       placeholder:text-[#8B93A7]/50
                       focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
            placeholder="you@domain.com"
            value={formdata.emailid}
            onChange={(e) =>
              setformdata({ ...formdata, emailid: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
            Password
          </label>

          <input
            type="password"
            className="border border-[#1F2937] rounded-lg px-4 py-2 bg-[#0A0E14]/70 text-[#E6E8EC]
                       placeholder:text-[#8B93A7]/50
                       focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
            placeholder="Enter your password"
            value={formdata.password}
            onChange={(e) =>
              setformdata({ ...formdata, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#34D399] text-[#0A0E14] font-semibold
                     hover:shadow-[0_0_24px_rgba(52,211,153,0.45)] hover:-translate-y-0.5
                     py-2 rounded-lg transition-all"
        >
          Login
        </button>

        {/* Extra */}
        <p className="text-sm text-center text-[#8B93A7]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#7C6FF0] hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};
