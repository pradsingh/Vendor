import { HomeButton } from "@/components/home-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";


export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would connect to your backend to register the user
      console.log("Signup values:", { email, password });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials."
      });

      // Redirect to home page
      setLocation("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-8">
      <HomeButton />
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <img
            src="/assets/Xinacle_Logo.jpg"
            alt="Xinacle Logo"
            className="h-16 object-contain"
          />
        </div>
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sign Up
            </h1>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email" className="border-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="Enter your password" className="border-2" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link href="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}