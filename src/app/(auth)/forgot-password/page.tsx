"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Password reset instructions sent");
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Logo size="lg" href="/" className="justify-center mb-6" />
        <h2 className="font-serif text-3xl font-bold tracking-tight text-cinema-text">
          Password Recovery
        </h2>
        <p className="mt-2 text-sm text-cinema-muted">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-obsidian-card py-8 px-6 shadow-cinematic rounded-2xl border border-obsidian-border sm:px-10">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto border border-gold/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cinema-text">
                Check Your Inbox
              </h3>
              <p className="text-xs text-cinema-muted leading-relaxed">
                If an account exists for <span className="text-gold font-medium">{email}</span>,
                you will receive a link to reset your password shortly.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-gold-secondary mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gold text-obsidian font-bold text-sm hover:bg-gold-secondary transition-all shadow-gold-sm flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-cinema-muted hover:text-cinema-text"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
