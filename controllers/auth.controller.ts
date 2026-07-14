import { NextRequest, NextResponse } from "next/server";

import { registerSchema, loginSchema } from "@/validations/auth";
import {
  registerUser,
  verifyEmailToken,
  loginUser,
  AuthError,
} from "@/services/auth.service";

// Controllers only: read the request, validate it, call the service,
// and shape the HTTP response. No business logic lives here.

export async function registerController(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const user = await registerUser(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Please check your email to verify your account.",
        data: { user },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAuthError(error, "Registration failed. Please try again.");
  }
}

export async function verifyEmailController(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";

    const result = await verifyEmailToken(token);

    return NextResponse.json(
      { success: true, message: "Email verified successfully.", data: result },
      { status: 200 }
    );
  } catch (error) {
    return handleAuthError(error, "Email verification failed.");
  }
}

export async function loginController(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, user } = await loginUser(parsed.data);

    return NextResponse.json(
      { success: true, message: "Login successful.", data: { token, user } },
      { status: 200 }
    );
  } catch (error) {
    return handleAuthError(error, "Login failed. Please try again.");
  }
}

function handleAuthError(error: unknown, fallbackMessage: string) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { success: false, message: fallbackMessage },
    { status: 500 }
  );
}
