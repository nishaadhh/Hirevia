import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { getStorageProvider } from "@/providers/storage-provider";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const mockInterview = await prisma.mockInterview.findFirst({
      where: {
        id,
        candidate: { companyId },
      },
      include: {
        candidate: true,
        notes: {
          include: { author: true },
          orderBy: { timestampSeconds: "asc" },
        },
      },
    });

    if (!mockInterview) {
      return NextResponse.json({ error: "Interview review not found" }, { status: 404 });
    }

    const storage = getStorageProvider();
    const signedPlaybackUrl = await storage.createSignedUrl(mockInterview.videoUrl, 7200);

    const transcriptItems = JSON.parse(mockInterview.transcript || "[]");

    const payload = {
      id: mockInterview.id,
      candidateId: mockInterview.candidate.id,
      candidateName: mockInterview.candidate.name,
      candidateHeadline: mockInterview.candidate.headline,
      candidateLocation: mockInterview.candidate.location,
      gmeetLink: mockInterview.candidate.gmeetLink,
      status: mockInterview.status,
      overallScore: mockInterview.overallScore,
      techScore: mockInterview.techScore,
      commScore: mockInterview.commScore,
      leadershipScore: mockInterview.leadershipScore,
      problemSolvingScore: mockInterview.problemSolvingScore,
      completedAt: mockInterview.completedAt,
      playbackUrl: signedPlaybackUrl,
      durationSeconds: 1090, // 18m 10s
      transcript: transcriptItems,
      notes: mockInterview.notes.map((n) => ({
        id: n.id,
        timestampSeconds: n.timestampSeconds,
        noteText: n.noteText,
        authorName: n.author.name,
        createdAt: n.createdAt,
      })),
      timeline: [
        { id: "ev-0", timestampSeconds: 0, eventType: "STARTED", label: "Session Commenced", description: "Camera & mic integrity validated" },
        { id: "ev-1", timestampSeconds: 135, eventType: "QUESTION", label: "Tech Q1: Architecture", description: "Intro & scalable telemetry challenge" },
        { id: "ev-2", timestampSeconds: 282, eventType: "ANSWER", label: "Candidate Answer", description: "Next.js server components & PostgreSQL indexing" },
        { id: "ev-3", timestampSeconds: 430, eventType: "QUESTION", label: "Tech Q2: Performance", description: "Domain module boundaries & connection pooling" },
        { id: "ev-4", timestampSeconds: 635, eventType: "QUESTION", label: "Leadership Q3", description: "Handling technical conflict with objective benchmarks" },
        { id: "ev-5", timestampSeconds: 800, eventType: "QUESTION", label: "Client Presence Q4", description: "Explaining technical trade-offs to business stakeholders" },
        { id: "ev-6", timestampSeconds: 1090, eventType: "COMPLETED", label: "Interview Finalized", description: "AI multimodal evaluation completed: Ready for HR Review" },
        ...mockInterview.notes.map((n) => ({
          id: n.id,
          timestampSeconds: n.timestampSeconds,
          eventType: "HR_NOTE",
          label: `HR Note (${Math.floor(n.timestampSeconds / 60).toString().padStart(2, "0")}:${(n.timestampSeconds % 60).toString().padStart(2, "0")})`,
          description: n.noteText,
          authorName: n.author.name,
        })),
      ].sort((a, b) => a.timestampSeconds - b.timestampSeconds),
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("AI Interview fetch error:", err);
    return NextResponse.json({ error: "Failed to retrieve interview details" }, { status: 500 });
  }
}

// POST: Add Private HR Note
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const body = await req.json();
    const { timestampSeconds, noteText } = body;

    if (timestampSeconds === undefined || !noteText) {
      return NextResponse.json({ error: "timestampSeconds and noteText are required" }, { status: 400 });
    }

    const mockInterview = await prisma.mockInterview.findFirst({
      where: {
        id,
        candidate: { companyId },
      },
    });

    if (!mockInterview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const hrUserId = user?.id || (await prisma.user.findFirst({ where: { companyId, role: "HR" } }))?.id;

    const newNote = await prisma.interviewNote.create({
      data: {
        interviewId: id,
        timestampSeconds,
        noteText,
        authorId: hrUserId!,
      },
      include: { author: true },
    });

    const mins = Math.floor(timestampSeconds / 60);
    const secs = timestampSeconds % 60;
    const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    return NextResponse.json({
      success: true,
      note: {
        id: newNote.id,
        timestampSeconds: newNote.timestampSeconds,
        eventType: "HR_NOTE",
        label: `HR Note (${formatted})`,
        description: newNote.noteText,
        authorName: newNote.author.name,
      },
    });
  } catch (err: any) {
    console.error("Add HR Note error:", err);
    return NextResponse.json({ error: "Failed to save HR note" }, { status: 500 });
  }
}
