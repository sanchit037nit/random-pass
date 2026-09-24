import { ArrowLeft, Search, Download, Key, Shield, EyeOff, Eye, Trash2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { usePasStore } from "../store/usepasstore.js";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useGroupStore } from "../store/useGroupStore.js";

const GroupPage = () => {
  const navigate = useNavigate();

  const {
    getpass,
    passes,
    getPasswordsByGroup,
    deletepass,
    viewpass,
    downloadpass,
    totalPages,
  } = usePasStore();

  const { authUser } = useAuthStore();
  const { groups, getGroups } = useGroupStore();
  const [visibleIds, setVisibleIds] = useState([]);
  const [spass, setspass] = useState("");
  const [sort, setsort] = useState(false);

  const orderedpasses = [...passes];

  if (sort) {
    orderedpasses.sort((a, b) => a.name.localeCompare(b.name));
  }

  const toggleView = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };
  const [page, setPage] = useState(1);
  const id = authUser?._id;

  const debouncedSearch = debounce((value) => {
    setspass(value);
  }, 500);

  const { groupId } = useParams();

  const currentGroup = groups.find((group) => group._id === groupId);

  useEffect(() => {
    if (groupId) {
      getPasswordsByGroup(groupId, page);
    }
  }, [groupId, page]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleView = (e, passId) => {
    e.stopPropagation();
    viewpass(passId, navigate);
  };

  const handleDelete = (e, passId) => {
    e.stopPropagation(); // prevent card click
    deletepass(passId);
  };

  const handleDownload = (e, sort) => {
    e.stopPropagation();
    downloadpass(id);
    setsort(sort)
  };

  return (
    <div className="min-h-screen relative text-[#E6E8EC] font-sans overflow-hidden bg-[#0A0E14]">
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

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col">
          
          <div className="flex justify-between items-center mb-8">
            <button 
              className="flex items-center gap-2 text-[#8B93A7] hover:text-white transition-colors"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={18} />
              <span className="font-mono text-sm tracking-widest uppercase">Back to Groups</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#8B93A7] mb-2 flex items-center gap-2">
                <Shield size={14} className="text-[#7C6FF0]" /> Vault Collection
              </p>
              <h1 className="text-4xl font-bold font-mono text-white tracking-tight">
                {currentGroup?.name || "Loading..."}
              </h1>
              <p className="text-sm text-[#34D399] font-mono mt-2">{passes.length} Items Secured</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
                <input
                  type="text"
                  placeholder="Search passwords..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full bg-[#111827]/70 backdrop-blur-md border border-[#1F2937] text-[#E6E8EC] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34D399]/50 focus:border-[#34D399]/50 transition-all placeholder-[#8B93A7]/50 shadow-inner text-sm"
                />
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#1F2937] text-[#E6E8EC] hover:bg-[#111827] hover:border-[#7C6FF0]/50 hover:shadow-[0_0_15px_rgba(124,111,240,0.2)] transition-all text-sm font-medium"
                  onClick={(e) => handleDownload(e, !sort)}
                >
                  <Download size={16} className="text-[#7C6FF0]" /> PDF
                </button>

                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#1F2937] text-[#E6E8EC] hover:bg-[#111827] hover:border-[#34D399]/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)] transition-all text-sm font-medium"
                  onClick={() => setsort(!sort)}
                >
                  {sort ? "Reset" : "Sort A–Z"}
                </button>
              </div>
            </div>
          </div>

          {/* Password Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orderedpasses
                .filter((pass) =>
                  pass.name.toLowerCase().includes(spass.toLowerCase()),
                )
                .map((pass) => (
                  <motion.div
                    key={pass._id}
                    onClick={(e) => handleView(e, pass._id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cursor-pointer group bg-[#111827]/40 backdrop-blur-md p-6 rounded-2xl border border-[#1F2937] shadow-lg hover:border-[#34D399]/40 hover:bg-[#111827]/70 transition-all flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className="p-3 bg-[#34D399]/10 rounded-xl text-[#34D399] group-hover:scale-110 transition-transform">
                            <Key size={20} />
                         </div>
                         <div>
                            <p className="text-xl font-medium text-white">{pass.name}</p>
                            <p className="text-xs text-[#8B93A7] mt-1">{new Date(pass.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDelete(e, pass._id)}
                        className="text-[#8B93A7] hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="bg-[#0A0E14]/80 p-4 rounded-xl border border-[#1F2937] flex justify-between items-center group-hover:border-[#34D399]/20 transition-colors">
                        <div className="font-mono text-[#E6E8EC] tracking-wider text-sm flex-1">
                          {visibleIds.includes(pass._id) ? pass.password : "••••••••••••"}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleView(pass._id);
                          }}
                          className="text-[#8B93A7] hover:text-[#34D399] p-1 transition-colors"
                        >
                          {visibleIds.includes(pass._id) ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                  </motion.div>
                ))}
            </div>
            
            {orderedpasses.filter((pass) => pass.name.toLowerCase().includes(spass.toLowerCase())).length === 0 && (
              <div className="text-center py-20 bg-[#111827]/20 border border-[#1F2937] rounded-3xl backdrop-blur-sm">
                 <Key size={48} className="mx-auto text-[#8B93A7] mb-4 opacity-50" />
                 <p className="text-[#8B93A7]">No passwords found in this collection.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 py-10 mt-6 border-t border-[#1F2937]/50">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest transition
                  ${page === 1
                    ? "bg-[#111827]/50 border border-[#1F2937] text-[#8B93A7] cursor-not-allowed"
                    : "bg-[#111827] border border-[#34D399]/30 text-[#34D399] hover:bg-[#34D399]/10"
                  }`}
              >
                ← Prev
              </button>

              <span className="font-mono text-xs tracking-widest uppercase text-[#8B93A7] bg-[#111827] px-4 py-2 rounded-lg border border-[#1F2937]">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest transition
                  ${page === totalPages
                    ? "bg-[#111827]/50 border border-[#1F2937] text-[#8B93A7] cursor-not-allowed"
                    : "bg-[#111827] border border-[#34D399]/30 text-[#34D399] hover:bg-[#34D399]/10"
                  }`}
              >
                Next →
              </button>
            </div>
          )}

        </div>

        {/* Floating Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => navigate("/ranpass")}
            className="w-16 h-16 bg-[#34D399] text-[#0A0E14] flex items-center justify-center rounded-full
                       shadow-[0_0_20px_rgba(52,211,153,0.3)]
                       hover:shadow-[0_0_35px_rgba(52,211,153,0.6)] hover:scale-110 transition-all duration-300"
          >
            <Plus size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
