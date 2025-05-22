import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CircleX, Info, X } from "lucide-react";
import axios from "@/api/axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const NAME_REGEX = /^[a-zA-Z]+(?: [A-Za-z]+)*$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z]+$/;
const PWD_REGEX = /[a-zA-Z0-9]{8,30}$/;
const REGISTER_URL = "/user/add-user";
//TODO: make better password regex and validation

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

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

  // useEffect(() => {
  //   nameRef.current.focus();
  // }, []);

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    console.log(result);
    console.log(name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, pwd, matchPwd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //additional check in case of button hack
    const v1 = NAME_REGEX.test(name);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = axios.post(
        REGISTER_URL,
        JSON.stringify({ name, email, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSucces(true);
      //clear input fields
    } catch (error) {
      if (!error.response) {
        setErrMsg("No server response");
      } else if (error.response?.status == 409) {
        setErrMsg("UserName taken");
      } else {
        setErrMsg("Registration Failed")
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-sm p-6 shadow-lg border border-border bg-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center tracking-wide font-thin">
            Create Account
          </CardTitle>
          <CardDescription className="text-center mb-4">
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
              <Label htmlFor="name">
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
              />
              <div
                id="namenote"
                className={nameFocus && name && !validName ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded">
                  <Info /> Please enter your full name using letters and spaces
                  only.
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
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
              />
              <div
                id="emailnote"
                className={emailFocus && email && !validEmail ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded">
                  <Info /> Enter a valid email like: user@domain.com.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
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
              />
              <div
                id="pwdnote"
                className={!validPwd && pwd && pwdFocus ? "" : "hidden"}
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded">
                  <Info /> Password must be at least 8 characters and include
                  letters and numbers.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
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
              />
              <div
                id="matchpwdnote"
                className={
                  !validMatch && matchPwd && matchFocus ? "" : "hidden"
                }
              >
                <div className="flex items-center gap-2 text-xs mt-1.5 bg-accent-foreground p-4 rounded">
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
              className="w-full mt-4"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center gap-1 justify-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-white underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignUp;
//TODO make rest of the validation logic for Email and Password
