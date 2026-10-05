import { HRAdvisorAnalysis } from "@/types";

export interface AIProvider {
  chat(messages: { role: "system" | "user" | "assistant"; content: string }[], candidateContext?: any): Promise<string>;
  analyzeCandidateForHRAdvisor(candidate: any, job?: any): Promise<HRAdvisorAnalysis>;
  generateOutreachMessage(candidate: any, job: any, platform?: string): Promise<string>;
  parseNaturalLanguageFilter(query: string): Promise<{ skills?: string[]; minExp?: number; location?: string }>;
}

export class OpenAIOrMockAIProvider implements AIProvider {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async chat(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
    candidateContext?: any
  ): Promise<string> {
    const userPrompt = messages[messages.length - 1]?.content || "";

    // 1. If OpenAI API Key is configured, execute live OpenAI GPT-4 request
    if (this.apiKey && this.apiKey.startsWith("sk-")) {
      try {
        const systemPrompt = `You are Hirevia's Senior HR Advisor & Talent Architect with 10+ years of enterprise tech recruiting experience.
You evaluate software engineers, system architects, and tech talent objectively.
Current Candidate In Context: ${candidateContext ? JSON.stringify(candidateContext) : "None selected"}.
Answer HR queries with executive precision, hiring metrics, culture-fit criteria, and actionable interview guidance.`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            temperature: 0.3,
            max_tokens: 800,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return reply;
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to senior HR reasoning engine:", err);
      }
    }

    // 2. Intelligent Senior HR Partner Reasoning Engine (Fallback)
    const lower = userPrompt.toLowerCase();

    if (candidateContext) {
      const name = candidateContext.name || "the candidate";
      if (lower.includes("hire") || lower.includes("recommend") || lower.includes("decision")) {
        return `### Senior HR Hiring Recommendation: ${name}

**Verdict: STRONG HIRE (Proceed to HR Final Round)**
- **Technical Fit (94%)**: Demonstrated senior Next.js and React 19 performance patterns in the AI video assessment, with verified 6.5 years experience.
- **Leadership & Communication (88%)**: Communicated complex engineering trade-offs calmly. Responded with data-driven consensus in sprint disagreement scenarios.
- **Compensation & Alignment**: Target band ($165k–$185k) aligns with Acme AI Corp's Senior Full Stack requisitions.

**Recommended Next Step**:
Schedule a 45-minute culture and executive vision round via Google Meet to confirm on-call expectations and team leadership appetite.`;
      }

      if (lower.includes("red flag") || lower.includes("concern") || lower.includes("risk")) {
        return `### Strategic Risk Assessment for ${name}

1. **Kubernetes & Cloud Infrastructure Depth**: While their application architecture and PostgreSQL optimization are verified, production Kubernetes ingress routing was inferred rather than tested. Probe this in the HR round.
2. **On-Call Availability**: As a remote candidate based in San Francisco, align on multi-timezone deployment schedules during peak enterprise support cycles.
3. **Retention Risk**: Low risk. Candidates with consistent tenure across Tier-1 cloud products average an 87.4% retention rate at Acme AI Corp.`;
      }

      if (lower.includes("question") || lower.includes("ask") || lower.includes("interview")) {
        return `### 5 High-Impact HR & Technical Interview Questions for ${name}

1. *"You transitioned your portal to Next.js server components and decreased LCP by 42%. Walk me through how you benchmarked and prevented hydration mismatches."*
   *(Listen for: SSR caching boundaries, streaming hydration, telemetry metrics)*

2. *"Tell me about a time an engineering peer strongly pushed for an architecture you disagreed with. How did you resolve it without slowing velocity?"*
   *(Listen for: Data-driven decision making, lack of defensive ego, team cohesion)*

3. *"How do you mentor mid-level developers when they struggle with asynchronous state management or database connection pooling?"*
   *(Listen for: Empathy, code review philosophy, pairing habits)*

4. *"Our platform requires 99.99% availability during AI video evaluations. What incident triage protocol do you follow when a production microservice degrades?"*
   *(Listen for: Blameless post-mortems, circuit breakers, structured observability)*

5. *"What culture and management style empowers you to do your highest-impact engineering work?"*
   *(Listen for: Autonomy, mission alignment, leadership transparency)*`;
      }
    }

    if (lower.includes("arjun")) {
      return `**Arjun Kumar** is our top-scoring candidate (87% Match Score, 89% Technical, 88% Communication). He completed his 18-minute AI Video Interview and is flagged on your dashboard as **"Candidate Ready for HR Review"**. Would you like me to generate a tailored interview briefing or generate a Google Meet scheduling slot?`;
    }

    if (lower.includes("compare") || lower.includes("pipeline")) {
      return `### Candidate Pipeline Intelligence:

1. **Arjun Kumar** (87% Match) &bull; *Senior Full Stack Developer*
   - Status: **Ready for HR Review** (Passed AI Video Interview)
   - Core Strengths: React 19, Next.js, Node.js, PostgreSQL scaling.
2. **Elena Rostova** (84% Match) &bull; *Staff Backend Engineer*
   - Status: **AI Screened**
   - Core Strengths: Distributed databases, Raft consensus, query throughput.
3. **Marcus Vance** (79% Match) &bull; *Senior UI/UX Engineer*
   - Status: **New Profile**
   - Core Strengths: Design systems, WCAG 2.1 AAA accessibility, Tailwind CSS.`;
    }

    return `I am your **Senior HR AI Talent Partner**. I have full context on your candidate pipeline, job openings, and interview recordings for Acme AI Corp. 

You can select any candidate from the dropdown above to get:
- Comprehensive 360° Hiring Score & Competency Breakdown
- Observed Strengths & Potential Red Flags
- 5 Targeted HR Interview Questions with "What to Listen For" guidelines
- Instant Google Meet round scheduling advice.`;
  }

  async analyzeCandidateForHRAdvisor(candidate: any, job?: any): Promise<HRAdvisorAnalysis> {
    const name = candidate?.name || "Candidate";
    const title = candidate?.headline || job?.title || "Senior Engineer";
    const score = candidate?.aiMatchScore || 87;

    return {
      candidateId: candidate.id,
      candidateName: name,
      overallFitPercentage: score >= 85 ? 92 : score >= 80 ? 86 : 78,
      hiringScore: score,
      breakdown: {
        technicalFit: Math.min(98, score + 4),
        leadershipPotential: Math.max(76, score - 3),
        culturalFit: Math.min(96, score + 2),
      },
      strengths: [
        `Proven track record in ${candidate.skills?.slice(0, 3).join(", ") || "full-stack development"}`,
        `Articulate verbal communication during behavioral conflict and architecture trade-off questions`,
        `Demonstrated ownership of zero-downtime microservices and production database query scaling`,
        `Strong cultural alignment with modern enterprise engineering practices`,
      ],
      redFlags: [
        `Infrastructure as Code (Terraform / K8s ingress) was inferred rather than tested in the recording`,
        `Comp expectation is near the top of the band for ${title} ($165k–$185k)`,
      ],
      targetedQuestions: [
        {
          question: `Can you walk through a high-concurrency bottleneck you resolved in production, and how you verified the fix?`,
          type: "TECHNICAL",
          whatToListenFor: "Connection pooling, indexing strategies, memory profiling, and metrics telemetry.",
        },
        {
          question: `How do you handle disagreement with product managers over technical debt vs. new feature velocity?`,
          type: "BEHAVIORAL",
          whatToListenFor: "Pragmatism, business unit economics awareness, and structured trade-off communication.",
        },
        {
          question: `Describe how you mentor junior and mid-level engineers through code reviews without causing friction.`,
          type: "LEADERSHIP",
          whatToListenFor: "Constructive feedback loops, psychological safety, and fostering team ownership.",
        },
        {
          question: `What approach do you take to ensure high test coverage and fault tolerance in event-driven systems?`,
          type: "TECHNICAL",
          whatToListenFor: "Idempotency keys, automated integration tests, and circuit breakers.",
        },
        {
          question: `What management style helps you do your best work, and what environment causes you frustration?`,
          type: "BEHAVIORAL",
          whatToListenFor: "Autonomous execution, alignment on objectives, and transparency.",
        },
      ],
      advisorSummary: `${name} represents a top-percentile engineering candidate who cleared the autonomous AI video assessment with an ${score}% match. Their depth in scalable systems makes them an immediate asset to Acme AI Corp. Recommended to proceed with the HR final round.`,
    };
  }

  async generateOutreachMessage(candidate: any, job: any, platform = "LINKEDIN"): Promise<string> {
    const candName = candidate?.name || "there";
    const jobTitle = job?.title || "Senior Full Stack Developer";
    const skills = Array.isArray(candidate?.skills) ? candidate.skills.slice(0, 3).join(", ") : "your technical expertise";

    return `Hi ${candName},

I came across your background and was very impressed by your track record in ${skills}.

At Acme AI Corp, we are expanding our core talent and currently hiring a ${jobTitle}. Given your strong background as ${candidate?.headline || "a seasoned engineer"}, I believe your expertise would make a substantial impact on our architecture and high-velocity roadmap.

Would you be open to a brief 15-minute introductory conversation this week?

Best regards,
Devon Miller
Lead HR Talent Partner | Acme AI Corp`;
  }

  async parseNaturalLanguageFilter(query: string): Promise<{ skills?: string[]; minExp?: number; location?: string }> {
    const lower = query.toLowerCase();
    const skills: string[] = [];

    const techList = ["react", "node", "typescript", "next.js", "postgres", "postgresql", "python", "docker", "aws", "figma", "go", "system design"];
    for (const tech of techList) {
      if (lower.includes(tech)) {
        skills.push(tech === "postgres" ? "PostgreSQL" : tech.charAt(0).toUpperCase() + tech.slice(1));
      }
    }

    const expMatch = lower.match(/(\d+)\+?\s*y/);
    const minExp = expMatch ? parseInt(expMatch[1], 10) : undefined;

    let location: string | undefined;
    if (lower.includes("san francisco") || lower.includes("sf")) location = "San Francisco";
    if (lower.includes("seattle")) location = "Seattle";
    if (lower.includes("austin")) location = "Austin";
    if (lower.includes("remote")) location = "Remote";

    return { skills: skills.length > 0 ? skills : undefined, minExp, location };
  }
}

// Singleton instance
let aiProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!aiProviderInstance) {
    aiProviderInstance = new OpenAIOrMockAIProvider();
  }
  return aiProviderInstance;
}
