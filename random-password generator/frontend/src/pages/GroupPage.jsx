
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { usePasStore } from "../store/usepasstore.js";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import "@splinetool/viewer";
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

  const groupedPasswords = orderedpasses.reduce((acc, pass) => {
    const group = pass.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(pass);
    return acc;
  }, {});

  const toggleView = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };
const [page, setPage] = useState(1);
  const id = authUser?._id;

  const debouncedSearch = debounce((value) => {
  setspass(value);
  }, 500);

  const { groupId } = useParams();

const currentGroup = groups.find(
    (group) => group._id === groupId
);

  useEffect(() => {
      console.log("groupId:", groupId);

    if (groupId) {
        getPasswordsByGroup(groupId, page);
    }
}, [groupId, page]);


useEffect(() => {
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }
}, [page, totalPages]);
  


 const handleView = (e,passId) => {
    e.stopPropagation();
     viewpass(passId, navigate);
  };

  const handleDelete = (e, passId) => {
    e.stopPropagation(); // prevent card click
    deletepass(passId);
  };

  const handleDownload = (e) => {
    e.stopPropagation(); 
    downloadpass(id);
  };


    return (

    <div className="min-h-screen relative text-[#E6E8EC] font-sans overflow-hidden bg-[#0A0E14]">

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


            <div className="relative z-10 flex flex-col min-h-screen">

                <Navbar />
        <div className="flex flex-col items-center mt-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-2">
            Encrypted storage
          </p>
          <h1 className="text-4xl font-bold font-mono text-[#E6E8EC]">
            My password vault
          </h1>
        </div>
                {/* ================= Header ================= */}

                <div className="flex justify-between items-center px-8 mt-8">

                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={18}/>
                        Back
                    </button>

<div>

    <h1 className="text-3xl font-bold">
        {currentGroup?.name || "Loading..."}
    </h1>

    <p className="text-sm text-[#8B93A7]">
        {passes.length} Passwords
    </p>

</div>

                </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mx-6 sm:mx-10 mt-8">
          <input
            type="text"
            value={spass}
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search passwords..."
            className="px-4 py-2 rounded-lg bg-[#111827]/80 border border-[#1F2937] text-[#E6E8EC]
                       placeholder:text-[#8B93A7]/50
                       focus:outline-none focus:ring-2 focus:ring-[#34D399]/60 focus:border-[#34D399]/60
                       w-full sm:w-72 backdrop-blur transition"
          />

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
                         hover:border-[#7C6FF0] hover:shadow-[0_0_16px_rgba(124,111,240,0.3)] transition-all"
              onClick={() => handleDownload(!sort)}
            >
              Download
            </button>

            <button
              className="px-4 py-2 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold
                         hover:border-[#7C6FF0] hover:shadow-[0_0_16px_rgba(124,111,240,0.3)] transition-all"
              onClick={() => setsort(!sort)}
            >
              {sort ? "Reset order" : "Sort A–Z"}
            </button>
          </div>
        </div>

                {/* ================= Password Cards ================= */}

<div className="space-y-10 p-6 sm:p-8">
  {passes
    .filter((pass) =>
      pass.name.toLowerCase().includes(spass.toLowerCase())
    )
    .map((pass) => (
      <motion.div
        key={pass._id}
        onClick={(e) => handleView(e, pass._id)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cursor-pointer bg-[#111827]/70 backdrop-blur-md p-5 rounded-xl border border-[#1F2937]
                   shadow-lg hover:border-[#34D399]/40 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)]
                   transition-all flex justify-between items-center"
      >
        {/* Info */}
        <div className="space-y-2">
          <p>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
              Name
            </span>{" "}
            {pass.name}
          </p>

          <p className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
              Password
            </span>

            <span className="font-mono">
              {visibleIds.includes(pass._id)
                ? pass.password
                : "••••••••"}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleView(pass._id);
              }}
              className="text-[#7C6FF0] hover:text-[#34D399] transition-colors"
            >
              {visibleIds.includes(pass._id) ? "🙈" : "👁️"}
            </button>
          </p>

          <p className="text-sm text-[#8B93A7]">
            {new Date(pass.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => handleDelete(e, pass._id)}
          className="p-[2px] rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:scale-110 transition"
        >
          <span className="flex items-center justify-center bg-[#0A0E14] rounded-full p-2 text-red-400">
            ❌
          </span>
        </button>
      </motion.div>
    ))}
</div>

                {/* ================= Pagination ================= */}

        <div className="flex justify-center items-center gap-4 py-8">

          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-5 py-2 rounded-lg font-medium transition
              ${
                page === 1
                  ? "bg-[#111827] border border-[#1F2937] text-[#8B93A7] cursor-not-allowed opacity-50"
                  : "bg-[#34D399] text-[#0A0E14] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              }`}
          >
            ← Previous
          </button>

          <span className="font-mono text-sm tracking-widest uppercase text-[#8B93A7]">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-5 py-2 rounded-lg font-medium transition
              ${
                page === totalPages
                  ? "bg-[#111827] border border-[#1F2937] text-[#8B93A7] cursor-not-allowed opacity-50"
                  : "bg-[#34D399] text-[#0A0E14] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              }`}
          >
            Next →
          </button>

        </div>

                {/* ================= Floating Add Button ================= */}

        {/* Floating Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate("/ranpass")}
            className="w-14 h-14 bg-[#34D399] text-[#0A0E14] text-2xl font-bold rounded-full
                       shadow-[0_0_0_1px_rgba(52,211,153,0.4)]
                       hover:shadow-[0_0_28px_rgba(52,211,153,0.5)] hover:scale-110 transition-all"
          >
            +
          </button>
        </div>


            </div>

        </div>

    );

};

export default GroupPage;