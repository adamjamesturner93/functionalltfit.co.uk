import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/api/:path*"],
  runtime: "experimental-edge",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't require authentication for auth endpoints
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if the request is for an API route
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Invalid Authorization header");
      return new NextResponse(
        JSON.stringify({ error: "Invalid Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Manually create a session object based on the decoded token
      const session = {
        user: {
          id: payload.userId as string,
          role: payload.role as string,
        },
        expires: new Date(payload.exp! * 1000).toISOString(),
      };

      // Create a new response
      const response = NextResponse.next();

      // Attach the session to the response
      response.headers.set("X-Session", JSON.stringify(session));

      return response;
    } catch (error) {
      console.error("Token verification failed:", error);
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}
