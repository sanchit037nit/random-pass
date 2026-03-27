import { useEffect } from "react";
import { useTrashStore } from "../store/usetrashstore.js";
import { Trash2, RotateCcw } from "lucide-react";
import { useAuthStore } from "../store/useauthstore.js";

const RecycleBinPage = () => {
  const { trashItems, getTrash, restoreItem, deleteForever, isLoading } = useTrashStore();
  const { authUser} =useAuthStore()
  const id = authUser?._id;


  useEffect(() => {
    getTrash(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Recycle Bin</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : trashItems.length === 0 ? (
        <p className="text-gray-400">Recycle Bin is empty</p>
      ) : (
        <div className="space-y-4">
          {trashItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-gray-700"
            >
              {/* Item Info */}
            <div>
              <p className="font-medium">
                {item.name || item.title}
              </p>

              <p className="text-sm text-gray-400">
                Deleted on: {item.deletedAt?.split("T")[0]}
              </p>
            </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => restoreItem(item._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>

                <button
                  onClick={() => deleteForever(item._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecycleBinPage;