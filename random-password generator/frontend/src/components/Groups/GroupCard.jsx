import { useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/groups/${group._id}`)}
      className="cursor-pointer rounded-xl border bg-base-100 p-5 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
      style={{
        borderLeft: `6px solid ${group.color}`,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Folder size={30} color={group.color} />

          <div>
            <h2 className="font-bold text-lg">{group.name}</h2>

            <p className="text-sm opacity-70">
              {group.passwordCount} Passwords
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
