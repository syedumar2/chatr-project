import { Button } from "@/components/ui/button";
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
import api from "../../../utils/axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//TODO refactor sign in component

const SignIn = () => {

  const emailRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();


  const [email, setEmail] = useState("");


  const [pwd, setPwd] = useState("");
  

  const [errMsg, setErrMsg] = useState("");
  const [succes, setSucces] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pwd) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const res = await api.post("/login", { email, pwd });

      if (res.data.success) {
        alert("Login successfull");
        console.log("Access token recieved: ", res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        console.log("Welcome ", res.data.data.email);
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
      console.log(res.data);
      setSucces(true);
      // clear input fields
    } catch (error) {
      if (!error.response) {
        setErrMsg("No server response");
      } else if (error.response?.status == 401) {
        setErrMsg("Invalid Email or Password");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-sm p-6 shadow-lg border border-border bg-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center tracking-wide font-thin">
            Log in
          </CardTitle>
          <CardDescription className="text-center mb-4">
            Sign in to start chatting!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                required
          
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPwd(e.target.value)}
                required
           
              />
            </div>

            <Button
              type="submit"
              //disabled update later
              variant="myButton"
              className="w-full mt-4"
            >
              Log in
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center gap-1 justify-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-white underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignIn;
