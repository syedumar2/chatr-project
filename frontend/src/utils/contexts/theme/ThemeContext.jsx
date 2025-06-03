import { createContext, useContext } from "react";

const ThemeContext = createContext();
// /creates a new context object called ThemeContext.

export const useTheme = () => useContext(ThemeContext);
// defines and exports a custom hook called useTheme.
// will give you access to whatever value is currently provided to the ThemeContext

export default ThemeContext;