import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import Navbar from "../components/Navbar";
import GroupGrid from "../components/Groups/GroupGrid";
import CreateGroupModal from "../components/Groups/CreateGroupModal";

import { useGroupStore } from "../store/useGroupStore";

export const Homepage = () => {
  const { groups, getGroups } = useGroupStore();

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
      <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#34D399]/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full bg-[#7C6FF0]/10 blur-[120px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#1F2937 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 min-h-screen">
        <Navbar />

        <div className="flex flex-col items-center mt-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7]">
            Encrypted Storage
          </p>

          <h1 className="text-4xl font-bold font-mono mt-2">
            My Password Vault
          </h1>
        </div>

        <div className="flex justify-between items-center gap-4 px-8 mt-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />

            <input
              type="text"
              placeholder="Search Groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          <button
            className="btn btn-primary gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus size={18} />
            New Group
          </button>
        </div>

        <div className="px-8 mt-10">
          <GroupGrid groups={filteredGroups} />
        </div>

        <CreateGroupModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};
