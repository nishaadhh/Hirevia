import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPw(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function seedDatabase() {
  console.log("🌱 Starting Hirevia Enterprise HR Portal Seed...");

  // Clean existing tables
  await prisma.interviewNote.deleteMany({});
  await prisma.interviewSchedule.deleteMany({});
  await prisma.mockInterview.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.jobOpening.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});

  const defaultPasswordHash = await hashPw("HireviaSecure2026!");

  // 1. Company (Tenant)
  const acme = await prisma.company.create({
    data: {
      name: "Acme AI Corp",
      domain: "acme.ai",
    },
  });

  // 2. HR User (Strictly HR Role)
  const hrUser = await prisma.user.create({
    data: {
      name: "Devon Miller (Lead HR Partner)",
      email: "hr@hirevia.io",
      passwordHash: defaultPasswordHash,
      role: "HR",
      companyId: acme.id,
    },
  });

  // 3. Job Openings
  const job1 = await prisma.jobOpening.create({
    data: {
      companyId: acme.id,
      title: "Senior Full Stack Developer",
      department: "Core Engineering",
      minExp: 4,
      requiredSkills: JSON.stringify(["React", "Node.js", "TypeScript", "Next.js", "System Design"]),
      preferredSkills: JSON.stringify(["PostgreSQL", "Docker", "AWS", "Microservices"]),
      salaryRange: "$155,000 - $185,000",
      description:
        "We are seeking a seasoned Senior Full Stack Developer to spearhead our core AI intelligence features. You will design, build, and optimize scalable React frontends and resilient Node.js services.",
      activeStatus: true,
    },
  });

  const job2 = await prisma.jobOpening.create({
    data: {
      companyId: acme.id,
      title: "Staff Backend Engineer",
      department: "Distributed Systems Core",
      minExp: 6,
      requiredSkills: JSON.stringify(["PostgreSQL", "Distributed Systems", "Node.js", "Python"]),
      preferredSkills: JSON.stringify(["Raft Consensus", "Redis", "Kafka", "Docker"]),
      salaryRange: "$175,000 - $195,000",
      description:
        "Design high-throughput distributed databases, optimize high-concurrency microservices, and oversee platform fault tolerance.",
      activeStatus: true,
    },
  });

  const job3 = await prisma.jobOpening.create({
    data: {
      companyId: acme.id,
      title: "Technical Sales Engineer",
      department: "Solutions & Growth",
      minExp: 3,
      requiredSkills: JSON.stringify(["React", "Client Communication", "Sales Engineering", "API Design"]),
      preferredSkills: JSON.stringify(["TypeScript", "GraphQL", "Enterprise Security"]),
      salaryRange: "$130,000 - $165,000",
      description:
        "Partner with enterprise buyers, conduct architecture evaluations, demo AI capabilities, and liaise with account executives.",
      activeStatus: true,
    },
  });

  // 4. Candidate Profiles
  // Candidate 1: Arjun Kumar (The Flagship Passed Candidate - 87% Match)
  const arjun = await prisma.candidateProfile.create({
    data: {
      companyId: acme.id,
      name: "Arjun Kumar",
      email: "arjun@hirevia.io",
      phone: "+1 (415) 890-2341",
      location: "San Francisco, CA",
      headline: "Senior Full Stack Developer | React 19, Next.js, AI Systems",
      experienceYears: 6.5,
      skills: JSON.stringify([
        "React",
        "Node.js",
        "TypeScript",
        "Next.js",
        "System Design",
        "PostgreSQL",
        "Docker",
        "Technical Leadership",
      ]),
      resumeUrl: "/sample-resumes/arjun-kumar-cv.pdf",
      verifiedSkills: JSON.stringify([
        "React & Next.js (Verified 6y)",
        "Node.js Backend Systems (Verified 6y)",
        "Distributed Database Scaling",
        "B.S. Computer Science UC Berkeley",
      ]),
      aiInferredSkills: JSON.stringify([
        "Principal-Level Architectural Maturity",
        "Zero-Downtime Deployment Discipline",
        "Empathetic Technical Mentorship",
      ]),
      aiMatchScore: 87,
      status: "READY_FOR_HR_REVIEW",
    },
  });

  // Candidate 2: Elena Rostova
  const elena = await prisma.candidateProfile.create({
    data: {
      companyId: acme.id,
      name: "Elena Rostova",
      email: "elena@hirevia.io",
      phone: "+1 (206) 555-0192",
      location: "Seattle, WA (Open to Remote)",
      headline: "Staff Backend Engineer | Distributed Systems & High-Throughput PostgreSQL",
      experienceYears: 7.2,
      skills: JSON.stringify([
        "PostgreSQL",
        "Distributed Systems",
        "Python",
        "Go",
        "Raft Consensus",
        "Query Optimization",
      ]),
      resumeUrl: "/sample-resumes/elena-rostova-cv.pdf",
      verifiedSkills: JSON.stringify([
        "PostgreSQL Internals (Verified 7y)",
        "Raft Consensus Implementation",
        "Low-Latency API Optimization",
      ]),
      aiInferredSkills: JSON.stringify([
        "High Algorithmic Rigor",
        "Calm Incident Triage Lead",
      ]),
      aiMatchScore: 84,
      status: "AI_SCREENED",
    },
  });

  // Candidate 3: Marcus Vance
  const marcus = await prisma.candidateProfile.create({
    data: {
      companyId: acme.id,
      name: "Marcus Vance",
      email: "marcus@hirevia.io",
      phone: "+1 (512) 555-8831",
      location: "Austin, TX (Hybrid)",
      headline: "Senior UI/UX Engineer & Accessible Design Systems Lead",
      experienceYears: 5.0,
      skills: JSON.stringify([
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Figma",
        "Design Systems",
        "Web Accessibility",
      ]),
      resumeUrl: "/sample-resumes/marcus-vance-cv.pdf",
      verifiedSkills: JSON.stringify([
        "Figma Design Systems (Verified 5y)",
        "WCAG 2.1 AAA Accessibility",
        "Production Component Libraries",
      ]),
      aiInferredSkills: JSON.stringify([
        "Micro-Interaction Polish",
        "Product Sense & UX Empathy",
      ]),
      aiMatchScore: 79,
      status: "NEW",
    },
  });

  // 5. Mock Interview for Arjun Kumar (READY_FOR_HR_REVIEW)
  const interviewArjun = await prisma.mockInterview.create({
    data: {
      candidateId: arjun.id,
      videoUrl: `/api/storage/stream?key=recordings/arjun-kumar-video.webm`,
      overallScore: 87,
      techScore: 89,
      commScore: 88,
      leadershipScore: 84,
      problemSolvingScore: 86,
      status: "READY_FOR_HR_REVIEW",
      completedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      transcript: JSON.stringify([
        {
          timestampSeconds: 135,
          questionText:
            "Welcome to your AI interview for Senior Full Stack Developer. Could you introduce yourself and walk through a recent architectural challenge you resolved?",
          candidateAnswer:
            "At Nexus Cloud Systems, we transitioned our customer analytics portal from a legacy client bundle to Next.js with server components and edge caching. The main challenge was maintaining real-time telemetry while cutting initial load times. We implemented optimistic state updates, indexed PostgreSQL queries, and decreased LCP by 42%.",
          score: 90,
          category: "TECHNICAL_ARCHITECTURE",
        },
        {
          timestampSeconds: 430,
          questionText:
            "How do you ensure high performance, maintainability, and clean code boundaries when scaling a Node.js and Next.js codebase?",
          candidateAnswer:
            "I enforce strict domain module boundaries. Frontend custom hooks encapsulate state away from view layers. On the backend, we implement Prisma connection pooling, Redis idempotency keys, and structured OpenTelemetry tracing.",
          score: 92,
          category: "SYSTEM_DESIGN",
        },
        {
          timestampSeconds: 635,
          questionText:
            "Describe a time when you had a technical disagreement with a teammate regarding system architecture. How did you arrive at a resolution?",
          candidateAnswer:
            "During a sprint discussing GraphQL vs REST for a high-frequency polling endpoint, I built two minimal reproduction test cases measuring CPU utilization and client bundle footprint. The objective benchmark data made the decision obvious to everyone without friction.",
          score: 88,
          category: "LEADERSHIP_BEHAVIORAL",
        },
        {
          timestampSeconds: 800,
          questionText:
            "How do you explain complex technical trade-offs to non-technical executive stakeholders?",
          candidateAnswer:
            "I map engineering decisions directly to business outcomes: latency reduction translated into checkout conversion rates, and modular code translated into reduced sprint cycle time.",
          score: 86,
          category: "CLIENT_COMMUNICATION",
        },
      ]),
    },
  });

  // 6. Timestamped HR Note for Arjun
  await prisma.interviewNote.create({
    data: {
      interviewId: interviewArjun.id,
      timestampSeconds: 282, // 04:42
      noteText: "Strong explanation of React performance optimization, memoization boundaries, and Postgres indexing.",
      authorId: hrUser.id,
    },
  });

  console.log("✅ Hirevia Enterprise HR Portal Database Seed Completed Successfully!");
  console.log(`HR Login: hr@hirevia.io / HireviaSecure2026! (Company: Acme AI Corp)`);
}

if (require.main === module || process.argv[1]?.includes("seed")) {
  seedDatabase()
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
