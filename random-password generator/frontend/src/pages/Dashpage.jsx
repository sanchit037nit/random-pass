import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { axiosinstance } from "../lib/axios.js";
import { Shield, Layers, Star } from "lucide-react";

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
      <div className="text-white p-8 text-center">Loading...</div>
    );
  }

  const groupCounts = stats.groupCounts || {};

  const mostPopulatedGroup =
    Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="min-h-screen relative text-white overflow-hidden">

      {/* 🌈 Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>

      {/* 💡 Glow Effects */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="flex justify-center items-start min-h-screen pt-20 px-4">
          <div className="w-full max-w-6xl space-y-10">

            {/* Header */}
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <Shield className="text-indigo-400" />
                  <h2 className="text-lg font-semibold">Total Passwords</h2>
                </div>
                <p className="text-4xl mt-4 font-bold text-indigo-400">
                  {stats.totalPasswords}
                </p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <Layers className="text-purple-400" />
                  <h2 className="text-lg font-semibold">Groups</h2>
                </div>
                <p className="text-4xl mt-4 font-bold text-purple-400">
                  {Object.keys(groupCounts).length}
                </p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <Star className="text-pink-400" />
                  <h2 className="text-lg font-semibold">Top Group</h2>
                </div>
                <p className="text-2xl mt-4 font-bold text-pink-400">
                  {mostPopulatedGroup}
                </p>
              </div>

            </div>

            {/* Group Overview */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Group Overview</h2>

              {Object.keys(groupCounts).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {Object.entries(groupCounts).map(([group, count]) => (
                    <div
                      key={group}
                      className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-5 text-center hover:bg-slate-700/60 transition"
                    >
                      <p className="text-sm text-gray-400">{group}</p>
                      <p className="text-2xl font-bold mt-1">{count}</p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-gray-400">No groups yet.</p>
              )}
            </div>

            {/* Recent Passwords */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>

              {stats.recentPasswords.length > 0 ? (
                <div className="space-y-3">

                  {stats.recentPasswords.map((pass) => (
                    <div
                      key={pass._id}
                      className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-xl p-4 flex justify-between items-center hover:bg-slate-700/60 transition"
                    >
                      <div>
                        <p className="font-medium">{pass.name}</p>
                        <p className="text-sm text-gray-400">
                          {pass.group || "General"}
                        </p>
                      </div>

                      <span className="text-xs text-gray-500">
                        New
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-gray-400">No passwords added yet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};