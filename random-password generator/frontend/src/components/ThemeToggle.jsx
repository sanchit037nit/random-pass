import { useThemeStore } from "../store/usethemestore";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme}>
      {theme}
    </button>
  );
};

export default ThemeToggle