import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Moon, Sun, Info, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/contexts/theme/ThemeContext";
import AuthContext from "../../../utils/contexts/auth/AuthContext";

const NAME_REGEX = /^[a-zA-Z]+(?: [A-Za-z]+)*$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z]+$/;
const PWD_REGEX = /[a-zA-Z0-9]{8,30}$/;

//TODO: make better password regex and validation

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = NAME_REGEX.test(name);

    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);

    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //additional check in case of button hack
    const v1 = NAME_REGEX.test(name);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    const res = await register(name, email, pwd);

    if (res.success) {
      alert("Register successfull. You can now Log in");
      navigate("/signin");
      setSucces(true);
    } else {
      setErrMsg(res.message);
      errRef.current?.focus();
    }
  };
  const { theme, toggleTheme } = useTheme();
  //UPDATE SIGN UP TESTING COMPLETE
  //WORKING AS EXPECTED

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-blue-300 dark:bg-gray-800">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full  bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-colors "
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <Card className="w-full max-w-sm p-6 shadow-lg border border-border  bg-white dark:bg-gray-700 text-black dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center tracking-wide font-thin">
            Create Account
          </CardTitle>
          <CardDescription className="text-center mb-4  text-gray-600 dark:text-gray-300">
            Sign up to start chatting!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 ">
              <Label htmlFor="name" className="dark:text-gray-200">
                Full Name:
                <span className={validName && name ? "" : "hidden"}>
                  <Check className="size-5" />
                </span>
                <span className={validName || !name ? "hidden" : ""}>
                  <X className="size-5" />
                </span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                ref={nameRef}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                aria-invalid={validName || !name ? "false" : "true"}
                aria-describedby="namenote"
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
              <div
                id="namenote"
                className={nameFocus && name && !validName ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded text-white dark:text-black">
                  <Info /> Please enter your full name using letters and spaces
                  only.
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">
                Email
                <span className={validEmail && email ? "" : "hidden"}>
                  <Check className="size-5" />
                </span>
                <span className={validEmail || !email ? "hidden" : ""}>
                  <X className="size-5" />
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validEmail || !email ? "false" : "true"}
                aria-description="emailnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
              <div
                id="emailnote"
                className={emailFocus && email && !validEmail ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded text-white dark:text-black">
                  <Info /> Enter a valid email like: user@domain.com.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">
                Password
                <span className={validPwd && pwd ? "" : "hidden"}>
                  <Check className="size-5" />
                </span>
                <span className={validPwd || !pwd ? "hidden" : ""}>
                  <X className="size-5" />
                </span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="off"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd || !pwd ? "false" : "true"}
                aria-description="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
              <div
                id="pwdnote"
                className={!validPwd && pwd && pwdFocus ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded text-white dark:text-black">
                  <Info /> Password must be at least 8 characters and include
                  letters and numbers.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">
                Confirm Password
                <span className={validMatch && matchPwd ? "" : "hidden"}>
                  <Check className="size-5" />
                </span>
                <span className={validMatch || !matchPwd ? "hidden" : ""}>
                  <X className="size-5" />
                </span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validMatch || !matchPwd ? "false" : "true"}
                aria-description="matchpwdnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 "
              />
              <div
                id="matchpwdnote"
                className={
                  !validMatch && matchPwd && matchFocus ? "" : "hidden"
                }
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded text-white dark:text-black">
                  <Info /> Password does not match.
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                !validEmail || !validMatch || !validName || !validPwd
                  ? true
                  : false
              }
              variant="myButton"
              className="w-full mt-4  bg-blue-600 dark:bg-blue-500 text-white"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center gap-1 justify-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignUp;
//TODO make rest of the validation logic for Email and Password
