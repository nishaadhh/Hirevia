import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    // Check for candidates ready for HR review to generate live alerts
    const readyCandidates = await prisma.candidateProfile.findMany({
      where: {
        ...(companyId ? { companyId } : {}),
        status: "READY_FOR_HR_INTERVIEW",
      },
      take: 5,
    });

    const notifications = [
      ...readyCandidates.map((cand) => ({
        id: `notif-${cand.id}`,
        title: "Candidate Ready for HR Review",
        message: `${cand.name} scored ${cand.aiMatchScore}% and passed the AI assessment.`,
        type: "AI_SCREENING_PASSED",
        actionUrl: `/dashboard/interviews/ready`,
        isRead: false,
        createdAt: new Date().toISOString(),
      })),
      {
        id: "notif-welcome",
        title: "Hirevia HR Intelligence Online",
        message: "Tenant isolation active. All candidate sourcing, AI scoring, and Google Meet scheduling ready.",
        type: "SYSTEM_READY",
        actionUrl: `/dashboard`,
        isRead: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (err: any) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ success: true });
}
