'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { OTPInput } from '@/components/otp-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RESEND_COOLDOWN = 60; // 60 seconds cooldown

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting a new code.`);
      return;
    }

    setIsLoading(true);
    try {
      setCooldown(RESEND_COOLDOWN);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send authentication code');
      }
    } catch (error) {
      setError('An error occurred while sending the authentication code');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordlessLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn('credentials', {
      email,
      authCode,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/login');
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/login' });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mx-auto flex w-full max-w-xs flex-col space-y-2">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        {!isCodeSent ? (
          <form
            onSubmit={handleSendCode}
            className="mx-auto flex w-full max-w-xs flex-col space-y-2"
          >
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              size="lg"
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M2.08341 4.9987L9.44553 10.5644C9.77376 10.8125 10.2268 10.8125 10.5551 10.5644L17.9167 4.9987M2.30204 15.1501L7.91675 9.5121M12.0837 9.5121L17.673 15.1501M4.42649 16.2108H15.5737C17.0978 16.2108 18.3334 14.9752 18.3334 13.4511V6.09177C18.3334 4.56761 17.0978 3.33203 15.5737 3.33203H4.42649C2.90233 3.33203 1.66675 4.56761 1.66675 6.09177V13.4511C1.66675 14.9752 2.90233 16.2108 4.42649 16.2108Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Sign in with Email
                </>
              )}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handlePasswordlessLogin}
            className="mx-auto flex w-full max-w-xs flex-col space-y-2"
          >
            <Label htmlFor="authCode">Authentication Code</Label>
            <OTPInput length={6} onComplete={setAuthCode} disabled={isLoading} />
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            )}
            <p className="text-sm text-gray-600">
              Please check your email inbox (including spam folder) for the 6-digit authentication
              code.
            </p>
            <Button
              type="submit"
              size="lg"
              variant="outline"
              className="w-full"
              disabled={isLoading || authCode.length !== 6}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleSendCode(new Event('submit') as any)}
              disabled={cooldown > 0 || isLoading}
            >
              {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
            </Button>
          </form>
        )}

        <div className="mx-auto flex w-full max-w-xs flex-col space-y-2">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full"
            disabled={isLoading}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <g>
                <path
                  d="M23.9998 12.0886C23.9998 11.3138 23.9336 10.5718 23.8213 9.84921H12.5641V14.4389H19.0366C18.7256 15.8507 17.9051 17.0525 16.6873 17.8731L18.1776 19.0303L20.4535 20.7688C22.6958 18.7206 23.9998 15.687 23.9998 12.0886Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.5643 23.6398C15.7807 23.6398 18.474 22.5829 20.4461 20.7769L16.6805 17.8812C15.6016 18.6102 14.2053 19.0437 12.5643 19.0437C9.43416 19.0437 6.77341 16.9556 5.81398 14.132L4.1363 15.4218L1.92896 17.1193C3.88802 20.9869 7.91137 23.6398 12.5643 23.6398Z"
                  fill="#34A853"
                />
                <path
                  d="M5.81376 14.1313C5.56252 13.4022 5.42301 12.6274 5.42301 11.8197C5.42301 11.0121 5.56193 10.2373 5.81376 9.50818L4.09884 8.18906L1.92933 6.52036C1.12182 8.11574 0.651855 9.90879 0.651855 11.8191C0.651855 13.7301 1.12182 15.5226 1.92933 17.1179L5.81376 14.1313Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.5643 4.59671C14.3377 4.59671 15.9326 5.20084 17.19 6.38917V6.39562L20.5324 3.07933C18.4675 1.16897 15.7801 0 12.5643 0C7.91196 0 3.88802 2.65292 1.92896 6.52055L5.81398 9.50838C6.77341 6.68478 9.43357 4.59671 12.5643 4.59671Z"
                  fill="#EA4335"
                />
              </g>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
