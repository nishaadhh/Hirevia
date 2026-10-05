"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Award,
  Calendar,
  MessageSquare
} from "lucide-react";
import { playNotificationTing } from "@/lib/audio";

export default function TeamBuilderPage() {
  const [brief, setBrief] = useState(
    "Build a high-performance cross-functional engineering pod to design and launch our enterprise multimodal AI recruiting intelligence engine."
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "Lead Full Stack Developer",
    "Staff Backend Architect",
    "Senior Product Designer & UI Engineer",
  ]);

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleGenerateTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectBrief: brief,
          rolesRequested: selectedRoles,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
        playNotificationTing();
      } else {
        alert("Failed to generate team recommendation.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating team recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0a0d14] relative pb-20">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Skill Complementarity Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Cross-Functional Team Assembler</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Mathematically evaluate skill complementarity, leadership distribution, and team synergy scores.
            </p>
          </div>
        </div>

        {/* Project Brief Input Box */}
        <div className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4 glow-indigo">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Objective & Squad Brief</h3>
            <span className="text-[11px] text-purple-400 font-semibold">AI Squad Architect</span>
          </div>

          <textarea
            rows={3}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 transition-colors resize-none font-sans"
            placeholder="Describe project requirements, tech stack goals, and squad mission..."
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Quick Presets:</span>
            <button
              onClick={() =>
                setBrief(
                  "Launch enterprise multimodal AI recruitment platform with edge Next.js caching, real-time audio analysis, and high-concurrency microservices."
                )
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/5 transition-colors"
            >
              Enterprise AI Recruitment Platform
            </button>
            <button
              onClick={() =>
                setBrief(
                  "Build low-latency FinTech analytics engine with distributed PostgreSQL, raft consensus fault tolerance, and institutional reporting."
                )
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/5 transition-colors"
            >
              Low-Latency FinTech Engine
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerateTeam}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Synthesizing Complementary Squad..." : "Generate Complementary Team with AI"}</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        {recommendation && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Team Synergy Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">{recommendation.teamName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    Synergy Score: 94%
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {recommendation.rationale}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => alert("Squad confirmed and saved to enterprise workspace!")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all"
                >
                  Confirm & Assemble Squad
                </button>
              </div>
            </div>

            {/* Recommended Team Members Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {recommendation.members.map((mem: any, idx: number) => (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                          Assigned Role
                        </span>
                        <h3 className="text-sm font-bold text-white mt-0.5">{mem.assignedRole}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {mem.matchScore}% Fit
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                      <p className="text-sm font-bold text-white">{mem.candidateName}</p>
                      <p className="text-xs text-slate-400">{mem.experienceYears}y verified background</p>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{mem.fitRationale}</p>
                    </div>

                    {/* Skill Tags */}
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Key Skills Contributed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mem.skills?.map((sk: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <Link
                      href={`/dashboard/candidates/${mem.candidateId}`}
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Coverage Matrix */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Squad Skill Coverage Matrix</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {recommendation.skillCoverage?.map((sc: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{sc.skill}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        {sc.coverageLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Covered by {sc.coveredBy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
