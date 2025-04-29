"use client";

import Image from "next/image";
import React, { useState } from "react";

import { TextFormItem } from "@/components/form-fields/text";

import { useActionDialogs } from "@/features/ui/action-dialogs";
import { FlipCard } from "@/features/ui/flip-card";
import { Button } from "@/shared/ui";

const domainIconUrl =
  "https://dev-cabinet-twinfaces.worknroll.pro/_next/image?url=%2Ffavicon.png&w=128&q=75";

function Logo() {
  return (
    <Image
      className="absolute -top-7 left-1/2 z-10 h-14 w-14 -translate-x-1/2 transform rounded-full shadow-md"
      src={domainIconUrl}
      width={56}
      height={56}
      alt="Domain icon"
    />
  );
}

export function AuthForm() {
  const { alert } = useActionDialogs();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  function toggleMode() {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  }

  function onForgotPasswordClick(e: React.MouseEvent) {
    e.preventDefault();
    alert({
      title: "Forgot your password?",
      message:
        "No worries! To change your password, please contact your administrator at contact@onshelves.eu — they'll be happy to help you reset it and provide a new one.",
    });
  }

  return (
    <FlipCard
      isFlipped={mode === "signup"}
      className="relative w-full max-w-md"
      front={
        <div className="flex h-full flex-col items-center gap-4 space-y-6 rounded-lg p-8">
          <Logo />
          <form className="flex w-full flex-col space-y-4">
            <h2 className="text-center text-2xl font-bold text-primary">
              Sign In
            </h2>

            <TextFormItem
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              // autoComplete
            />
            <TextFormItem
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
            />

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>

            <div className="flex justify-between text-sm text-muted-foreground">
              <button
                onClick={onForgotPasswordClick}
                className="text-muted-foreground hover:underline"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={toggleMode}
                className="text-muted-foreground hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      }
      back={
        <div className="flex h-full items-center space-y-6 rounded-lg p-8">
          <Logo />
          <form className="flex w-full flex-col space-y-4">
            <h2 className="text-center text-2xl font-bold text-primary">
              Sign Up
            </h2>

            <TextFormItem
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />
            <TextFormItem
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
            />
            <TextFormItem
              type="password"
              label="Password"
              placeholder="Create a password"
              required
            />
            <TextFormItem
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              required
            />

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>

            <div className="flex justify-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={toggleMode}
                className="text-muted-foreground hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
}
