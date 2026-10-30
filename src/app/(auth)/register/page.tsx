"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { signUpAction } from "@/lib/actions/auth";
import { Lock, Mail, User, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await signUpAction(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        toast.error(res.error);
      } else {
        toast.success("Account created successfully! Welcome to Filmfolio.");
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Logo size="lg" href="/" className="justify-center mb-6" />
        <h2 className="font-serif text-3xl font-bold tracking-tight text-cinema-text">
          Create Your Filmfolio
        </h2>
        <p className="mt-2 text-sm text-cinema-muted">
          Your Cinema. Your Collection. Your Story.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-subtle">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. cinema_enthusiast"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-subtle">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

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
                  placeholder="maya@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-subtle">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-secondary/70 border border-obsidian-border flex items-center gap-2 text-xs text-cinema-muted">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Independent account with personal library encryption & isolation.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gold text-obsidian font-bold text-sm hover:bg-gold-secondary transition-all shadow-gold-sm flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-cinema-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-gold font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
