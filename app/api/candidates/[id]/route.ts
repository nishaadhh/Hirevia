import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const candidate = await prisma.candidateProfile.findFirst({
      where: { id, companyId },
      include: {
        mockInterviews: {
          include: { notes: true },
          orderBy: { createdAt: "desc" },
        },
        schedules: {
          orderBy: { scheduledAt: "desc" },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const latestInterview = candidate.mockInterviews[0];

    const payload = {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      headline: candidate.headline,
      experienceYears: candidate.experienceYears,
      skills: JSON.parse(candidate.skills || "[]"),
      resumeUrl: candidate.resumeUrl,
      verifiedSkills: JSON.parse(candidate.verifiedSkills || "[]"),
      aiInferredSkills: JSON.parse(candidate.aiInferredSkills || "[]"),
      aiMatchScore: candidate.aiMatchScore,
      status: candidate.status,
      gmeetLink: candidate.gmeetLink,
      mockInterview: latestInterview
        ? {
            id: latestInterview.id,
            status: latestInterview.status,
            overallScore: latestInterview.overallScore,
            techScore: latestInterview.techScore,
            commScore: latestInterview.commScore,
            leadershipScore: latestInterview.leadershipScore,
            problemSolvingScore: latestInterview.problemSolvingScore,
            videoUrl: latestInterview.videoUrl,
            transcript: JSON.parse(latestInterview.transcript || "[]"),
            completedAt: latestInterview.completedAt,
            notes: latestInterview.notes,
          }
        : null,
      schedules: candidate.schedules,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Fetch candidate details error:", err);
    return NextResponse.json({ error: "Failed to fetch candidate details" }, { status: 500 });
  }
}
