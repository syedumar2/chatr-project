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

const SignIn = () => {
  return (
     <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-sm p-6 shadow-lg border border-border bg-gray-700 text-white ">
        <CardContent className="space-y-4 ">
          <div className="text-2xl text-center tracking-wide font-thin ">Login</div>
          <div className="space-y-2 ">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button variant="myButton" className="w-full mt-4">Sign In</Button>
        </CardContent>
        <CardFooter  className="flex items-center gap-1 justify-center text-sm text-gray-400 mr-1">
        Already have an account?{" "}
          <Link to="/signup" className="text-white underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>

  );
};

export default SignIn;
