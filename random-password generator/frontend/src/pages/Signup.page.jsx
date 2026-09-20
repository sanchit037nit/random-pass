import { useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "@splinetool/viewer";

export const Signuppage = () => {
  const { signup } = useAuthStore();

  const [formdata, setformdata] = useState({
    name: "",
    emailid: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateformdata = () => {
    if (!formdata.name || !formdata.emailid || !formdata.password) {
      toast.error("All fields required");
      return false;
    }

    if (formdata.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formdata.emailid)) {
      toast.error("Invalid email");
      return false;
    }

    return true;
  };

  const handleclick = async (e) => {
    e.preventDefault();
    const success = validateformdata();
    if (!success) return;
    await signup(formdata);
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

      {/* Optional Spline */}
      {/*
      <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-0"
      ></spline-viewer>
      */}

      {/* Form */}
      <form
        onSubmit={handleclick}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl 
                   bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937] 
                   shadow-2xl hover:shadow-[#7C6FF0]/10 transition space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-1">
              New identity
            </p>
            <h2 className="text-2xl font-bold font-mono text-[#E6E8EC]">
              Sign up
            </h2>
          </div>

          <button
            onClick={handlecross}
            className="p-2 rounded-full hover:bg-[#7C6FF0]/10 text-[#8B93A7] hover:text-[#7C6FF0] transition"
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <div className="flex flex-col space-y-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">
            Name
          </label>
          <input
            type="text"
            className="border border-[#1F2937] rounded-lg px-4 py-2 bg-[#0A0E14]/70 text-[#E6E8EC]
                       placeholder:text-[#8B93A7]/50
                       focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60 transition"
            placeholder="Enter your name"
            value={formdata.name}
            onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
          />
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
            placeholder="At least 6 characters"
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
          Create account
        </button>

        {/* Extra */}
        <p className="text-sm text-center text-[#8B93A7]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7C6FF0] hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};
