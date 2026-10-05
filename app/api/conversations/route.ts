import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    const candidates = await prisma.candidateProfile.findMany({
      where: companyId ? { companyId } : undefined,
      take: 10,
    });

    const formatted = candidates.map((cand) => ({
      id: `conv-${cand.id}`,
      companyId: cand.companyId,
      candidateId: cand.id,
      candidateName: cand.name,
      candidateHeadline: cand.headline,
      candidateAvatar:
        cand.name === "Arjun Kumar"
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : cand.name === "Elena Rostova"
          ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      subject: `Interview Logistics - ${cand.headline}`,
      lastMessage: "Looking forward to speaking with the Hirevia HR team.",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (err: any) {
    console.error("Fetch conversations error:", err);
    return NextResponse.json({ conversations: [] });
  }
}
