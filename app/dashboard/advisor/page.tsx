"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Video,
  Calendar,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from "lucide-react";
import { playNotificationTing } from "@/lib/audio";
import { ScheduleModal } from "@/components/ScheduleModal";

export default function SeniorHRAdvisorPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Chat conversation
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Welcome Devon. I am your Senior HR Talent Advisor & Systems Architect (10+ years enterprise experience). Select a candidate from your pipeline or ask strategic questions on competency evaluation, interview probing, and offer benchmarking.",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  // Schedule modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      if (res.ok) {
        const data = await res.json();
        const list = data.candidates || [];
        setCandidates(list);
        if (list.length > 0) {
          const target = list.find((c: any) => c.name.includes("Arjun")) || list[0];
          setSelectedCandidateId(target.id);
          setSelectedCandidate(target);
          loadAnalysis(target.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAnalysis = async (candidateId: string) => {
    setLoadingAnalysis(true);
    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    const cand = candidates.find((c) => c.id === id);
    if (cand) {
      setSelectedCandidate(cand);
      loadAnalysis(cand.id);
      playNotificationTing();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Switched context to **${cand.name}** (${cand.headline}). Loaded CV metrics, video assessment scores, and targeted interview questions below.`,
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || sendingChat) return;

    const userText = inputPrompt.trim();
    setInputPrompt("");

    const newMsgs = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    setSendingChat(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs,
          candidateId: selectedCandidateId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        playNotificationTing();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-16 text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#495462]/35">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#E5F33C] uppercase tracking-wider">
              <Bot className="w-4 h-4 text-[#E5F33C]" />
              <span>Senior Talent Partner & Systems Architect AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Senior HR AI Advisor & Dossier Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2]">
              10+ year veteran talent intelligence bot with direct multi-tenant access to company candidate pipelines.
            </p>
          </div>

          {/* Candidate Context Dropdown Selector */}
          <div className="flex items-center space-x-3 bg-[#161812] p-2 rounded-2xl border border-[#495462]/40">
            <span className="text-xs text-[#9AA6B2] pl-2 font-medium">Active Candidate:</span>
            <select
              value={selectedCandidateId}
              onChange={(e) => handleSelectCandidate(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-[#11120D] border border-[#495462]/50 text-white text-xs font-bold focus:outline-none focus:border-[#E5F33C] transition-colors cursor-pointer"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.aiMatchScore}% Match &bull; {c.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Strategic Breakdown Cards */}
          <div className="lg:col-span-7 space-y-6">
            {loadingAnalysis ? (
              <div className="p-12 text-center rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-3">
                <div className="w-10 h-10 border-4 border-[#E5F33C] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#9AA6B2] font-semibold">
                  Synthesizing candidate CV, AI interview recording, and competency benchmarks...
                </p>
              </div>
            ) : analysis ? (
              <>
                {/* 1. Overall Hiring Score & Fit Percentage */}
                <div className="p-6 rounded-3xl bg-[#161812] border-2 border-[#E5F33C]/50 relative overflow-hidden shadow-2xl glow-lime">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#495462]/30">
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs text-[#E5F33C] font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-[#E5F33C]" />
                        <span>Comprehensive HR Hiring Assessment</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {analysis.candidateName} &bull;{" "}
                        <span className="text-[#E5F33C]">{analysis.overallFitPercentage}% Match Fit</span>
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="px-3.5 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs shadow-sm">
                        Strong Hire Recommendation
                      </span>
                    </div>
                  </div>

                  {/* 2. Competency Breakdown: Technical, Leadership, Culture */}
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#495462]/35 text-center">
                      <p className="text-[10px] text-[#9AA6B2] uppercase font-bold">Technical Skills Fit</p>
                      <p className="text-xl font-black text-[#E5F33C] mt-0.5">
                        {analysis.breakdown?.technicalFit}%
                      </p>
                      <p className="text-[10px] text-[#9AA6B2] mt-0.5">Next.js, Node, Postgres</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#495462]/35 text-center">
                      <p className="text-[10px] text-[#9AA6B2] uppercase font-bold">Leadership Potential</p>
                      <p className="text-xl font-black text-white mt-0.5">
                        {analysis.breakdown?.leadershipPotential}%
                      </p>
                      <p className="text-[10px] text-[#9AA6B2] mt-0.5">Mentorship & Sprints</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#495462]/35 text-center">
                      <p className="text-[10px] text-[#9AA6B2] uppercase font-bold">Cultural Fit</p>
                      <p className="text-xl font-black text-[#E5F33C] mt-0.5">
                        {analysis.breakdown?.culturalFit}%
                      </p>
                      <p className="text-[10px] text-[#9AA6B2] mt-0.5">Autonomy & Speed</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#CBD5E1] mt-4 leading-relaxed bg-[#11120D] p-4 rounded-2xl border border-[#495462]/30">
                    {analysis.advisorSummary}
                  </p>
                </div>

                {/* 3. Candidate Strengths & Potential Red Flags */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-5 rounded-3xl bg-[#161812] border border-[#E5F33C]/40 space-y-3">
                    <h3 className="text-xs uppercase font-extrabold text-[#E5F33C] tracking-wider flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#E5F33C]" />
                      <span>Key Verified Strengths</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-[#CBD5E1]">
                      {analysis.strengths?.map((st: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#E5F33C] font-bold">&bull;</span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags / Risk Factors */}
                  <div className="p-5 rounded-3xl bg-[#161812] border border-[#495462]/50 space-y-3">
                    <h3 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Potential Red Flags / Verification</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-[#CBD5E1]">
                      {analysis.redFlags?.map((rf: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span className="leading-relaxed">{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Five Targeted Technical & Behavioral HR Interview Questions */}
                <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white font-extrabold text-sm">
                      <Award className="w-4 h-4 text-[#E5F33C]" />
                      <span className="uppercase tracking-wider">
                        5 Targeted Technical & Behavioral HR Questions
                      </span>
                    </div>
                    <span className="text-[11px] text-[#9AA6B2] font-semibold">With Listening Criteria</span>
                  </div>

                  <div className="space-y-3">
                    {analysis.targetedQuestions?.map((q: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#11120D] border border-[#495462]/35 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#E5F33C] text-[#11120D]">
                            Q{idx + 1} &bull; {q.type}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed">{q.question}</p>
                        <div className="p-2.5 rounded-xl bg-[#161812] border border-[#495462]/30 text-[11px] text-[#9AA6B2]">
                          <span className="text-[#E5F33C] font-bold">What to Listen For: </span>
                          <span className="text-[#CBD5E1]">{q.whatToListenFor}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#E5F33C]/20 transition-all hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 text-[#11120D]" />
                      <span>Schedule HR Round with Google Meet</span>
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Right Column: Senior HR AI Chat Stream */}
          <div className="lg:col-span-5 rounded-3xl border border-[#495462]/40 flex flex-col h-[750px] shadow-2xl bg-[#161812] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#495462]/30 flex items-center justify-between bg-[#11120D]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center font-black shadow-md">
                  <Bot className="w-4 h-4 text-[#11120D]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Senior HR Partner Assistant</h3>
                  <p className="text-[10px] text-[#E5F33C] flex items-center space-x-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5F33C] animate-ping" />
                    <span>Candidate context loaded</span>
                  </p>
                </div>
              </div>

              {selectedCandidate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F33C]/15 text-[#E5F33C] border border-[#E5F33C]/30">
                  {selectedCandidate.name}
                </span>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-md ${
                      m.role === "user"
                        ? "bg-[#E5F33C] text-[#11120D] rounded-br-sm font-semibold"
                        : "bg-[#11120D] text-slate-100 border border-[#495462]/40 rounded-bl-sm"
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-75 mb-1">
                      {m.role === "user" ? "Devon Miller (Lead HR)" : "Senior HR Advisor (AI)"}
                    </div>
                    <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-[#11120D] border border-[#495462]/40 text-xs text-[#E5F33C] flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-[#E5F33C] border-t-transparent rounded-full animate-spin" />
                    <span>Advisor evaluating candidate pipeline & formulating guidance...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-4 py-2 border-t border-[#495462]/30 bg-[#11120D] flex items-center space-x-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setInputPrompt("Should we extend an offer to this candidate?")}
                className="px-2.5 py-1 rounded-lg bg-[#161812] hover:bg-[#252a1e] border border-[#495462]/40 text-[10px] text-[#E5F33C] whitespace-nowrap transition-colors font-semibold"
              >
                Hire Decision?
              </button>
              <button
                type="button"
                onClick={() => setInputPrompt("What potential red flags should I watch out for?")}
                className="px-2.5 py-1 rounded-lg bg-[#161812] hover:bg-[#252a1e] border border-[#495462]/40 text-[10px] text-[#CBD5E1] whitespace-nowrap transition-colors"
              >
                Red Flags?
              </button>
              <button
                type="button"
                onClick={() => setInputPrompt("How should I probe on distributed systems in the HR round?")}
                className="px-2.5 py-1 rounded-lg bg-[#161812] hover:bg-[#252a1e] border border-[#495462]/40 text-[10px] text-[#CBD5E1] whitespace-nowrap transition-colors"
              >
                Probe Technical?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[#495462]/30 bg-[#11120D]">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask advisor about fit, red flags, comp band, or questions..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#161812] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                />
                <button
                  type="submit"
                  disabled={sendingChat || !inputPrompt.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] disabled:opacity-50 text-[#11120D] text-xs font-black flex items-center space-x-1.5 shadow-md shadow-[#E5F33C]/20 transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5 text-[#11120D]" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <ScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          candidateName={selectedCandidate.name}
          candidateProfileId={selectedCandidate.id}
          jobTitle={selectedCandidate.headline}
        />
      )}
    </div>
  );
}
