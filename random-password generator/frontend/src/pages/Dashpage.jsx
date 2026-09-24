import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { axiosinstance } from "../lib/axios.js";
import { Shield, Layers, Star } from "lucide-react";
import { usePasStore } from "../store/usepasstore.js";

export const Dashpage = () => {
  const { authUser, masterKey } = useAuthStore();
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

        let recentDecrypted = res.data?.recentPasswords || [];
        if (masterKey) {
          const { decryptData } = await import("../lib/crypto.js");
          recentDecrypted = await Promise.all(
            recentDecrypted.map(async (p) => ({
              ...p,
              name: await decryptData(p.name, masterKey),
              password: await decryptData(p.password, masterKey),
              description: await decryptData(p.description, masterKey),
            }))
          );
        }

        setStats({
          totalPasswords: res.data?.totalPasswords || 0,
          groupCounts: res.data?.groupCounts || {},
          recentPasswords: recentDecrypted,
        });
      } catch (err) {
        console.log("Dashboard API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authUser, navigate, masterKey]);

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

  console.log(mostPopulatedGroup);

  return (
    <div className="min-h-screen relative text-[#E6E8EC] overflow-hidden bg-[#0A0E14] font-sans">
      {/* Ambient glow field */}
      <div className="pointer-events-none absolute -top-40 -left-24 w-[500px] h-[500px] rounded-full bg-[#34D399]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -right-24 w-[500px] h-[500px] rounded-full bg-[#7C6FF0]/10 blur-[120px]" />

      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#1F2937 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex flex-col items-center pt-24 pb-16 px-6">
          <div className="w-full max-w-6xl space-y-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#8B93A7] mb-2 flex items-center gap-2">
                  <Star size={14} className="text-[#FBBF24]" /> Vault Analytics
                </p>
                <h1 className="text-4xl font-bold font-mono text-white tracking-tight">
                  Dashboard Overview
                </h1>
              </div>
              
              <div className="bg-[#111827]/80 backdrop-blur-md border border-[#1F2937] px-6 py-3 rounded-full flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34D399]"></span>
                </span>
                <span className="font-mono text-sm tracking-widest uppercase text-[#34D399]">
                  E2EE Active
                </span>
              </div>
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Passwords */}
              <div className="group bg-[#111827]/70 backdrop-blur-xl border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#34D399]/40 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#34D399]/20 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7] mb-2">Total Items</h2>
                    <p className="text-6xl font-bold font-mono text-white mt-4">{stats.totalPasswords}</p>
                  </div>
                  <div className="p-4 bg-[#34D399]/10 rounded-2xl border border-[#34D399]/20">
                    <Shield className="text-[#34D399]" size={32} />
                  </div>
                </div>
              </div>

              {/* Total Groups */}
              <div className="group bg-[#111827]/70 backdrop-blur-xl border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#7C6FF0]/40 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C6FF0]/20 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7] mb-2">Vault Groups</h2>
                    <p className="text-6xl font-bold font-mono text-white mt-4">{Object.keys(groupCounts).length}</p>
                  </div>
                  <div className="p-4 bg-[#7C6FF0]/10 rounded-2xl border border-[#7C6FF0]/20">
                    <Layers className="text-[#7C6FF0]" size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Content: Groups & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Group Overview Container */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                  <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7] flex items-center gap-2">
                    <Layers size={16}/> Group Distribution
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(groupCounts).map(([groupId, group]) => (
                    <div key={groupId} className="bg-[#0A0E14]/60 backdrop-blur-md border border-[#1F2937] rounded-2xl p-6 transition-all hover:border-[#7C6FF0]/40 hover:bg-[#111827]">
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#7C6FF0]/10 flex items-center justify-center">
                           <Star size={16} className="text-[#7C6FF0]" />
                        </div>
                        <p className="text-3xl font-bold font-mono text-[#E6E8EC]">{group.count}</p>
                      </div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#8B93A7] truncate">
                        {group.name}
                      </p>
                    </div>
                  ))}
                  {Object.keys(groupCounts).length === 0 && (
                     <div className="col-span-2 text-center text-[#8B93A7] py-8">No groups found</div>
                  )}
                </div>
              </div>

              {/* Right Side: Security & Recent */}
              <div className="space-y-8">
                
                {/* Security Alerts */}
                <div className="bg-[#111827]/70 backdrop-blur-xl border border-[#FBBF24]/20 rounded-3xl p-6 shadow-lg shadow-[#FBBF24]/5">
                  <h2 className="font-mono text-sm tracking-widest uppercase text-[#FBBF24] mb-6 flex items-center gap-2">
                    <Shield size={16} /> Security Alerts
                  </h2>

                  {securityAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {securityAlerts.map((item) => (
                        <div key={item._id} className="flex justify-between items-center bg-[#FBBF24]/5 border border-[#FBBF24]/20 p-4 rounded-xl">
                          <span className="font-medium text-[#E6E8EC]">{item.website}</span>
                          <span className="text-[#FBBF24] text-sm font-mono bg-[#FBBF24]/10 px-3 py-1 rounded-full">{item.age} days old</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-[#34D399]/5 border border-[#34D399]/20 p-5 rounded-xl">
                      <div className="p-3 bg-[#34D399]/20 rounded-full text-[#34D399]">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-[#E6E8EC] font-medium">Vault is secure</p>
                        <p className="text-[#8B93A7] text-sm">All passwords are up to date.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recently Added */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-6">
                    <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7]">
                      Recently Added
                    </h2>
                  </div>

                  {stats.recentPasswords.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentPasswords.map((pass) => (
                        <div key={pass._id} className="bg-[#0A0E14]/60 backdrop-blur-md border border-[#1F2937] rounded-xl p-5 flex justify-between items-center group hover:border-[#34D399]/40 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-[#8B93A7] group-hover:bg-[#34D399]/10 group-hover:text-[#34D399] transition-colors">
                              <Star size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-[#E6E8EC]">{pass.name}</p>
                              <p className="text-xs text-[#8B93A7] mt-1">{pass.group?.name || "General"}</p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                            New
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#8B93A7] text-center py-6">No passwords added yet.</p>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
