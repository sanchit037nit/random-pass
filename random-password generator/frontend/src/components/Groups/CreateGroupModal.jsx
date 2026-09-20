import { useState } from "react";
import { X } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";

const icons = ["📁", "🎓", "💼", "🏠", "💳", "🎮", "📱", "❤️"];

const colors = [
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#6B7280",
];

const CreateGroupModal = ({ open, onClose }) => {
  const { createGroup } = useGroupStore();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      await createGroup({
        name: name.trim(),
        icon,
        color,
      });

      setName("");
      setIcon("📁");
      setColor("#3B82F6");

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Group</h2>

          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-5">
            <label className="label">
              <span className="label-text font-medium">Group Name</span>
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="College"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Icons */}
          <div className="mb-5">
            <label className="label">
              <span className="label-text font-medium">Choose Icon</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {icons.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setIcon(item)}
                  className={`rounded-lg border p-3 text-2xl transition ${
                    icon === item
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-medium">Choose Color</span>
            </label>

            <div className="flex flex-wrap gap-3">
              {colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`h-9 w-9 rounded-full border-4 transition ${
                    color === item ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="mb-6 flex items-center gap-3 rounded-xl border p-4"
            style={{ borderLeft: `6px solid ${color}` }}
          >
            <span className="text-3xl">{icon}</span>

            <div>
              <p className="font-semibold">{name || "New Group"}</p>

              <p className="text-sm text-gray-500">0 Passwords</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
