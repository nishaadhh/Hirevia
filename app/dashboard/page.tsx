"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Briefcase,
  Video,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Send,
  ExternalLink,
  Bot,
  Copy,
  Check
} from "lucide-react";
import { ScheduleModal } from "@/components/ScheduleModal";
import { playNotificationTing } from "@/lib/audio";

export default function HRDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Schedule Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>({
    name: "Arjun Kumar",
    id: "",
    jobTitle: "Senior Full Stack Developer",
  });

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/dashboard/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (cand: any) => {
    setSelectedCandidate({
      name: cand.name || cand.candidateName || "Arjun Kumar",
      id: cand.candidateId || cand.id || "",
      jobTitle: cand.jobTitle || "Senior Full Stack Developer",
    });
    setScheduleModalOpen(true);
  };

  const copyMeet = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    playNotificationTing();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const alertCandidate = metrics?.alertCandidate;

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-20 text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#495462]/35">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold text-[#E5F33C] tracking-wider">
                Acme AI Corp &bull; Central HR Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] text-[10px] font-black">
                AUTONOMOUS SCREEN ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              HR Recruitment Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2]">
              Welcome back, <span className="text-white font-bold">Devon Miller</span> (Lead HR Talent Partner). Multi-tenant isolation active.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/advisor"
              className="px-4 py-2 rounded-xl bg-[#1B1E16] hover:bg-[#252a1e] text-[#E5F33C] border border-[#E5F33C]/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Bot className="w-3.5 h-3.5 text-[#E5F33C]" />
              <span>Senior HR Advisor</span>
            </Link>
            <Link
              href="/dashboard/candidates"
              className="px-4 py-2 rounded-xl bg-[#495462]/30 hover:bg-[#495462]/50 text-xs font-bold text-white border border-[#495462]/50 flex items-center space-x-1.5 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-[#E5F33C]" />
              <span>Candidate Search</span>
            </Link>
            <Link
              href="/dashboard/jobs"
              className="px-4 py-2 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md shadow-[#E5F33C]/20"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#11120D]" />
              <span>Active Roles</span>
            </Link>
          </div>
        </div>

        {/* PROMINENT HR ALERT CARD (Requirement A) in Palette */}
        {alertCandidate && (
          <div className="rounded-3xl p-6 sm:p-7 bg-[#161812] border-2 border-[#E5F33C]/50 shadow-2xl shadow-black/80 glow-lime relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5F33C]/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                {/* Card Header: "Candidate Ready for HR Review" */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#E5F33C] text-[#11120D] text-xs font-black uppercase tracking-wider shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#11120D]" />
                  <span>Candidate Ready for HR Review</span>
                </div>

                {/* Details: Arjun Kumar | Senior Full Stack Developer | AI Match: 87% | AI Interview: Passed */}
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#E5F33C] p-0.5 shadow-lg shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt={alertCandidate.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white">{alertCandidate.name}</h2>
                      <ShieldCheck className="w-5 h-5 text-[#E5F33C]" />
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs">
                        AI Match: {alertCandidate.aiMatchScore}%
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#495462]/50 text-white font-bold text-xs border border-[#495462]/60">
                        AI Interview: Passed
                      </span>
                    </div>
                    <p className="text-xs text-[#E5F33C] font-semibold mt-1">
                      {alertCandidate.jobTitle} opening &bull; San Francisco, CA (6.5y verified exp)
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Autonomous 18-minute AI video assessment concluded. Candidate exceeded benchmarks in Next.js server components,
                  PostgreSQL connection scaling, and sprint conflict resolution. Ready for the final HR round.
                </p>

                {alertCandidate.gmeetLink && (
                  <div className="flex items-center space-x-2 pt-1 font-mono text-xs text-[#E5F33C] bg-[#11120D] p-2 rounded-xl border border-[#495462]/40 w-fit">
                    <span className="text-[#9AA6B2]">Google Meet:</span>
                    <span className="underline">{alertCandidate.gmeetLink}</span>
                    <button
                      onClick={() => copyMeet(alertCandidate.gmeetLink)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Google Meet Link"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#E5F33C]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* CTA Buttons: [Review Candidate], [Watch AI Interview], [Schedule HR Interview] */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
                <Link
                  href={`/dashboard/candidates/${alertCandidate.candidateId}`}
                  className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs transition-all shadow-md shadow-[#E5F33C]/20 hover:scale-105 active:scale-95"
                >
                  <Users className="w-3.5 h-3.5 text-[#11120D]" />
                  <span>Review Candidate</span>
                </Link>

                <Link
                  href={`/dashboard/interviews/${alertCandidate.interviewId}`}
                  className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#495462] hover:bg-[#586576] text-white font-bold text-xs transition-all border border-[#495462]/50 hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#E5F33C]" />
                  <span>Watch AI Interview</span>
                </Link>

                <button
                  onClick={() => openScheduleModal(alertCandidate)}
                  className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#1B1E16] hover:bg-[#252a1e] text-[#E5F33C] border border-[#E5F33C]/50 font-bold text-xs transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#E5F33C]" />
                  <span>Schedule HR Interview</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5 Top HR Metric Cards (Requirement A) in Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all">
            <div className="flex items-center justify-between text-[#E5F33C] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA6B2]">Active Jobs</span>
              <Briefcase className="w-4 h-4 text-[#E5F33C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.activeJobs || 3}
            </p>
            <p className="text-[10px] text-[#9AA6B2] mt-1">Requisitions Open</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all">
            <div className="flex items-center justify-between text-[#E5F33C] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA6B2]">Total Candidates</span>
              <Users className="w-4 h-4 text-[#E5F33C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.totalCandidates || 3}
            </p>
            <p className="text-[10px] text-[#9AA6B2] mt-1">In Acme AI Pipeline</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all">
            <div className="flex items-center justify-between text-[#E5F33C] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA6B2]">AI Screened</span>
              <Video className="w-4 h-4 text-[#E5F33C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.aiScreenedCandidates || 2}
            </p>
            <p className="text-[10px] text-[#9AA6B2] mt-1">Video Sessions Run</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all">
            <div className="flex items-center justify-between text-[#E5F33C] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA6B2]">Ready for HR</span>
              <CheckCircle2 className="w-4 h-4 text-[#E5F33C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#E5F33C]">
              {metrics?.readyForHRReview || 1}
            </p>
            <p className="text-[10px] text-[#E5F33C] font-semibold mt-1">&gt;85% Competency Score</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#E5F33C] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA6B2]">HR Scheduled</span>
              <Calendar className="w-4 h-4 text-[#E5F33C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.scheduledInterviews || 0}
            </p>
            <p className="text-[10px] text-[#9AA6B2] mt-1">Google Meet Rounds</p>
          </div>
        </div>

        {/* 2-Column Section: Screened Candidates & Senior HR Advisor */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Screened Candidates */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">Candidates Ready for HR Action</h3>
                <p className="text-xs text-[#9AA6B2]">Completed autonomous AI evaluation with score breakdown</p>
              </div>
              <Link
                href="/dashboard/candidates"
                className="text-xs text-[#E5F33C] hover:underline font-bold flex items-center"
              >
                <span>View Full Database</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {metrics?.recentInterviews?.map((mi: any) => (
                <div
                  key={mi.id}
                  className="p-5 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#495462]/40 text-white font-black flex items-center justify-center border border-[#495462]/50 shrink-0">
                        {mi.candidateName.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{mi.candidateName}</h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] text-[10px] font-black">
                            {mi.overallScore}% AI Score
                          </span>
                        </div>
                        <p className="text-xs text-[#CBD5E1]">{mi.candidateHeadline}</p>
                        <p className="text-[11px] text-[#9AA6B2] mt-0.5">
                          Technical: {mi.techScore}% &bull; Communication: {mi.commScore}%
                        </p>
                        {mi.gmeetLink && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] text-[#9AA6B2]">Meet:</span>
                            <a
                              href={mi.gmeetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#E5F33C] font-mono underline"
                            >
                              {mi.gmeetLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <Link
                        href={`/dashboard/interviews/${mi.id}`}
                        className="px-3.5 py-2 rounded-xl bg-[#495462] hover:bg-[#586576] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current text-[#E5F33C]" />
                        <span>Watch Video</span>
                      </Link>

                      <button
                        onClick={() =>
                          openScheduleModal({
                            id: mi.candidateId,
                            name: mi.candidateName,
                            jobTitle: mi.candidateHeadline,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center space-x-1.5 transition-colors shadow-sm"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Senior HR Advisor Callout Box */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-white">Senior HR Advisor Copilot</h3>
              <p className="text-xs text-[#9AA6B2]">Real-time candidate intelligence and hiring analysis</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#161812] border border-[#E5F33C]/40 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-5 h-5 text-[#11120D]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Active Advisor Briefing</h4>
                  <p className="text-[10px] text-[#E5F33C] font-semibold">10+ Year Tech Talent Partner Intelligence</p>
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#11120D] p-4 rounded-2xl border border-[#495462]/30">
                &ldquo;Arjun Kumar represents our highest-ranked candidate this cycle. His deep React 19 performance patterns
                and Next.js edge caching knowledge exceed senior requirements. Recommended to book the HR cultural alignment round immediately.&rdquo;
              </p>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/dashboard/advisor"
                  className="w-full py-3 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#E5F33C]/20"
                >
                  <span>Open Full HR Advisor Chatbot</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#11120D]" />
                </Link>
              </div>
            </div>

            {/* Google Meet Integration Status Pill */}
            <div className="p-4 rounded-2xl bg-[#161812] border border-[#495462]/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-[#E5F33C]" />
                <span className="text-[#CBD5E1] font-medium">Google Meet & Calendar Integration</span>
              </div>
              <span className="text-[#E5F33C] font-black font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#E5F33C]/15 border border-[#E5F33C]/30">
                ACTIVE & SYNCED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal with Google Meet */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        candidateName={selectedCandidate.name}
        candidateProfileId={selectedCandidate.id}
        jobTitle={selectedCandidate.jobTitle}
        onSuccess={() => fetchMetrics()}
      />
    </div>
  );
}
