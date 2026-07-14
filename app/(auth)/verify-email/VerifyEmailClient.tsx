"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { verifyEmailRequest } from "@/helpers/authApi";

type Status = "loading" | "success" | "error";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    token ? "Verifying your email..." : "This verification link is missing a token."
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmailRequest(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Verification failed");
      });
  }, [token]);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

      {status === "loading" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Verifying your email</h1>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Email verified successfully</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your account is now active. You can log in whenever you&apos;re ready.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Verification failed</h1>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Sign Up
          </Link>
        </>
      )}

    </div>
  );
}
