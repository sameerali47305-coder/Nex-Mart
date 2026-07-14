import { NextRequest, NextResponse } from "next/server";

import { verifyToken, type JwtPayload } from "@/lib/jwt";

// Reads "Authorization: Bearer <token>" and returns the decoded payload,
// or null if it's missing/invalid. Use this in any API route that needs
// to know WHO is calling, but can still run for logged-out users too.
export function getAuthUser(req: NextRequest): JwtPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}

// Wrap a route handler with this to REQUIRE a valid, logged-in user.
// Example:
//   export const GET = withAuth((req, user) => { ... });
export function withAuth(
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    const user = getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to do this" },
        { status: 401 }
      );
    }

    return handler(req, user);
  };
}

// Wrap a route handler with this to REQUIRE a logged-in admin.
export function withAdminAuth(
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse> | NextResponse
) {
  return withAuth((req, user) => {
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }
    return handler(req, user);
  });
}
