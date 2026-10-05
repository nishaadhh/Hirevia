"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  CheckCircle2,
  Clock,
  Play,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter
} from "lucide-react";
import { ScheduleModal } from "@/components/ScheduleModal";

export default function ReadyInterviewsPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCand, setSelectedCand] = useState<any>({
    name: "Arjun Kumar",
    id: "",
    jobTitle: "Senior Full Stack Developer",
  });

  useEffect(() => {
    fetchReadyCandidates();
  }, []);

  const fetchReadyCandidates = async () => {
    try {
      const res = await fetch("/api/dashboard/metrics");
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.readyCandidates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openSchedule = (c: any) => {
    setSelectedCand({
      name: c.candidateName,
      id: c.candidateId,
      jobTitle: c.jobTitle,
      jobId: c.jobId,
    });
    setScheduleModalOpen(true);
  };

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-16 text-white">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#495462]/35">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-[#E5F33C] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#E5F33C]" />
              <span>AI Screening Passed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              AI Interview Reviews &bull; Ready for HR Round
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2]">
              Candidates who successfully cleared autonomous video assessments and met the &gt;80% competency threshold.
            </p>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {candidates.length === 0 && !loading ? (
            <div className="p-8 text-center rounded-3xl bg-[#161812] border border-[#495462]/40">
              <p className="text-sm text-[#9AA6B2]">No candidates currently awaiting review.</p>
            </div>
          ) : (
            candidates.map((cand) => (
              <div
                key={cand.aiInterviewId}
                className="p-6 rounded-3xl bg-[#161812] border-2 border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all glow-lime"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Candidate Info */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        cand.candidateAvatar ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={cand.candidateName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E5F33C]/40 shadow-lg shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-black text-white">{cand.candidateName}</h3>
                        <ShieldCheck className="w-4 h-4 text-[#E5F33C]" />
                        <span className="px-3 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] text-xs font-black">
                          {cand.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#E5F33C] font-semibold mt-0.5">
                        {cand.jobTitle} opening
                      </p>
                      <p className="text-xs text-[#CBD5E1] mt-2 max-w-2xl leading-relaxed">
                        {cand.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#11120D] border border-[#495462]/40 text-[11px] text-slate-300 font-mono">
                          Technical: {cand.technicalScore}%
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#E5F33C]/15 border border-[#E5F33C]/30 text-[11px] text-[#E5F33C] font-semibold">
                          Fairness Audit Passed
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#495462]/30 border border-[#495462]/50 text-[11px] text-[#CBD5E1]">
                          18m 10s Video Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[210px] shrink-0">
                    <Link
                      href={`/dashboard/interviews/${cand.aiInterviewId}`}
                      className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#495462] hover:bg-[#586576] text-white font-bold text-xs transition-all shadow-md hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-[#E5F33C]" />
                      <span>Review Video & Notes</span>
                    </Link>

                    <button
                      onClick={() => openSchedule(cand)}
                      className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs transition-all shadow-md shadow-[#E5F33C]/20 hover:scale-105 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#11120D]" />
                      <span>Schedule HR Round</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        candidateName={selectedCand.name}
        candidateProfileId={selectedCand.id}
        jobTitle={selectedCand.jobTitle}
        jobId={selectedCand.jobId}
      />
    </div>
  );
}
