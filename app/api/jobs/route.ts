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

    const jobs = await prisma.jobOpening.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    const formatted = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      minExp: j.minExp,
      salaryRange: j.salaryRange,
      description: j.description,
      activeStatus: j.activeStatus,
      requiredSkills: JSON.parse(j.requiredSkills || "[]"),
      preferredSkills: JSON.parse(j.preferredSkills || "[]"),
      createdAt: j.createdAt,
    }));

    return NextResponse.json({ jobs: formatted });
  } catch (err: any) {
    console.error("Fetch jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const companyId = user?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Tenant context required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      department = "Core Engineering",
      minExp = 3,
      requiredSkills = [],
      preferredSkills = [],
      salaryRange = "$150,000 - $180,000",
      description = "",
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const newJob = await prisma.jobOpening.create({
      data: {
        companyId,
        title,
        department,
        minExp: Number(minExp),
        requiredSkills: JSON.stringify(requiredSkills),
        preferredSkills: JSON.stringify(preferredSkills),
        salaryRange,
        description: description || `Role opening for ${title} at Acme AI Corp.`,
        activeStatus: true,
      },
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (err: any) {
    console.error("Create job error:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
