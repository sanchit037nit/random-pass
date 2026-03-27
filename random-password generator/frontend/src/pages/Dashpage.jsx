import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { axiosinstance } from '../lib/axios.js';
import axios from "axios";

export const Dashpage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPasswords: 0,
    groupCounts: {},
    recentPasswords: [],
  });

  const id=authUser?._id
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        // const res = await axios.get(`http://localhost:5003/api/pass/dashboard/${authUser._id}`);
        const res=await axiosinstance.get(`/pass/dashboard/${id}`)
        console.log(res.data)

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
      <div className="text-white p-8 text-center">
        Loading...
      </div>
    );
  }

  const groupCounts = stats.groupCounts || {};

  const mostPopulatedGroup =
    Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Total Passwords</h2>
            <p className="text-3xl mt-2">{stats.totalPasswords}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Groups</h2>
            <p className="text-3xl mt-2">{Object.keys(groupCounts).length}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Most Populated Group</h2>
            <p className="text-3xl mt-2">{mostPopulatedGroup}</p>
          </div>

        </div>

        {/* Groups Overview */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Group Overview</h2>

          {Object.keys(groupCounts).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {Object.entries(groupCounts).map(([group, count]) => (
                <div
                  key={group}
                  className="bg-gray-800 rounded-lg p-4 shadow-md text-center"
                >
                  <p className="font-semibold">{group}</p>
                  <p className="text-xl">{count}</p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-400">No groups yet.</p>
          )}
        </div>

        {/* Recent Passwords */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recently Added</h2>

          {stats.recentPasswords.length > 0 ? (
            <div className="space-y-2">

              {stats.recentPasswords.map((pass) => (
                <div
                  key={pass._id}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
                >
                  <p>{pass.name}</p>
                  <p>{pass.group || "General"}</p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-400">No passwords added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};