"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendCode = async () => {
    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send authentication code");
      }
    } catch (error) {
      setError("An error occurred while sending the authentication code");
      console.error(error);
    }
  };

  const handlePasswordlessLogin = async () => {
    const result = await signIn("credentials", {
      email,
      authCode,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      {" "}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isCodeSent ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSendCode} className="w-full">
                Send Authentication Code
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="authCode">Authentication Code</Label>
              <Input
                id="authCode"
                type="text"
                placeholder="Enter the 6-digit code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <Button onClick={handlePasswordlessLogin} className="w-full">
                Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
