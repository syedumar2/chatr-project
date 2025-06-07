import { Button } from "@/components/ui/button";
import { toast, Toaster } from 'sonner';



import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../utils/contexts/auth/AuthContext";
import { useTheme } from "../../../utils/contexts/theme/ThemeContext";
import { Moon, Sun } from "lucide-react";


const SignIn = () => {
  const emailRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading,setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!email || !pwd) {
    setErrMsg("Invalid Entry");
    setLoading(false); // Ensure loading is reset
    return;
  }

  try {
    
    const res = await login(email, pwd);

    if (res.success) {
      toast.success("Signed in successfully");
      setTimeout(() => navigate("/dashboard"), 500);

    } else {

      toast.error(res.message);
      setErrMsg(res.message);
      errRef.current?.focus();
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again.");
    setErrMsg("An unexpected error occurred.");
    errRef.current?.focus();
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-blue-300 dark:bg-gray-800">
      {/* Dark Mode Toggle - top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-colors"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Card className="w-full max-w-sm p-6 shadow-lg border border-border bg-white dark:bg-gray-700 text-black dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center tracking-wide font-thin">
            Log in
          </CardTitle>
          <CardDescription className="text-center mb-4 text-gray-600 dark:text-gray-300">
            Sign in to start chatting!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p
            ref={errRef}
            className={errMsg ? "text-red-500 text-sm mb-2" : "hidden"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPwd(e.target.value)}
                required
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>

            <Button
              type="submit"
              variant="myButton"
              disabled={!email || !pwd || loading ? true : false}
              className="w-full mt-4 bg-blue-600 dark:bg-blue-500 text-white"
            >
              Log in
            </Button>
              <Toaster position="top-center" />
          </form>
        </CardContent>

        <CardFooter className="flex items-center gap-1 justify-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignIn;
