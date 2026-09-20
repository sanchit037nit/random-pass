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
}));
