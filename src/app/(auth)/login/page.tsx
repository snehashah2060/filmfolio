"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { signInAction } from "@/lib/actions/auth";
import { Film, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await signInAction(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        toast.error(res.error);
      } else {
        toast.success("Welcome back to Filmfolio");
        router.push("/dashboard");
      }
    } catch {
      // signInAction may redirect which throws an expected NEXT_REDIRECT error
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Logo size="lg" href="/" className="justify-center mb-6" />
        <h2 className="font-serif text-3xl font-bold tracking-tight text-cinema-text">
          Sign In to Your Journal
        </h2>
        <p className="mt-2 text-sm text-cinema-muted">
          Access your personal library, watchlists, and cinema diary.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-obsidian-card py-8 px-6 shadow-cinematic rounded-2xl border border-obsidian-border sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-cinema-red/10 border border-cinema-red/30 flex items-center gap-2.5 text-xs text-cinema-red">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-subtle">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue="alex@filmfolio.io"
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-cinema-muted">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold hover:text-gold-secondary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-subtle">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  defaultValue="cinemapassword123"
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gold text-obsidian font-bold text-sm hover:bg-gold-secondary transition-all shadow-gold-sm flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Filmfolio"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-5 border-t border-obsidian-border text-xs text-cinema-subtle text-center space-y-1">
            <p className="font-semibold text-cinema-muted">Demo Credentials Pre-filled</p>
            <p>Admin: alex@filmfolio.io | User: elena@filmfolio.io</p>
          </div>

          <div className="mt-6 text-center text-xs text-cinema-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
