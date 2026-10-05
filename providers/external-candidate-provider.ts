export interface ExternalCandidate {
  externalId: string;
  name: string;
  headline: string;
  location: string;
  source: "LINKEDIN" | "NAUKRI" | "OFFICIAL_API";
  profileUrl: string;
  experienceYears: number;
  skills: string[];
  isVerified: boolean;
  avatar?: string;
  consentedAt?: string;
}

export interface ExternalCandidateProvider {
  searchCandidates(query: string, filters?: any): Promise<ExternalCandidate[]>;
  getCandidate(externalId: string): Promise<ExternalCandidate | null>;
  importCandidate(externalId: string, companyId: string): Promise<any>;
  getProfileUrl(externalId: string): string;
  getSupportedActions(): string[];
}

export class AuthorizedIntegrationCandidateProvider implements ExternalCandidateProvider {
  private candidatesDatabase: ExternalCandidate[] = [
    {
      externalId: "ext-li-101",
      name: "Siddharth Verma",
      headline: "Senior Backend Architect | Go, Kubernetes, Kafka",
      location: "Bengaluru, India (Remote)",
      source: "LINKEDIN",
      profileUrl: "https://www.linkedin.com/in/siddharth-verma-demo",
      experienceYears: 7,
      skills: ["Go", "Kubernetes", "Kafka", "PostgreSQL", "System Design"],
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      consentedAt: new Date().toISOString()
    },
    {
      externalId: "ext-li-102",
      name: "Priya Sundaram",
      headline: "Staff Cloud & DevOps Engineer | AWS, Terraform, CI/CD",
      location: "San Jose, CA (Hybrid)",
      source: "LINKEDIN",
      profileUrl: "https://www.linkedin.com/in/priya-sundaram-demo",
      experienceYears: 8,
      skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      consentedAt: new Date().toISOString()
    },
    {
      externalId: "ext-nk-201",
      name: "Aman Shaikh",
      headline: "Full Stack Lead | Next.js, Node.js, Micro-frontends",
      location: "Pune, India (Remote)",
      source: "NAUKRI",
      profileUrl: "https://www.naukri.com/profile/aman-shaikh-demo",
      experienceYears: 6,
      skills: ["React", "Next.js", "Node.js", "TypeScript", "GraphQL"],
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      consentedAt: new Date().toISOString()
    }
  ];

  async searchCandidates(query: string, filters?: any): Promise<ExternalCandidate[]> {
    const q = query.toLowerCase();
    return this.candidatesDatabase.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  async getCandidate(externalId: string): Promise<ExternalCandidate | null> {
    return this.candidatesDatabase.find(c => c.externalId === externalId) || null;
  }

  async importCandidate(externalId: string, companyId: string): Promise<any> {
    const candidate = await this.getCandidate(externalId);
    if (!candidate) throw new Error("External candidate not found or not consented for import");

    return {
      success: true,
      companyId,
      importedCandidate: {
        ...candidate,
        importTimestamp: new Date().toISOString(),
        verifiedConsent: true
      }
    };
  }

  getProfileUrl(externalId: string): string {
    const cand = this.candidatesDatabase.find(c => c.externalId === externalId);
    return cand?.profileUrl || "https://www.linkedin.com";
  }

  getSupportedActions(): string[] {
    return [
      "SEARCH_CONSENTED_CANDIDATES",
      "IMPORT_AUTHORIZED_PROFILE",
      "GENERATE_PERSONALIZED_OUTREACH",
      "TRACK_OUTREACH_STATUS"
    ];
  }
}

export function getExternalCandidateProvider(): ExternalCandidateProvider {
  return new AuthorizedIntegrationCandidateProvider();
}
