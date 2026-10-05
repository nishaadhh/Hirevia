"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Play,
  Calendar,
  Send,
  MapPin,
  Briefcase,
  ArrowLeft,
  Video,
  Copy,
  Check,
  ExternalLink,
  Bot
} from "lucide-react";
import { ScheduleModal } from "@/components/ScheduleModal";
import { OutreachModal } from "@/components/OutreachModal";
import { playNotificationTing } from "@/lib/audio";

export default function CandidateDetailPage() {
  const params = useParams();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}`);
      if (res.ok) {
        const data = await res.json();
        setCandidate(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyMeet = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    playNotificationTing();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-[#0D0E0B] text-white min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#E5F33C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#9AA6B2] font-semibold">Loading Candidate Dossier...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-[#0D0E0B] text-white">
        <p className="text-[#9AA6B2]">Candidate not found.</p>
      </div>
    );
  }

  const mockInterview = candidate.mockInterview;

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back navigation */}
        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center space-x-1.5 text-xs text-[#9AA6B2] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Directory</span>
        </Link>

        {/* Profile Header Hero Card */}
        <div className="rounded-3xl bg-[#161812] p-6 sm:p-8 border-2 border-[#495462]/40 shadow-2xl relative glow-lime">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#11120D] text-white font-black text-2xl flex items-center justify-center border-2 border-[#E5F33C]/40 shadow-xl shrink-0">
                {candidate.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{candidate.name}</h1>
                  <ShieldCheck className="w-6 h-6 text-[#E5F33C]" />
                  <span className="px-3 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs">
                    {candidate.aiMatchScore}% Match
                  </span>
                </div>
                <p className="text-sm font-bold text-[#E5F33C]">{candidate.headline}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9AA6B2] pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9AA6B2]" />
                    <span>{candidate.location}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#9AA6B2]" />
                    <span>{candidate.experienceYears} Years Verified Exp</span>
                  </span>
                  <span>&bull;</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#11120D] text-[#CBD5E1] font-semibold text-[10px] border border-[#495462]/40">
                    Status: {candidate.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap md:flex-col gap-3 min-w-[210px]">
              {mockInterview && (
                <Link
                  href={`/dashboard/interviews/${mockInterview.id}`}
                  className="px-5 py-2.5 rounded-xl bg-[#495462] hover:bg-[#586576] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#E5F33C]" />
                  <span>Review AI Video ({mockInterview.overallScore}%)</span>
                </Link>
              )}

              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs flex items-center justify-center space-x-2 shadow-md shadow-[#E5F33C]/20 transition-all hover:scale-105"
              >
                <Calendar className="w-3.5 h-3.5 text-[#11120D]" />
                <span>Schedule Google Meet</span>
              </button>

              <button
                onClick={() => setOutreachModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#11120D] text-slate-300 hover:text-white border border-[#495462]/40 font-bold text-xs flex items-center justify-center space-x-2 transition-colors hover:border-[#E5F33C]/40"
              >
                <Send className="w-3.5 h-3.5 text-[#E5F33C]" />
                <span>Send Interview Request</span>
              </button>
            </div>
          </div>

          {/* Google Meet Link Banner if present */}
          {candidate.gmeetLink && (
            <div className="mt-4 pt-4 border-t border-[#495462]/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-[#E5F33C]" />
                <span className="text-white font-bold">Scheduled Google Meet:</span>
                <span className="font-mono text-[#E5F33C]">{candidate.gmeetLink}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyMeet(candidate.gmeetLink)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center space-x-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#E5F33C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                </button>
                <a
                  href={candidate.gmeetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-bold text-[11px] flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Meet</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Dossier Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Skills & AI Transcript */}
          <div className="lg:col-span-8 space-y-6">
            {/* Skills */}
            <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((sk: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-xs font-bold text-[#E5F33C]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Video Interview Transcripts if taken */}
            {mockInterview && (
              <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Video className="w-4 h-4 text-[#E5F33C]" />
                    <span>AI Video Interview Transcript & Answers</span>
                  </h3>
                  <Link
                    href={`/dashboard/interviews/${mockInterview.id}`}
                    className="text-xs text-[#E5F33C] hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>Open Review Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockInterview.transcript?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#11120D] border border-[#495462]/35 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#E5F33C] font-mono">
                          Question {idx + 1} &bull; {item.category}
                        </span>
                        <span className="text-xs font-black text-[#E5F33C] font-mono">
                          Score: {item.score}%
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white">{item.questionText}</p>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#161812] p-3 rounded-xl border border-[#495462]/30">
                        &ldquo;{item.candidateAnswer}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Verified Credentials vs AI Inferred Signals */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-5">
              <div>
                <h3 className="text-xs uppercase font-extrabold text-[#E5F33C] tracking-wider flex items-center space-x-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E5F33C]" />
                  <span>Verified Credentials</span>
                </h3>
                <div className="space-y-2">
                  {candidate.verifiedSkills?.map((vs: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#11120D] border border-[#E5F33C]/30 text-xs text-[#E5F33C] font-semibold">
                      {vs}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#495462]/30">
                <h3 className="text-xs uppercase font-extrabold text-[#9AA6B2] tracking-wider flex items-center space-x-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-[#E5F33C]" />
                  <span>AI Inferred Signals</span>
                </h3>
                <div className="space-y-2">
                  {candidate.aiInferredSkills?.map((ais: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#11120D] border border-[#495462]/40 text-xs text-[#CBD5E1]">
                      {ais}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Link to Senior HR Advisor */}
            <div className="p-5 rounded-3xl bg-[#161812] border border-[#E5F33C]/40 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#E5F33C]">
                <Bot className="w-4 h-4" />
                <span>Analyze with HR Advisor</span>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Get full 360° hiring score, strengths, red flags, and 5 targeted interview questions for {candidate.name}.
              </p>
              <Link
                href={`/dashboard/advisor`}
                className="w-full py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-[#E5F33C]/20"
              >
                <span>Launch Advisor Evaluation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        candidateName={candidate.name}
        candidateProfileId={candidate.id}
        jobTitle={candidate.headline}
        onSuccess={() => fetchCandidate()}
      />

      <OutreachModal
        isOpen={outreachModalOpen}
        onClose={() => setOutreachModalOpen(false)}
        candidateName={candidate.name}
        candidateProfileId={candidate.id}
        candidateHeadline={candidate.headline}
        candidateSkills={candidate.skills}
      />
    </div>
  );
}
