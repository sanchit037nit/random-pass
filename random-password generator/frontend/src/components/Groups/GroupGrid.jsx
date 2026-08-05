import GroupCard from "./GroupCard";

const GroupGrid = ({ groups }) => {

    if (groups.length === 0) {
        return (
            <div className="text-center py-20">

                <h2 className="text-2xl font-bold">
                    No Groups Found
                </h2>

                <p className="opacity-70 mt-2">
                    Create your first group.
                </p>

            </div>
        );
    }

    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {
                groups.map(group => (

                    <GroupCard
                        key={group._id}
                        group={group}
                    />

                ))
            }

        </div>
    );
};

export default GroupGrid;