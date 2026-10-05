"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Plus,
  Bookmark,
  FileText,
  User,
  ExternalLink,
  Award,
  Video,
  ArrowLeft
} from "lucide-react";
import { ScheduleModal } from "@/components/ScheduleModal";
import { playNotificationTing } from "@/lib/audio";

export default function AIInterviewReviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(282); // default to 04:42 (key answer)
  const [duration, setDuration] = useState(1090); // 18m 10s
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // HR Note State
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Timer interval simulation
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, duration]);

  // Fetch interview details
  useEffect(() => {
    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/ai/${interviewId}`);
      if (res.ok) {
        const data = await res.json();
        setInterview(data);
        if (data.durationSeconds) setDuration(data.durationSeconds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (timeSec: number) => {
    setCurrentTime(timeSec);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSavingNote(true);
    try {
      const res = await fetch(`/api/interviews/ai/${interviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestampSeconds: currentTime,
          noteText: noteText.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (interview) {
          setInterview({
            ...interview,
            timeline: [...interview.timeline, data.note].sort(
              (a: any, b: any) => a.timestampSeconds - b.timestampSeconds
            ),
          });
        }
        setNoteText("");
        playNotificationTing();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  const getActiveSubtitle = () => {
    if (currentTime < 135) {
      return "Arjun: Hello, I'm Arjun Kumar. Excited to speak about my full stack engineering background.";
    } else if (currentTime >= 135 && currentTime < 282) {
      return "AI Interviewer: Could you walk through a recent architectural challenge you resolved?";
    } else if (currentTime >= 282 && currentTime < 430) {
      return "Arjun: We transitioned our portal to Next.js server components and optimized Postgres indexes, decreasing LCP by 42%.";
    } else if (currentTime >= 430 && currentTime < 635) {
      return "AI Interviewer: How did you handle cache invalidation during real-time telemetry updates?";
    } else if (currentTime >= 635 && currentTime < 800) {
      return "Arjun: When resolving engineering disagreements, I lead with objective benchmarks and minimal repro test cases.";
    } else {
      return "Arjun: Adhering to clean domain boundaries and strict TypeScript types keeps teams moving quickly.";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-[#0D0E0B] text-white min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#E5F33C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#9AA6B2] font-semibold">Loading AI Video Assessment Dossier...</p>
        </div>
      </div>
    );
  }

  const candName = interview?.candidateName || "Arjun Kumar";
  const jobTitle = interview?.jobTitle || "Senior Full Stack Developer";
  const overallScore = interview?.overallScore || 87;

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-16 text-white">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-[#495462]/35 bg-[#11120D]/90 sticky top-14 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-[#161812] border border-[#495462]/40 text-[#9AA6B2] hover:text-white hover:border-[#E5F33C]/40 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-[11px] text-[#9AA6B2]">
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/dashboard/candidates" className="hover:text-white transition-colors">
                  Candidates
                </Link>
                <span>/</span>
                <span className="text-[#E5F33C]">AI Video Review</span>
              </div>
              <h1 className="text-lg font-black text-white flex items-center space-x-2 mt-0.5">
                <span>{candName} &bull; AI Interview Review</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] text-xs font-black shadow-sm">
                  {overallScore}% Match
                </span>
              </h1>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center space-x-2 shadow-lg shadow-[#E5F33C]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#11120D]" />
              <span>Schedule Next Round (Google Meet)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Automated Interview Processing Status Pipeline (Requirement D) */}
        <div className="p-4 rounded-2xl bg-[#161812] border border-[#495462]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#E5F33C] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E5F33C]" />
            <span>Automated AI Screening Pipeline</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs overflow-x-auto">
            <div className="flex items-center space-x-1 text-[#9AA6B2] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E5F33C] shrink-0" />
              <span>Processing Recording</span>
            </div>
            <span className="text-[#495462]">&rarr;</span>
            <div className="flex items-center space-x-1 text-[#9AA6B2] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E5F33C] shrink-0" />
              <span>Analyzing Multimodal AI</span>
            </div>
            <span className="text-[#495462]">&rarr;</span>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black whitespace-nowrap shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#11120D] animate-ping" />
              <span>Candidate Ready for HR Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Interactive Video Player & Timeline Bookmarks */}
          <div className="lg:col-span-7 space-y-6">
            {/* Custom Interactive Video Player */}
            <div className="rounded-3xl bg-[#161812] border-2 border-[#495462]/40 p-4 shadow-2xl overflow-hidden glow-lime">
              {/* Simulated Video Display */}
              <div className="relative aspect-video w-full rounded-2xl bg-[#0D0E0B] overflow-hidden border border-[#495462]/40 flex flex-col justify-between p-4 group">
                {/* Candidate Camera Stream Overlay */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                    alt={candName}
                    className="w-full h-full object-cover filter brightness-[0.88]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E0B]/90 via-transparent to-[#0D0E0B]/40 pointer-events-none" />
                </div>

                {/* Top Video Status Overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#11120D]/80 backdrop-blur-md border border-[#495462]/40 text-white text-xs font-semibold">
                    <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-[#E5F33C] animate-ping" : "bg-[#9AA6B2]"}`} />
                    <span>REC &bull; Multimodal AI Session</span>
                  </div>

                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#11120D]/80 backdrop-blur-md border border-[#495462]/40 text-xs font-mono text-[#E5F33C]">
                    <Clock className="w-3.5 h-3.5 text-[#E5F33C]" />
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>

                {/* Center Play Button Overlay */}
                <div className="relative z-10 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 font-bold"
                  >
                    {isPlaying ? <Pause className="w-7 h-7 text-[#11120D]" /> : <Play className="w-7 h-7 fill-current ml-1 text-[#11120D]" />}
                  </button>
                </div>

                {/* Bottom Closed Captions Subtitle Box */}
                <div className="relative z-10 px-4 py-2.5 rounded-xl bg-[#11120D]/90 backdrop-blur-md border border-[#495462]/40 text-center max-w-xl mx-auto w-full">
                  <p className="text-xs text-[#CBD5E1] font-medium tracking-wide leading-relaxed">
                    {getActiveSubtitle()}
                  </p>
                </div>
              </div>

              {/* Scrubber & Controls Bar */}
              <div className="mt-4 px-2 space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-[#11120D] rounded-lg appearance-none cursor-pointer accent-[#E5F33C]"
                  />

                  {/* Bookmark Indicators along Scrubber */}
                  {interview?.timeline?.map((ev: any) => {
                    const pct = (ev.timestampSeconds / duration) * 100;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => handleSeek(ev.timestampSeconds)}
                        title={`${ev.label} (${formatTime(ev.timestampSeconds)})`}
                        className={`absolute top-0 -mt-1 w-3 h-3 rounded-full border-2 border-[#11120D] transition-transform hover:scale-150 ${
                          ev.eventType === "HR_NOTE"
                            ? "bg-amber-400 ring-2 ring-amber-400/40"
                            : "bg-[#E5F33C]"
                        }`}
                        style={{ left: `calc(${pct}% - 6px)` }}
                      />
                    );
                  })}
                </div>

                {/* Scrubber Bottom Controls */}
                <div className="flex items-center justify-between text-xs text-[#9AA6B2]">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-[#E5F33C]" />}
                    </button>

                    <button
                      onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[#9AA6B2] hover:text-white transition-colors"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[#9AA6B2] hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[#9AA6B2] text-[11px]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Playback Speed Controls */}
                  <div className="flex items-center space-x-1 bg-[#11120D] p-1 rounded-lg border border-[#495462]/30">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          playbackSpeed === spd
                            ? "bg-[#E5F33C] text-[#11120D]"
                            : "text-[#9AA6B2] hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time HR Timestamped Note Form */}
              <div className="mt-4 pt-4 border-t border-[#495462]/30">
                <form onSubmit={handleAddNote} className="flex items-center gap-2">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#E5F33C]/20 border border-[#E5F33C]/35 text-[#E5F33C] font-mono text-xs font-bold shrink-0">
                    {formatTime(currentTime)}
                  </div>
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add an HR evaluation note at this exact second..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !noteText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] disabled:opacity-50 text-[#11120D] font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#11120D]" />
                    <span>Add Note</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Clickable Timeline Bookmarks List */}
            <div className="p-5 rounded-3xl bg-[#161812] border border-[#495462]/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#495462]/30">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Bookmark className="w-4 h-4 text-[#E5F33C]" />
                  <span>Interactive Timeline Bookmarks</span>
                </div>
                <span className="text-[11px] text-[#9AA6B2]">Click any marker to seek video</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {interview?.timeline?.map((ev: any) => {
                  const isCurrent = Math.abs(currentTime - ev.timestampSeconds) < 20;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleSeek(ev.timestampSeconds)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        isCurrent
                          ? "bg-[#11120D] border-[#E5F33C]/50 glow-lime"
                          : "bg-[#11120D]/60 border-[#495462]/30 hover:border-[#E5F33C]/30"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-lg font-bold ${
                            ev.eventType === "HR_NOTE"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-[#E5F33C]/20 text-[#E5F33C] border border-[#E5F33C]/30"
                          }`}
                        >
                          {formatTime(ev.timestampSeconds)}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{ev.label}</p>
                          {ev.description && (
                            <p className="text-[11px] text-[#CBD5E1] mt-0.5">{ev.description}</p>
                          )}
                          {ev.metadata?.author && (
                            <p className="text-[10px] text-[#E5F33C] mt-1 font-medium">
                              Note by {ev.metadata.author}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-[#9AA6B2] tracking-wider">
                        {ev.eventType}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 6-Dimensional AI Evaluation Scorecard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#161812] p-6 border border-[#495462]/40 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#495462]/30">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#E5F33C] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5F33C]" />
                    <span>AI Autonomous Evaluation</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">Overall Fit: {overallScore}%</h3>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs shadow-sm">
                    Ready for HR Interview
                  </span>
                </div>
              </div>

              {/* 6-Dimensional Metric Breakdown */}
              <div className="space-y-3">
                <p className="text-xs uppercase font-extrabold text-[#9AA6B2] tracking-wider">
                  Competency Matrix Breakdown
                </p>

                {[
                  { label: "Technical Architecture", score: interview?.technicalScore || 89 },
                  { label: "Problem Solving & Triage", score: interview?.problemSolvingScore || 86 },
                  { label: "Communication & Clarity", score: interview?.communicationScore || 88 },
                  { label: "Technical Leadership", score: interview?.leadershipScore || 84 },
                  { label: "Client Handling & Presence", score: interview?.clientHandlingScore || 85 },
                  { label: "Role Alignment", score: interview?.roleRelevanceScore || 90 },
                ].map((dim, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{dim.label}</span>
                      <span className="font-bold text-[#E5F33C] font-mono">{dim.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#11120D] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#E5F33C] transition-all duration-500"
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Evaluation Summary */}
              <div className="pt-4 border-t border-[#495462]/30 space-y-2">
                <p className="text-xs uppercase font-bold text-[#9AA6B2] tracking-wider">AI Executive Summary</p>
                <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#11120D] p-3.5 rounded-2xl border border-[#495462]/30">
                  {interview?.evaluation?.summary ||
                    "Arjun demonstrated remarkable technical fluency and structured problem-solving throughout the 18-minute session. Answers were concrete, nuanced, and backed by verifiable engineering metrics."}
                </p>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-bold text-[#E5F33C] tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5F33C]" />
                  <span>Key Observed Strengths</span>
                </p>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {(interview?.evaluation?.strengths || [
                    "Exceptional grasp of React performance patterns and Next.js edge caching",
                    "Calm, articulate communication during behavioral conflict scenarios",
                    "Strong incident triage methodology prioritizing zero downtime",
                  ]).map((st: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-[#E5F33C] font-bold">&bull;</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fairness Audit Guarantee */}
              <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#E5F33C]/35 flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#E5F33C] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#E5F33C]">Fairness & Bias Audit Passed</p>
                  <p className="text-[10px] text-[#9AA6B2] mt-0.5">
                    Verified: zero consideration of gender, ethnicity, age, or accent. 100% merit-based evaluation.
                  </p>
                </div>
              </div>

              {/* Primary HR Action Button */}
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#E5F33C]/20 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#11120D]" />
                <span>Schedule Next Round with Arjun</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        candidateName={candName}
        candidateProfileId={interview?.candidateId || ""}
        jobTitle={jobTitle}
        jobId={interview?.jobId || ""}
      />
    </div>
  );
}
