import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { getAIProvider } from "@/providers/ai-provider";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const skillParam = searchParams.get("skill") || "";
    const minExp = searchParams.get("minExp") ? parseFloat(searchParams.get("minExp")!) : 0;
    const maxExp = searchParams.get("maxExp") ? parseFloat(searchParams.get("maxExp")!) : 100;
    const locationParam = searchParams.get("location") || "";
    const minScore = searchParams.get("minScore") ? parseFloat(searchParams.get("minScore")!) : 0;
    const sortBy = searchParams.get("sortBy") || "match"; // match, exp, name

    // Parse natural language search if query is longer than simple word
    let parsedNlFilters: any = {};
    if (query.trim().length > 10) {
      const aiProvider = getAIProvider();
      parsedNlFilters = await aiProvider.parseNaturalLanguageFilter(query);
    }

    // Build database WHERE filter strictly scoped to companyId
    const whereClause: any = {
      companyId,
      experienceYears: {
        gte: parsedNlFilters.minExp || minExp,
        lte: maxExp,
      },
    };

    if (minScore > 0) {
      whereClause.aiMatchScore = { gte: minScore };
    }

    if (locationParam) {
      whereClause.location = { contains: locationParam };
    } else if (parsedNlFilters.location) {
      whereClause.location = { contains: parsedNlFilters.location };
    }

    // Smart Database Sorting
    let orderBy: any = [{ aiMatchScore: "desc" }, { experienceYears: "desc" }];
    if (sortBy === "exp") {
      orderBy = [{ experienceYears: "desc" }];
    } else if (sortBy === "name") {
      orderBy = [{ name: "asc" }];
    }

    const candidates = await prisma.candidateProfile.findMany({
      where: whereClause,
      include: {
        mockInterviews: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        schedules: {
          where: { status: "SCHEDULED" },
          orderBy: { scheduledAt: "asc" },
          take: 1,
        },
      },
      orderBy,
    });

    // Parse JSON fields and apply keyword/skill matching
    const formatted = candidates.map((c) => {
      const skillsArray: string[] = JSON.parse(c.skills || "[]");
      const verifiedArray: string[] = JSON.parse(c.verifiedSkills || "[]");
      const aiInferredArray: string[] = JSON.parse(c.aiInferredSkills || "[]");
      const latestInterview = c.mockInterviews[0];
      const activeSchedule = c.schedules[0];

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        location: c.location,
        headline: c.headline,
        experienceYears: c.experienceYears,
        skills: skillsArray,
        verifiedSkills: verifiedArray,
        aiInferredSkills: aiInferredArray,
        aiMatchScore: c.aiMatchScore,
        status: c.status,
        gmeetLink: c.gmeetLink || activeSchedule?.gmeetLink || null,
        scheduledAt: activeSchedule?.scheduledAt || null,
        mockInterview: latestInterview
          ? {
              id: latestInterview.id,
              status: latestInterview.status,
              overallScore: latestInterview.overallScore,
              techScore: latestInterview.techScore,
              commScore: latestInterview.commScore,
              completedAt: latestInterview.completedAt,
            }
          : null,
      };
    });

    // Filter by skills or query terms if provided
    const filtered = formatted.filter((c) => {
      if (skillParam) {
        const hasSkill = c.skills.some((s) => s.toLowerCase().includes(skillParam.toLowerCase()));
        if (!hasSkill) return false;
      }

      if (parsedNlFilters.skills && parsedNlFilters.skills.length > 0) {
        const matchesAnyNlSkill = parsedNlFilters.skills.some((reqSk: string) =>
          c.skills.some((s) => s.toLowerCase().includes(reqSk.toLowerCase()))
        );
        if (!matchesAnyNlSkill) return false;
      }

      if (query && query.trim().length <= 10) {
        const qLower = query.toLowerCase();
        const text = `${c.name} ${c.headline} ${c.location} ${c.skills.join(" ")}`.toLowerCase();
        if (!text.includes(qLower)) return false;
      }

      return true;
    });

    return NextResponse.json({ candidates: filtered, total: filtered.length });
  } catch (err: any) {
    console.error("Search candidates error:", err);
    return NextResponse.json({ error: "Failed to search candidates" }, { status: 500 });
  }
}
