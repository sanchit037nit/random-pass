import { useNavigate } from "react-router-dom";
import { Folder, Trash2 } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";

const GroupCard = ({ group  }) => {
  const navigate = useNavigate();
  const { deleteGroup } = useGroupStore()

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteGroup(group._id);
  };

  return (
    <div
      onClick={() => navigate(`/groups/${group._id}`)}
      className="cursor-pointer rounded-xl border bg-base-100 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderLeft: `6px solid ${group.color}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder size={30} color={group.color} />

          <div>
            <h2 className="text-lg font-bold">{group.name}</h2>

            <p className="text-sm opacity-70">
              {group.passwordCount} Passwords
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="btn btn-ghost btn-sm text-error"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default GroupCard;