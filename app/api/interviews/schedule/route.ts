import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateGoogleMeetLink } from "@/lib/google-meet";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      candidateProfileId,
      scheduledStartTime,
      durationMinutes = 45,
      notes = "HR Culture & Executive Vision Round",
    } = body;

    if (!candidateProfileId || !scheduledStartTime) {
      return NextResponse.json({ error: "candidateProfileId and scheduledStartTime are required" }, { status: 400 });
    }

    const candidate = await prisma.candidateProfile.findFirst({
      where: { id: candidateProfileId, companyId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found in company database" }, { status: 404 });
    }

    const startTime = new Date(scheduledStartTime);

    // Call Google Meet API Service
    const meetResult = await generateGoogleMeetLink({
      summary: `${candidate.name} - Senior Full Stack Developer`,
      description: notes,
      startTime,
      durationMinutes,
      attendeeEmail: candidate.email,
    });

    const hrUserId = user?.id || (await prisma.user.findFirst({ where: { companyId, role: "HR" } }))?.id;

    // Save schedule in database
    const schedule = await prisma.interviewSchedule.create({
      data: {
        candidateId: candidate.id,
        hrUserId: hrUserId!,
        scheduledAt: startTime,
        durationMinutes,
        gmeetLink: meetResult.meetLink,
        status: "SCHEDULED",
        notes,
      },
    });

    // Update candidate profile with Google Meet link and status
    await prisma.candidateProfile.update({
      where: { id: candidate.id },
      data: {
        gmeetLink: meetResult.meetLink,
        status: "HR_SCHEDULED",
      },
    });

    return NextResponse.json({
      success: true,
      schedule: {
        id: schedule.id,
        candidateName: candidate.name,
        candidateHeadline: candidate.headline,
        scheduledAt: schedule.scheduledAt,
        durationMinutes: schedule.durationMinutes,
        gmeetLink: schedule.gmeetLink,
        status: schedule.status,
      },
      source: meetResult.source,
    });
  } catch (err: any) {
    console.error("Schedule HR Round error:", err);
    return NextResponse.json({ error: "Failed to schedule HR round with Google Meet" }, { status: 500 });
  }
}
