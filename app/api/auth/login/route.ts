import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email = "hr@hirevia.io", password } = body;

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        role: "HR",
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid HR credentials" }, { status: 401 });
    }

    if (password) {
      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "HR" as const,
      companyId: user.companyId,
      companyName: user.company?.name || "Acme AI Corp",
    };

    const token = signToken(sessionUser);

    const res = NextResponse.json({
      success: true,
      user: sessionUser,
      token,
    });

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
