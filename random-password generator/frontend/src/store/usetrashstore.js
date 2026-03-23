import { create } from "zustand";
import { axiosinstance } from "../lib/axios.js";

export const useTrashStore = create((set) => ({
  trashItems: [],
  isLoading: false,

  getTrash: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosinstance.get("/trash");
      set({ trashItems: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  restoreItem: async (id) => {
    try {
      await axiosinstance.put(`/restore/${id}`);
      set((state) => ({
        trashItems: state.trashItems.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteForever: async (id) => {
    try {
      await axiosinstance.delete(`/delete/${id}`);
      set((state) => ({
        trashItems: state.trashItems.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));