import { useEffect } from "react";
import { useTrashStore } from "../store/usetrashstore.js";
import { Trash2, RotateCcw, Inbox } from "lucide-react";
import { useAuthStore } from "../store/useauthstore.js";
import Navbar from "../components/Navbar.jsx";

const RecycleBinPage = () => {
  const { trashItems, getTrash, restoreItem, deleteForever, isLoading } =
    useTrashStore();

  const { authUser } = useAuthStore();
  const id = authUser?._id;

  console.log(trashItems);
  useEffect(() => {
    if (id) getTrash(id);
  }, [id]);

  return (
    <div className="min-h-screen relative bg-[#0A0E14] overflow-hidden">
      <Navbar />

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

      <div className="relative z-10 pt-24 pb-16 text-[#E6E8EC] p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B93A7] mb-2">
            Deleted items
          </p>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-[#E6E8EC]">
            Recycle bin
          </h1>

          <p className="text-[#8B93A7] mt-2">
            Items here will be permanently deleted after some time.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="font-mono text-xs tracking-widest uppercase text-[#8B93A7] animate-pulse">
            Reading deleted records...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trashItems.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="p-6 rounded-full bg-[#111827]/70 border border-[#1F2937]">
              <Inbox size={40} className="text-[#8B93A7]" />
            </div>

            <h2 className="text-xl font-semibold font-mono mt-4 text-[#E6E8EC]">
              Nothing in the recycle bin
            </h2>

            <p className="text-[#8B93A7] mt-1">
              Deleted files will appear here so you can restore them anytime.
            </p>
          </div>
        )}

        {/* Items */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trashItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-[#111827]/70 border border-[#1F2937] rounded-2xl p-5 backdrop-blur-md
                     hover:border-[#7C6FF0]/40 hover:shadow-[0_0_24px_rgba(124,111,240,0.15)]
                     transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                          bg-gradient-to-r from-[#34D399]/10 to-red-500/10 pointer-events-none"
              />

              {/* Content */}
              <div className="relative z-10">
                <p className="font-semibold text-lg truncate text-[#E6E8EC]">
                  {item.name || item.title}
                </p>

                <p className="font-mono text-xs tracking-widest uppercase text-[#8B93A7] mt-1">
                  Deleted{" "}
                  {item.deletedAt
                    ? new Date(item.deletedAt).toLocaleDateString()
                    : "Unknown"}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => restoreItem(item._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-[#1F2937] text-[#34D399]
                           hover:border-[#34D399]/60 hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] transition-all"
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>

                  <button
                    onClick={() => deleteForever(item._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-[#1F2937] text-red-400
                           hover:border-red-400/60 hover:shadow-[0_0_16px_rgba(248,113,113,0.25)] transition-all"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecycleBinPage;
