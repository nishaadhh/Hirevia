import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { getAIProvider } from "@/providers/ai-provider";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const body = await req.json();
    const { messages, candidateId } = body;

    let candidateContext: any = null;
    if (candidateId) {
      const cand = await prisma.candidateProfile.findFirst({
        where: { id: candidateId, companyId },
        include: {
          mockInterviews: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (cand) {
        candidateContext = {
          id: cand.id,
          name: cand.name,
          headline: cand.headline,
          experienceYears: cand.experienceYears,
          skills: JSON.parse(cand.skills || "[]"),
          aiMatchScore: cand.aiMatchScore,
          interviewScore: cand.mockInterviews[0]?.overallScore,
          techScore: cand.mockInterviews[0]?.techScore,
          commScore: cand.mockInterviews[0]?.commScore,
        };
      }
    }

    const aiProvider = getAIProvider();
    const reply = await aiProvider.chat(messages || [], candidateContext);

    return NextResponse.json({
      reply,
      candidate: candidateContext,
    });
  } catch (err: any) {
    console.error("AI Chatbot error:", err);
    return NextResponse.json({ error: "Chat service error" }, { status: 500 });
  }
}
