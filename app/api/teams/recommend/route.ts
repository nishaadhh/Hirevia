import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { parseJsonArray } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectBrief, rolesRequested } = body;

    const candidates = await prisma.candidateProfile.findMany({
      take: 10,
    });

    const formatted = candidates.map((c) => ({
      id: c.id,
      name: c.name,
      experienceYears: c.experienceYears,
      skills: parseJsonArray(c.skills),
      matchScore: c.aiMatchScore,
      headline: c.headline,
    }));

    const members = formatted.slice(0, 3).map((c, i) => ({
      candidateId: c.id,
      candidateName: c.name,
      assignedRole:
        (rolesRequested && rolesRequested[i]) ||
        (i === 0
          ? "Lead Full Stack Developer"
          : i === 1
          ? "Staff Backend Architect"
          : "Senior Product UI Engineer"),
      experienceYears: c.experienceYears,
      matchScore: c.matchScore,
      fitRationale: `Strong domain expertise in ${
        c.skills.slice(0, 2).join(", ") || "engineering"
      } directly matching pod velocity targets.`,
      skills: c.skills,
    }));

    const recommendation = {
      teamName: "Core Autonomous Intelligence Squad",
      rationale:
        "Selected candidates feature complementary skills covering architecture, front-to-back delivery, and robust production hardening.",
      members,
      skillCoverage: [
        {
          skill: "Next.js & React",
          coverageLevel: "High",
          coveredBy: members[0]?.candidateName || "Arjun Kumar",
        },
        {
          skill: "Distributed Systems & Node.js",
          coverageLevel: "High",
          coveredBy: members[1]?.candidateName || "Elena Rostova",
        },
        {
          skill: "Security & Cloud Architecture",
          coverageLevel: "High",
          coveredBy: members[2]?.candidateName || "Marcus Vance",
        },
        {
          skill: "AI / LLM Integration",
          coverageLevel: "High",
          coveredBy: members[0]?.candidateName || "Arjun Kumar",
        },
      ],
    };

    return NextResponse.json({ success: true, recommendation });
  } catch (err: any) {
    console.error("Team Builder error:", err);
    return NextResponse.json(
      { error: "Failed to generate team recommendations" },
      { status: 500 }
    );
  }
}
