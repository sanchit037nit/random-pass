
import {create} from 'zustand';


export const useThemeStore = create((set) => ({
  theme: "dark",

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.remove("dark", "light", "neon");
    document.documentElement.classList.add(theme);

    set({ theme });
  },

  initTheme: () => {
    const saved = localStorage.getItem("theme") || "dark";

    document.documentElement.classList.remove("dark", "light", "neon");
    document.documentElement.classList.add(saved);

    set({ theme: saved });
  },
}));