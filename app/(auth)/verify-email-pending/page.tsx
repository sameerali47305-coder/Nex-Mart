import Link from "next/link";
import { MailCheck } from "lucide-react";

import Container from "@/components/ui/Container";

export default function VerifyEmailPendingPage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center bg-gray-50 py-12">
      <Container>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MailCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>

          <p className="mt-3 text-sm text-gray-500">
            We&apos;ve sent a verification link to your email address. Click that
            link to activate your NexMart account.
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Didn&apos;t get it? Check your spam folder, or make sure you typed
            your email correctly during signup.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Login
          </Link>

        </div>
      </Container>
    </section>
  );
}
