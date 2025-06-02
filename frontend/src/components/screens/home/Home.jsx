import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./Home.css";

import { useTheme } from "../../../utils/contexts/theme/ThemeContext";

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div>
        {" "}
        <h1 className="text-2xl">Dashboard - {theme} mode</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 mt-4 rounded bg-gray-300 dark:bg-gray-700"
        >
          Toggle Theme
        </button>
      </div>
      <div className="pixel-text flex justify-center items-center min-h-screen text-8xl">
        Chatr
      </div>
      <Button>
        <Link to="/signin">Login</Link>
      </Button>
      <Button>
        <Link to="/signup">Register</Link>
      </Button>
    </div>
  );
};

export default Home;


//TODO Document how to create a theme context for future use