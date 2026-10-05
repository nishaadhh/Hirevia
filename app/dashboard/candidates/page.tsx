"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  Play,
  Send,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Video,
  Copy,
  Check,
  Calendar
} from "lucide-react";
import { OutreachModal } from "@/components/OutreachModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import { playNotificationTing } from "@/lib/audio";

export default function CandidatesDiscoveryPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(15);
  const [minScore, setMinScore] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("match");

  // Outreach Modal
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>({
    name: "",
    id: "",
    headline: "",
    skills: [],
  });

  // Schedule Modal
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState<any>({
    name: "",
    id: "",
    jobTitle: "",
  });

  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, [searchQuery, skillFilter, minExp, maxExp, minScore, locationFilter, sortBy]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (skillFilter) params.set("skill", skillFilter);
      if (minExp > 0) params.set("minExp", minExp.toString());
      if (maxExp < 15) params.set("maxExp", maxExp.toString());
      if (minScore > 0) params.set("minScore", minScore.toString());
      if (locationFilter) params.set("location", locationFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/candidates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOutreach = (c: any) => {
    setSelectedCandidate({
      name: c.name,
      id: c.id,
      headline: c.headline,
      skills: c.skills,
    });
    setOutreachOpen(true);
  };

  const handleOpenSchedule = (c: any) => {
    setScheduleCandidate({
      name: c.name,
      id: c.id,
      jobTitle: c.headline,
    });
    setScheduleOpen(true);
  };

  const copyMeet = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    playNotificationTing();
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-20 text-white">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#495462]/35">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#E5F33C] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#E5F33C]" />
              <span>HR Candidate Intelligence & Sourcing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Candidate Database</h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2]">
              Query PostgreSQL directly by verified skills, YoE, AI match scores, or natural language search.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#9AA6B2]">Total Filtered:</span>
            <span className="px-3 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs shadow-sm">
              {candidates.length} Profiles
            </span>
          </div>
        </div>

        {/* Advanced Database Filtering Engine (Requirement B) */}
        <div className="p-5 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-4">
          {/* Natural Language / Keyword Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9AA6B2] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type natural language: 'Find senior React developers with Node.js and team leadership'..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
            />
          </div>

          {/* Structured Query Filters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Skill Selector */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#9AA6B2] mb-1">Skill Filter</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C]"
              >
                <option value="">All Technologies</option>
                <option value="react">React / Next.js</option>
                <option value="node">Node.js</option>
                <option value="typescript">TypeScript</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="python">Python</option>
                <option value="system design">System Design</option>
              </select>
            </div>

            {/* Min Experience Slider */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-[#9AA6B2] mb-1">
                <span>Min Experience</span>
                <span className="text-[#E5F33C] font-mono font-bold">{minExp}y+</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="w-full accent-[#E5F33C] cursor-pointer h-2 bg-[#11120D] rounded-lg"
              />
            </div>

            {/* AI Match Score Threshold */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-[#9AA6B2] mb-1">
                <span>Min AI Match</span>
                <span className="text-[#E5F33C] font-mono font-bold">{minScore}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-[#E5F33C] cursor-pointer h-2 bg-[#11120D] rounded-lg"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#9AA6B2] mb-1">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C]"
              >
                <option value="">Any Location</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="Austin">Austin, TX</option>
              </select>
            </div>

            {/* Smart Database Sorting */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#9AA6B2] mb-1">Database Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C]"
              >
                <option value="match">AI Match Score (High to Low)</option>
                <option value="exp">Experience Years (Seniority)</option>
                <option value="name">Candidate Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Name, Score & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-base text-white">{c.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-[#E5F33C]" />
                    </div>
                    <p className="text-xs text-[#E5F33C] font-semibold mt-0.5">{c.headline}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-[#9AA6B2] mt-1">
                      <span className="flex items-center space-x-0.5">
                        <MapPin className="w-3 h-3 text-[#9AA6B2]" />
                        <span>{c.location}</span>
                      </span>
                      <span>&bull;</span>
                      <span>{c.experienceYears}y exp</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs shrink-0 shadow-sm">
                    {c.aiMatchScore}% Match
                  </span>
                </div>

                {/* AI Video Interview Score Badge if Taken */}
                {c.mockInterview && (
                  <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#E5F33C]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#E5F33C] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-[#E5F33C]" />
                        <span>AI Video Interview Passed</span>
                      </span>
                      <p className="text-xs text-white font-bold mt-0.5">
                        Score: <span className="text-[#E5F33C]">{c.mockInterview.overallScore}%</span>
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/interviews/${c.mockInterview.id}`}
                      className="px-3 py-1.5 rounded-xl bg-[#495462] hover:bg-[#586576] text-white text-xs font-bold flex items-center space-x-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current text-[#E5F33C]" />
                      <span>Watch</span>
                    </Link>
                  </div>
                )}

                {/* Google Meet Link Display (Requirement E) */}
                {c.gmeetLink && (
                  <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#495462]/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#E5F33C] flex items-center space-x-1">
                        <Video className="w-3.5 h-3.5" />
                        <span>Google Meet Scheduled</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#161812] border border-[#495462]/30 font-mono text-[11px] text-[#E5F33C]">
                      <span className="truncate mr-2">{c.gmeetLink}</span>
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => copyMeet(c.gmeetLink, c.id)}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans"
                        >
                          {copiedLink === c.id ? "Copied" : "Copy"}
                        </button>
                        <a
                          href={c.gmeetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-[#E5F33C] text-[#11120D] font-bold text-[10px] font-sans flex items-center space-x-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verified Skills vs AI Inferred Skills */}
                <div className="space-y-2 pt-1 text-[10px]">
                  <div>
                    <span className="uppercase font-bold text-[#E5F33C]">Verified Credentials:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.verifiedSkills?.slice(0, 3).map((vs: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-[#E5F33C]/10 border border-[#E5F33C]/25 text-[#E5F33C] font-semibold">
                          {vs}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="uppercase font-bold text-[#9AA6B2]">AI Inferred Signals:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.aiInferredSkills?.slice(0, 2).map((ais: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-[#495462]/30 border border-[#495462]/40 text-[#CBD5E1] font-medium">
                          {ais}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.skills?.slice(0, 4).map((sk: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#11120D] border border-[#495462]/40 text-[11px] text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-[#495462]/30 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenOutreach(c)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#495462] hover:bg-[#586576] text-white text-xs font-bold flex items-center justify-center space-x-1.5 flex-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#E5F33C]" />
                  <span>Send Request</span>
                </button>

                <button
                  onClick={() => handleOpenSchedule(c)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center justify-center space-x-1.5 flex-1 shadow-md shadow-[#E5F33C]/20 transition-all hover:scale-105"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#11120D]" />
                  <span>Schedule Round</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outreach Modal */}
      <OutreachModal
        isOpen={outreachOpen}
        onClose={() => setOutreachOpen(false)}
        candidateName={selectedCandidate.name}
        candidateProfileId={selectedCandidate.id}
        candidateHeadline={selectedCandidate.headline}
        candidateSkills={selectedCandidate.skills}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        candidateName={scheduleCandidate.name}
        candidateProfileId={scheduleCandidate.id}
        jobTitle={scheduleCandidate.jobTitle}
        onSuccess={() => fetchCandidates()}
      />
    </div>
  );
}
