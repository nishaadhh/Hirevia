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
    const { candidateId } = body;

    let candidate = null;
    if (candidateId) {
      candidate = await prisma.candidateProfile.findFirst({
        where: { id: candidateId, companyId },
        include: {
          mockInterviews: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    } else {
      // Pick top candidate (Arjun Kumar)
      candidate = await prisma.candidateProfile.findFirst({
        where: { companyId, status: "READY_FOR_HR_REVIEW" },
        include: {
          mockInterviews: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const aiProvider = getAIProvider();
    const parsedSkills = JSON.parse(candidate.skills || "[]");

    const analysis = await aiProvider.analyzeCandidateForHRAdvisor({
      id: candidate.id,
      name: candidate.name,
      headline: candidate.headline,
      experienceYears: candidate.experienceYears,
      skills: parsedSkills,
      aiMatchScore: candidate.aiMatchScore,
      mockInterview: candidate.mockInterviews[0],
    });

    return NextResponse.json({ success: true, analysis });
  } catch (err: any) {
    console.error("HR Advisor analysis error:", err);
    return NextResponse.json({ error: "Failed to generate HR advisor analysis" }, { status: 500 });
  }
}
