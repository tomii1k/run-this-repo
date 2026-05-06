"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";

export default function AuthNav() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
    };

    void loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label="RunThisRepo home"
        >
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            fill="none"
            className="rounded"
          >
            <rect width="512" height="512" rx="104" fill="url(#logo-gradient)" />
            <path d="M145 189L205 249L145 309" stroke="white" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M232 323H335" stroke="white" strokeWidth="34" strokeLinecap="round" />
            <circle cx="326" cy="165" r="25" fill="white" />
            <circle cx="326" cy="347" r="25" fill="white" />
            <circle cx="384" cy="256" r="25" fill="white" />
            <path d="M326 190V218C326 239 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
            <path d="M326 322V294C326 273 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
            <defs>
              <linearGradient id="logo-gradient" x1="48" y1="48" x2="464" y2="464" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          RunThisRepo
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-gray-700 hover:text-gray-900">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-gray-700 hover:text-gray-900">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-gray-700 hover:text-gray-900">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
