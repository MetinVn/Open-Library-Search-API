import { useEffect, useState } from "react";

const useTheme = () => {
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem("themeColor") || "light");

  useEffect(() => {
    document.documentElement.className = themeColor;
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  return [themeColor, setThemeColor];
};
export default useTheme;
