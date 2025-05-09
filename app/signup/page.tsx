"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Eye, EyeOff } from "lucide-react";
import CustomCursor from "@/components/custom_ui/CustomCursor";
import ClickSpark from "@/components/ReactBits/ClickSpark";
import Switch from "@/components/custom_ui/Switch";
import { useTheme } from "next-themes";
import TurnstileWidget from "@/components/TurnstileWidget";
import PasswordCaret from "@/components/custom_ui/PasswordCaret";

const MIN_PASSWORD_LENGTH = 8;

const validatePassword = (password: string) => {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export default function SignupPage() {
  // All hooks must be declared at the top, before any conditional returns
  const [showContent, setShowContent] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Security question state
  const securityQuestions = [
    "What is your favorite color?",
    "What is your favorite animal?",
    "What is the name of your first pet?",
    "What city were you born in?",
    "What is your favorite food?"
  ];
  const [selectedQuestion, setSelectedQuestion] = useState(securityQuestions[0]);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!showContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            src="/spinner-double.svg"
            alt="Loading Spinner"
            width={64}
            height={64}
            className="animate-spin-slow drop-shadow-lg"
            priority
          />
          <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-200 tracking-tight select-none">
            Loading, please wait...
          </span>
        </div>
      </div>
    );
  }

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible((prev) => !prev);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name.");
      return;
    }
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the terms.");
      return;
    }
    if (!captchaToken) {
      toast.error("Please complete the captcha.");
      return;
    }
    try {
      const res = await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          securityQuestion: selectedQuestion,
          securityAnswer
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };


  if (!mounted) return null;

  return (
    <>
      <CustomCursor />
      <ClickSpark />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-3 z-30">
          <Switch />
        </div>
        <div className="relative w-[98vw] max-w-xs sm:max-w-sm md:max-w-md rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_0_30px_rgba(99,102,241,0.4)] dark:shadow-[0_0_30px_rgba(99,102,241,0.3)] p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
            Sign Up
          </h1>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="username"
                required
              />
            </div>
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-transparent"
                
                autoComplete="current-password"
                required
              />
              
              {!passwordVisible && (
                <PasswordCaret
                  caretIndex={passwordInputRef.current?.selectionStart ?? password.length}
                  fillPercent={Math.min(password.length, MIN_PASSWORD_LENGTH) / MIN_PASSWORD_LENGTH}
                  minLength={MIN_PASSWORD_LENGTH}
                />
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={passwordVisible ? "Hide Password" : "Show Password"}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validatePassword(password) && (
                <Check className="absolute right-24 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
            <div className="relative">
              <input
                ref={confirmPasswordInputRef}
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-transparent"
                
                required
              />
              
              {!confirmPasswordVisible && (
                <PasswordCaret
                  caretIndex={confirmPasswordInputRef.current?.selectionStart ?? confirmPassword.length}
                  fillPercent={Math.min(confirmPassword.length, MIN_PASSWORD_LENGTH) / MIN_PASSWORD_LENGTH}
                  minLength={MIN_PASSWORD_LENGTH}
                />
              )}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={confirmPasswordVisible ? "Hide Password" : "Show Password"}
              >
                {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {password && confirmPassword && password === confirmPassword && (
                <Check className="absolute right-24 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
            {/* Security Question Section */}
            <div className="flex flex-col gap-2">
              <label htmlFor="security-question" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Security Question</label>
              <select
                id="security-question"
                value={selectedQuestion}
                onChange={e => setSelectedQuestion(e.target.value)}
                className="w-full px-4 py-3 pr-12 mt-2 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {securityQuestions.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your Answer"
                value={securityAnswer}
                onChange={e => setSecurityAnswer(e.target.value)}
                className="w-full px-4 py-3 pr-12 mt-2 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-400">
            <div className="inline-flex items-center">
                <label className="flex items-center cursor-pointer relative" htmlFor="agreeTerms">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-500 checked:bg-indigo-600 checked:border-indigo-600"
                    id="agreeTerms"
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor="agreeTerms">
                  I agree to the terms & conditions
                </label>
              </div>
            </div>
            <div className="flex justify-center my-2">
              <TurnstileWidget
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                theme={theme === 'dark' ? 'dark' : 'light'}
                onVerify={setCaptchaToken}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold overflow-hidden relative mt-2"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account? {" "}
            <a href="/login" className="text-indigo-600 hover:underline cursor-pointer">Login</a>
          </div>
        </div>
      </main>
    </>
  );
}
