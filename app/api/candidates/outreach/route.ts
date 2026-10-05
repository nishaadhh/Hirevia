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
    const { candidateProfileId, platform = "LINKEDIN" } = body;

    const candidate = await prisma.candidateProfile.findFirst({
      where: { id: candidateProfileId, companyId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const defaultJob = await prisma.jobOpening.findFirst({
      where: { companyId, activeStatus: true },
    });

    const aiProvider = getAIProvider();
    const candidateSkills = JSON.parse(candidate.skills || "[]");

    const message = await aiProvider.generateOutreachMessage(
      {
        name: candidate.name,
        headline: candidate.headline,
        skills: candidateSkills,
      },
      defaultJob || { title: "Senior Full Stack Developer" },
      platform
    );

    const linkedInSearchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(candidate.name)}`;

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        headline: candidate.headline,
      },
      personalizedMessage: message,
      linkedInSearchUrl,
    });
  } catch (err: any) {
    console.error("Generate outreach error:", err);
    return NextResponse.json({ error: "Failed to generate outreach message" }, { status: 500 });
  }
}
