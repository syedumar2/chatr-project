import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./Home.css";
import { Handshake, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../utils/contexts/theme/ThemeContext";

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-blue-300 dark:bg-gray-800 dark:text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6 md:px-12 lg:px-24 bg-blue-900 dark:bg-gray-900">
        <div className="flex items-center gap-4 text-xl">
          <div className="bg-white dark:bg-gray-700 rounded-full p-2">
            <Handshake className="w-6 h-6 text-black dark:text-white" />
          </div>
          <span className="pixel-text text-white">Chatr</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login Button */}
          <Link to="/signin">
            <Button
              variant="myButton"
              className="bg-blue-900 dark:bg-blue-700 w-full sm:w-auto"
            >
              <span className="text-white">Login</span>
            </Button>
          </Link>

          {/* Register Button */}
          <Link to="/signup">
            <Button
              variant="secondary"
              className="py-2 font-bold bg-white dark:bg-gray-700 w-full sm:w-auto"
            >
              <span className="text-black dark:text-white">Register</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px)] px-4 text-center">
        <h3 className="pixel-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black dark:text-white">
          Chatr
        </h3>

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
