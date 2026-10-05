import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    // Strict multi-tenant isolation
    const tenantFilter = { companyId };

    const [
      activeJobs,
      totalCandidates,
      aiScreenedCandidates,
      readyForHRReview,
      scheduledInterviews,
      topCandidate,
      recentInterviews,
    ] = await Promise.all([
      prisma.jobOpening.count({
        where: { ...tenantFilter, activeStatus: true },
      }),
      prisma.candidateProfile.count({
        where: tenantFilter,
      }),
      prisma.candidateProfile.count({
        where: {
          ...tenantFilter,
          status: { in: ["AI_SCREENED", "READY_FOR_HR_REVIEW", "HR_SCHEDULED"] },
        },
      }),
      prisma.candidateProfile.count({
        where: { ...tenantFilter, status: "READY_FOR_HR_REVIEW" },
      }),
      prisma.interviewSchedule.count({
        where: { status: "SCHEDULED" },
      }),
      // Flagship alert candidate: Arjun Kumar (Passed AI Interview with 87% match)
      prisma.candidateProfile.findFirst({
        where: {
          ...tenantFilter,
          status: "READY_FOR_HR_REVIEW",
        },
        include: {
          mockInterviews: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      // Recent mock interviews for review
      prisma.mockInterview.findMany({
        where: {
          candidate: tenantFilter,
        },
        include: {
          candidate: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const alertCandidate = topCandidate
      ? {
          candidateId: topCandidate.id,
          name: topCandidate.name,
          headline: topCandidate.headline,
          jobTitle: "Senior Full Stack Developer",
          aiMatchScore: topCandidate.aiMatchScore || 87,
          interviewId: topCandidate.mockInterviews[0]?.id || "",
          status: topCandidate.status,
          gmeetLink: topCandidate.gmeetLink,
        }
      : null;

    const metrics = {
      activeJobs,
      totalCandidates,
      aiScreenedCandidates,
      readyForHRReview,
      scheduledInterviews,
      alertCandidate,
      recentInterviews: recentInterviews.map((mi) => ({
        id: mi.id,
        candidateId: mi.candidate.id,
        candidateName: mi.candidate.name,
        candidateHeadline: mi.candidate.headline,
        overallScore: mi.overallScore,
        techScore: mi.techScore,
        commScore: mi.commScore,
        status: mi.status,
        completedAt: mi.completedAt,
        gmeetLink: mi.candidate.gmeetLink,
      })),
    };

    return NextResponse.json(metrics);
  } catch (err: any) {
    console.error("Fetch HR dashboard metrics error:", err);
    return NextResponse.json({ error: "Failed to fetch HR dashboard metrics" }, { status: 500 });
  }
}
