import { SunIcon, MoonIcon } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";
import { useTheme } from "@/lib/context/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 hover:bg-[--chatgpt-bg-hover] rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      <Icon source={theme === "dark" ? SunIcon : MoonIcon} />
    </button>
  );
}
