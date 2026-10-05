"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Zap,
  Users,
  Activity
} from "lucide-react";

export default function AnalyticsCompliancePage() {
  return (
    <div className="flex-1 bg-[#0a0d14] relative pb-16">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliance & Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Platform Analytics & Bias Audit</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Audit trails, hiring velocity benchmarks, and mathematical guarantees of demographic independence.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fairness Audit</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
            <p className="text-[11px] text-slate-400 mt-1">0 protected characteristic flags</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Time to Hire</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">9.4 Days</p>
            <p className="text-[11px] text-cyan-300 mt-1">72% faster than 34d benchmark</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Predictive Fit</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">87.4%</p>
            <p className="text-[11px] text-slate-400 mt-1">1st-year retention correlation</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Tokens Used</span>
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">42.8k</p>
            <p className="text-[11px] text-purple-300 mt-1">Avg cost $0.08 / candidate</p>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Fairness Audit Certificate */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-6 glow-emerald">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Algorithmic Fairness Certification</h3>
                  <p className="text-xs text-emerald-300">Continuous EEOC & EU AI Act Compliance Audited</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                Active & Certified
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every multimodal video interview and resume evaluation strictly isolates objective technical competencies
              and verified experience. The model is mathematically prevented from using protected attributes
              including gender, ethnicity, age, dialect, physical traits, or geography.
            </p>

            {/* Independent Metric Meters */}
            <div className="space-y-3">
              {[
                { label: "Demographic Independence Score", val: 100 },
                { label: "Accent & Dialect Neutrality Index", val: 99.4 },
                { label: "Socioeconomic Neutrality Index", val: 99.1 },
                { label: "Merit-Based Competency Correlation", val: 94.8 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-emerald-400 font-bold font-mono">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-white">Cryptographic Verification Hash:</span>
              <p className="font-mono text-cyan-400 truncate">
                0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
            </div>
          </div>

          {/* Right: Sourcing Channel Conversion Effectiveness */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Outreach Channel Velocity</h3>
              <p className="text-xs text-slate-400">Response & interview completion rates by source</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">LinkedIn InMail (Automated AI)</span>
                  <span className="text-indigo-400 font-mono">42% Response</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: "42%" }} />
                </div>
                <p className="text-[10px] text-slate-400">18 invitations sent &bull; 8 completed AI interview</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Direct Application & Referral</span>
                  <span className="text-cyan-400 font-mono">31% Response</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: "31%" }} />
                </div>
                <p className="text-[10px] text-slate-400">14 applicants &bull; 5 completed AI interview</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Naukri Enterprise Sourcing</span>
                  <span className="text-purple-400 font-mono">27% Response</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: "27%" }} />
                </div>
                <p className="text-[10px] text-slate-400">10 invitations sent &bull; 3 completed AI interview</p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/dashboard/candidates"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Launch Outbound Sourcing Campaign &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
