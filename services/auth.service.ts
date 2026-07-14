import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/sendEmail";
import type { RegisterInput, LoginInput } from "@/validations/auth";

// A small typed error so controllers know which HTTP status to send back.
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function registerUser({ name, email, password }: RegisterInput) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AuthError("An account with this email already exists", 409);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  const user = await User.create({
    name,
    email,
    password, // hashed automatically by the User model's pre-save hook
    verificationToken,
    verificationTokenExpiry,
  });

  // Don't let a slow/broken mailbox provider fail the whole signup request.
  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
  }

  return { id: user._id.toString(), name: user.name, email: user.email };
}

export async function verifyEmailToken(token: string) {
  if (!token) {
    throw new AuthError("Verification token is required", 400);
  }

  await connectDB();

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: new Date() },
  }).select("+verificationToken +verificationTokenExpiry");

  if (!user) {
    throw new AuthError("This verification link is invalid or has expired", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return { email: user.email };
}

export async function loginUser({ email, password }: LoginInput) {
  await connectDB();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AuthError(
      "Please verify your email before logging in. Check your inbox for the verification link.",
      403
    );
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
