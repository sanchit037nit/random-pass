import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { axiosinstance } from "../lib/axios.js";
import { Shield, Layers, Star } from "lucide-react";
import { usePasStore } from "../store/usepasstore.js";

export const Dashpage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPasswords: 0,
    groupCounts: {},
    recentPasswords: [],
  });

  const id = authUser?._id;
  const [loading, setLoading] = useState(true);
  const { securityAlerts, getSecurityAlerts } = usePasStore();

useEffect(() => {
  getSecurityAlerts();
}, []);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axiosinstance.get(`/pass/dashboard/${id}`);

        setStats({
          totalPasswords: res.data?.totalPasswords || 0,
          groupCounts: res.data?.groupCounts || {},
          recentPasswords: res.data?.recentPasswords || [],
        });
      } catch (err) {
        console.log("Dashboard API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E14] text-[#8B93A7] font-mono text-sm tracking-widest uppercase">
        Decrypting dashboard...
      </div>
    );
  }

  const groupCounts = stats.groupCounts || {};

  const mostPopulatedGroup =
    Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

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
      <div className="relative z-10">
        <Navbar />

        <div className="flex justify-center items-start min-h-screen pt-24 pb-16 px-4">
          <div className="w-full max-w-6xl space-y-10">

            {/* Header */}
            <div className="text-center">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-2">
                Vault analytics
              </p>
              <h1 className="text-3xl font-bold font-mono text-[#E6E8EC]">
                Dashboard overview
              </h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-[#111827]/70 backdrop-blur-xl border border-[#1F2937] rounded-2xl p-6 shadow-lg
                              hover:border-[#34D399]/40 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)] transition-all">
                <div className="flex items-center gap-3">
                  <Shield className="text-[#34D399]" size={20} />
                  <h2 className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">Total passwords</h2>
                </div>
                <p className="text-4xl mt-4 font-bold font-mono text-[#34D399]">
                  {stats.totalPasswords}
                </p>
              </div>

              <div className="bg-[#111827]/70 backdrop-blur-xl border border-[#1F2937] rounded-2xl p-6 shadow-lg
                              hover:border-[#7C6FF0]/40 hover:shadow-[0_0_24px_rgba(124,111,240,0.15)] transition-all">
                <div className="flex items-center gap-3">
                  <Layers className="text-[#7C6FF0]" size={20} />
                  <h2 className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">Groups</h2>
                </div>
                <p className="text-4xl mt-4 font-bold font-mono text-[#7C6FF0]">
                  {Object.keys(groupCounts).length}
                </p>
              </div>

              <div className="bg-[#111827]/70 backdrop-blur-xl border border-[#1F2937] rounded-2xl p-6 shadow-lg
                              hover:border-[#34D399]/40 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)] transition-all">
                <div className="flex items-center gap-3">
                  <Star className="text-[#34D399]" size={20} />
                  <h2 className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">Top group</h2>
                </div>
                <p className="text-2xl mt-4 font-bold font-mono text-[#E6E8EC]">
                  {mostPopulatedGroup}
                </p>
              </div>

            </div>

            {/* Group Overview */}
            <div>
              <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7] mb-4">
                Group overview
              </h2>

              {Object.keys(groupCounts).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {Object.entries(groupCounts).map(([group, count]) => (
                    <div
                      key={group}
                      className="bg-[#111827]/70 backdrop-blur-lg border border-[#1F2937] rounded-xl p-5 text-center
                                 hover:border-[#7C6FF0]/40 transition-all"
                    >
                      <p className="font-mono text-xs tracking-widest uppercase text-[#8B93A7]">{group}</p>
                      <p className="text-2xl font-bold mt-1 text-[#E6E8EC]">{count}</p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-[#8B93A7]">No groups yet.</p>
              )}
            </div>

            {/* Recent Passwords */}
            <div>
              <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7] mb-4">
                Recently added
              </h2>

              {stats.recentPasswords.length > 0 ? (
                <div className="space-y-3">

                  {stats.recentPasswords.map((pass) => (
                    <div
                      key={pass._id}
                      className="bg-[#111827]/70 backdrop-blur-lg border border-[#1F2937] rounded-xl p-4
                                 flex justify-between items-center hover:border-[#34D399]/30 transition-all"
                    >
                      <div>
                        <p className="font-medium text-[#E6E8EC]">{pass.name}</p>
                        <p className="text-sm text-[#8B93A7]">
                          {pass.group || "General"}
                        </p>
                      </div>

                      <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-full
                                        bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                        New
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-[#8B93A7]">No passwords added yet.</p>
              )}
            </div>

<div className="bg-[#111827]/70 backdrop-blur-lg border border-[#1F2937] rounded-xl p-5">
  <h2 className="font-mono text-sm tracking-widest uppercase text-[#FBBF24] mb-4">
    Security Alerts
  </h2>

  {securityAlerts.length > 0 ? (
    <div className="space-y-3">
      {securityAlerts.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b border-white/10 pb-2"
        >
          <span>{item.website}</span>
          <span className="text-red-400">{item.age} days old</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[#8B93A7]">
      🎉 All your passwords are up to date.
    </p>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};