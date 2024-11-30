'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export function OTPInput({ length, onComplete, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (isNaN(Number(pastedData[i]))) continue;
      newOtp[i] = pastedData[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = pastedData[i];
      }
    }

    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    } else {
      const lastFilledIndex = newOtp.findIndex((digit) => digit === '');
      if (lastFilledIndex !== -1 && inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex]?.focus();
      }
    }
  };

  return (
    <div className="flex justify-center space-x-2" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="size-12 text-center text-2xl"
          aria-label={`Digit ${index + 1}`}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
