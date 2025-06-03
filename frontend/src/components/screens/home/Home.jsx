import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./Home.css";
import { Handshake, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../utils/contexts/theme/ThemeContext";

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-blue-300 max-w-full dark:bg-gray-800 dark:text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between gap-6 p-4 px-24 w-full h-14 bg-blue-900 dark:bg-gray-900">
        <div className="flex items-center gap-4 text-xl">
          {/* Icon container: white bg in light, gray-700 in dark */}
          <div className="bg-white dark:bg-gray-700 rounded-full p-2">
            {/* Handshake icon: black in light, white in dark */}
            <Handshake className="w-6 h-6 text-black dark:text-white" />
          </div>
          {/* “Chatr” text: white in both modes */}
          <span className="pixel-text text-white">Chatr</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login Button: make sure Link text is white in both modes */}
          <Link to="/signin">
            <Button variant="myButton" className="bg-blue-900 dark:bg-blue-700">
              <span className="text-white">Login</span>
            </Button>
          </Link>

          {/* Register Button: adjust background/text for dark */}
          <Link to="/signup">
            <Button variant="secondary" className="py-2 font-bold bg-white dark:bg-gray-700">
              <span className="text-black dark:text-white">Register</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        {/* “Chatr” Heading: black in light, white in dark */}
        <h3 className="pixel-text text-8xl text-black dark:text-white">Chatr</h3>

        {/* Subtitle: italic, gray-800 in light, gray-300 in dark */}
        <p className="mt-2 italic text-gray-800 dark:text-gray-300 font-bold">
          A Portfolio Project
        </p>

        <p className="mt-4 italic text-gray-800 dark:text-gray-300">
          Log in or Create an account to get started
        </p>
      </div>
    </div>
  );
};

export default Home;
