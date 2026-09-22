import { create } from "zustand";
import { axiosinstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set) => ({
  groups: [],
  loading: false,

  getGroups: async () => {
    try {
      set({ loading: true });
      const res = await axiosinstance.get("/groups");
      set({
        groups: res.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosinstance.post("/groups", groupData);
      set((state) => ({
        groups: [...state.groups, res.data],
      }));
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  },

  deleteGroup: async (groupId) => {
    try {
      // console.log(groupId)
        const response = await axiosinstance.delete(
            `/groups/${groupId}`
        );

        console.log(response)
        set((state) => ({
            groups: state.groups.filter(
                (group) => group._id !== groupId
            )
        }));

        toast.success(
            "Group deleted. Passwords moved to recycle bin."
        );

        return response.data;

    } catch (error) {
        console.error("Error deleting group:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to delete group"
        );

        throw error;
    }
  },
  
}));
