import { create } from "zustand";
import { axiosinstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { encryptData, decryptData } from "../lib/crypto.js";
import { useAuthStore } from "./useauthstore.js";

export const usePasStore = create((set, get) => ({
  passes: [],
  selectedpass: null,
  createdpass: null,
  generatedPassword: "",
  setGeneratedPassword: (pwd) => set({ generatedPassword: pwd }),
  totalPages: 1,
  securityAlerts: [],

  createpass: async (data) => {
    try {
      const { passes } = get();
      const { masterKey } = useAuthStore.getState();
      
      let payload = { ...data };
      if (masterKey) {
        payload.name = await encryptData(data.name, masterKey);
        payload.password = await encryptData(data.password, masterKey);
        payload.description = await encryptData(data.description, masterKey);
      }
      
      const newpass = await axiosinstance.post("/pass/create", payload);
      
      let decryptedPass = { ...newpass.data };
      if (masterKey) {
        decryptedPass.name = await decryptData(decryptedPass.name, masterKey);
        decryptedPass.password = await decryptData(decryptedPass.password, masterKey);
        decryptedPass.description = await decryptData(decryptedPass.description, masterKey);
      }
      
      set({ passes: [...passes, decryptedPass] });
      toast.success("password created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating password");
    }
  },

  updatepass: async (data, id) => {
    try {
      const { masterKey } = useAuthStore.getState();
      let payload = { ...data };
      if (masterKey) {
        if (data.name) payload.name = await encryptData(data.name, masterKey);
        if (data.password) payload.password = await encryptData(data.password, masterKey);
        if (data.description) payload.description = await encryptData(data.description, masterKey);
      }

      await axiosinstance.patch(`/pass/update/${id}`, payload);

      toast.success("password updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    }
  },

  deletepass: async (id) => {
    try {
      const { passes } = get();
      await axiosinstance.delete(`/pass/delete/${id}`);
      const npas = passes.filter((pass) => pass._id !== id);
      set({ passes: npas });
      toast.success("password moved to recycle bin!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting");
    }
  },

  viewpass: async (id, navigate) => {
    try {
      const res = await axiosinstance.get(`/pass/view/${id}`);
      const { masterKey } = useAuthStore.getState();
      
      let decryptedPass = { ...res.data.password };
      if (masterKey) {
        decryptedPass.name = await decryptData(decryptedPass.name, masterKey);
        decryptedPass.password = await decryptData(decryptedPass.password, masterKey);
        decryptedPass.description = await decryptData(decryptedPass.description, masterKey);
      }
      
      set({ selectedpass: { password: decryptedPass } });
      navigate("/view");
    } catch (error) {
      console.log(error);
      toast.error("error occurred");
    }
  },

  getpass: async (userId, page = 1) => {
    try {
      const res = await axiosinstance.get(
        `/pass/get/${userId}?page=${page}&limit=10`,
      );
      
      const { masterKey } = useAuthStore.getState();
      const decryptedPasswords = await Promise.all(
        res.data.passwords.map(async (p) => {
          if (!masterKey) return p;
          return {
            ...p,
            name: await decryptData(p.name, masterKey),
            password: await decryptData(p.password, masterKey),
            description: await decryptData(p.description, masterKey),
          };
        })
      );
  
      set({
        passes: decryptedPasswords,
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
  },

  downloadpass: async (id) => {
    try {
      // NOTE: With Zero-Knowledge Architecture, generating a readable PDF on the backend
      // is no longer possible since the backend only sees ciphertext. A true E2EE app
      // would generate this PDF on the frontend. This will currently download ciphertext.
      const response = await axiosinstance.get(`/pass/download/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "passwords.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  },

  getSecurityAlerts: async () => {
    try {
      const res = await axiosinstance.get("/pass/security-alerts");

      set({
        securityAlerts: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getPasswordsByGroup: async (groupId) => {
    try {
      const res = await axiosinstance.get(`/groups/${groupId}/passwords`);
      const { masterKey } = useAuthStore.getState();
      
      const decryptedPasswords = await Promise.all(
        res.data.map(async (p) => {
          if (!masterKey) return p;
          return {
            ...p,
            name: await decryptData(p.name, masterKey),
            password: await decryptData(p.password, masterKey),
            description: await decryptData(p.description, masterKey),
          };
        })
      );

      set({
        passes: decryptedPasswords,
        totalPages: 1,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch passwords");
    }
  },
}));
