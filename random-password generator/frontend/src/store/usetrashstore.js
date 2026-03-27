import { create } from "zustand";
import { axiosinstance } from "../lib/axios.js";
import { toast } from 'react-hot-toast';

export const useTrashStore = create((set) => ({
  trashItems: [],
  isLoading: false,

  getTrash: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosinstance.get(`/pass/recycle/${userId}`);
      set({ trashItems: res.data.passwords });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  restoreItem: async (id) => {
    try {
      await axiosinstance.patch(`/pass/restore/${id}`);
      set((state) => ({
        trashItems: state.trashItems.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteForever: async (id) => {
    try {
      await axiosinstance.delete(`/pass/deleteforever/${id}`);
      set((state) => ({
        trashItems: state.trashItems.filter((item) => item._id !== id),
      }));
      toast.success("password deleted successfully")
    } catch (err) {
      console.error(err);
    }
  },

}));