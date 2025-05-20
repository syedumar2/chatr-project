import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CircleX, Info } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState,useEffect } from "react";

const NAME_REGEX = /^[a-zA-Z]+(?:[A-Za-z]+)*$/;
const EMAIL_REGEX = /[a-zA-Z0-9.-%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /[a-zA-Z0-9]+$/;
//TODO: make better password regex and validation

const SignUp = () => {
  




  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
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
          <div className="space-y-2">
            <Label htmlFor="username">Full Name</Label>
            <Input id="username" type="text" placeholder="Your username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>
          <Button variant="myButton" className="w-full mt-4">
            Sign Up
          </Button>
        </CardContent>
        <CardFooter className="flex items-center gap-1 justify-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-white underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
