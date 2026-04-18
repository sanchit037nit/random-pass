import { useEffect } from "react";
import { useTrashStore } from "../store/usetrashstore.js";
import { Trash2, RotateCcw, Inbox } from "lucide-react";
import { useAuthStore } from "../store/useauthstore.js";

const RecycleBinPage = () => {
  const { trashItems, getTrash, restoreItem, deleteForever, isLoading } =
    useTrashStore();

  const { authUser } = useAuthStore();
  const id = authUser?._id;

  useEffect(() => {
    if (id) getTrash(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          🗑️ Recycle Bin
        </h1>
        <p className="text-gray-400 mt-2">
          Items here will be permanently deleted after some time.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-gray-400 animate-pulse">Loading deleted items...</div>
      )}

      {/* Empty State */}
      {!isLoading && trashItems.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="p-6 rounded-full bg-white/5 border border-gray-700">
            <Inbox size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Nothing in Recycle Bin</h2>
          <p className="text-gray-500 mt-1">
            Deleted files will appear here so you can restore them anytime.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trashItems.map((item) => (
          <div
            key={item._id}
            className="group relative bg-white/5 border border-gray-700 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-green-500/10 to-red-500/10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <p className="font-semibold text-lg truncate">
                {item.name || item.title}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Deleted:{" "}
                {item.deletedAt
                  ? new Date(item.deletedAt).toLocaleDateString()
                  : "Unknown"}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => restoreItem(item._id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-green-600/80 hover:bg-green-500 transition"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>

                <button
                  onClick={() => deleteForever(item._id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-red-600/80 hover:bg-red-500 transition"
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
  );
};

export default RecycleBinPage;