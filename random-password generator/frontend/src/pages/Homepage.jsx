import { useEffect, useState } from "react";
import { Plus, Search, Shield, Layers } from "lucide-react";
import Navbar from "../components/Navbar";
import GroupGrid from "../components/Groups/GroupGrid";
import CreateGroupModal from "../components/Groups/CreateGroupModal";
import { useGroupStore } from "../store/useGroupStore";

export const Homepage = () => {
  const { groups, getGroups, deleteGroup } = useGroupStore();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()),
  );

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

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#8B93A7] mb-2 flex items-center gap-2">
                <Shield size={14} className="text-[#34D399]" /> Secure Storage
              </p>
              <h1 className="text-4xl font-bold font-mono text-white tracking-tight">
                My Password Vault
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#111827]/70 backdrop-blur-md border border-[#1F2937] text-[#E6E8EC] pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C6FF0]/50 focus:border-[#7C6FF0]/50 transition-all placeholder-[#8B93A7]/50 shadow-inner"
                />
              </div>

              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#7C6FF0] hover:bg-[#6b5ee0] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(124,111,240,0.3)] hover:shadow-[0_0_25px_rgba(124,111,240,0.5)] hover:-translate-y-0.5"
                onClick={() => setOpen(true)}
              >
                <Plus size={18} />
                New Group
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#111827]/30 backdrop-blur-sm border border-[#1F2937] rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-8 border-b border-[#1F2937] pb-4">
               <Layers size={18} className="text-[#8B93A7]" />
               <h2 className="font-mono text-sm tracking-widest uppercase text-[#8B93A7]">Vault Collections</h2>
            </div>
            
            <GroupGrid groups={filteredGroups} onDeleteGroup={deleteGroup} />
          </div>
        </div>

        <CreateGroupModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};
