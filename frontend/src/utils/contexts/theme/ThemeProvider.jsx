import { useState, useEffect } from "react";
import ThemeContext from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const root = window.document.documentElement; //This line is grabbing a reference to the root element of the entire HTML document 
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark"); //and set default light
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return( 
    <ThemeContext.Provider value = {{theme,toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
