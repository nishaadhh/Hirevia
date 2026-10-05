import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Video,
  Users,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Play,
  Calendar,
  ChevronRight,
  Globe,
  Layers,
  Star
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-[#0D0E0B] relative overflow-hidden text-white">
      {/* Background Subtle Grid & Neon Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#495462]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start space-y-6">
            {/* Pill Tag in Theme 01 Lime */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#E5F33C] text-[#11120D] text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#11120D] fill-current" />
              <span>HR ONLY ENTERPRISE SAAS</span>
            </div>

            <div className="relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Screen Faster. <br />
                <span className="relative inline-block">
                  Hire Better Talent
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#E5F33C]"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9.5C80 2 220 2 298 9.5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl font-normal leading-relaxed pt-2">
              Autonomous AI video interviews, veteran Senior HR Advisor intelligence, instant Google Meet link generation, and automated LinkedIn outreach — engineered exclusively for modern HR teams.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 w-full">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-7 py-4 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-extrabold text-sm transition-all shadow-xl shadow-[#E5F33C]/20 hover:scale-105 active:scale-95"
              >
                <span>Launch HR Portal</span>
                <ArrowRight className="w-4 h-4 text-[#11120D]" />
              </Link>

              <Link
                href="/dashboard/advisor"
                className="flex items-center space-x-2 px-6 py-4 rounded-2xl bg-[#1B1E16] hover:bg-[#252a1e] text-white hover:text-[#E5F33C] font-bold text-sm transition-all border border-[#495462]/50 hover:border-[#E5F33C]/50 hover:scale-105 active:scale-95"
              >
                <Bot className="w-4 h-4 text-[#E5F33C]" />
                <span>Senior HR AI Advisor</span>
              </Link>

              <Link
                href="/dashboard/interviews/ready"
                className="flex items-center space-x-2 px-6 py-4 rounded-2xl bg-[#495462]/30 hover:bg-[#495462]/50 text-white font-semibold text-sm transition-all border border-[#495462]/40"
              >
                <Video className="w-4 h-4 text-[#E5F33C]" />
                <span>Review Candidates</span>
              </Link>
            </div>

            {/* Micro Metrics in 280k+ / 220k+ Style from Reference */}
            <div className="pt-8 grid grid-cols-3 gap-8 border-t border-[#495462]/30 w-full max-w-xl">
              <div>
                <p className="text-3xl font-black text-white tracking-tight">87%</p>
                <p className="text-xs text-[#9AA6B2] font-semibold mt-1">AI Match Accuracy</p>
              </div>
              <div className="border-l border-[#495462]/30 pl-6">
                <p className="text-3xl font-black text-[#E5F33C] tracking-tight">9.4d</p>
                <p className="text-xs text-[#9AA6B2] font-semibold mt-1">Average Time to Hire</p>
              </div>
              <div className="border-l border-[#495462]/30 pl-6">
                <p className="text-3xl font-black text-white tracking-tight">100%</p>
                <p className="text-xs text-[#9AA6B2] font-semibold mt-1">HR Role Exclusivity</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Modern SaaS UI Device Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#161812] p-6 border-2 border-[#495462]/40 shadow-2xl shadow-black/80 glow-lime">
              {/* Floating Star Badges from Mockup */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#E5F33C] text-[#11120D] flex items-center justify-center font-bold shadow-lg shadow-[#E5F33C]/30 animate-bounce">
                ★
              </div>

              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#495462]/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] p-0.5 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Arjun Kumar"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-extrabold text-base text-white">Arjun Kumar</h3>
                      <ShieldCheck className="w-4 h-4 text-[#E5F33C]" />
                    </div>
                    <p className="text-xs text-[#9AA6B2] font-medium">Senior Full Stack Developer</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#E5F33C] text-[#11120D] font-black text-xs shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>87% Match</span>
                  </span>
                  <p className="text-[10px] text-[#E5F33C] font-semibold mt-1 font-mono">READY FOR HR</p>
                </div>
              </div>

              {/* Highlight Card Block in Lime (Theme 01) like reference mockup */}
              <div className="mt-4 rounded-2xl bg-[#E5F33C] p-5 text-[#11120D] space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                    <span>Autonomous AI Video Assessment</span>
                  </span>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#11120D] text-[#E5F33C]">
                    PASSED
                  </span>
                </div>
                <p className="text-xs text-[#11120D] font-medium leading-relaxed">
                  Candidate successfully completed 4 rigorous technical challenges and cleared behavioral leadership criteria.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs font-bold border-t border-[#11120D]/20">
                  <span>Google Meet Generated</span>
                  <span className="font-mono underline">meet.google.com/xyz-abc</span>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/interviews/ready"
                  className="py-2.5 px-3 rounded-xl bg-[#495462] hover:bg-[#586576] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#E5F33C]" />
                  <span>Watch Video</span>
                </Link>

                <Link
                  href="/dashboard/advisor"
                  className="py-2.5 px-3 rounded-xl bg-[#1B1E16] hover:bg-[#252a1e] border border-[#E5F33C]/40 text-[#E5F33C] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>HR Advisor Chat</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Block in Exact Mockup Style ("Finnen Comes With Amazing Features") */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-[#E5F33C] p-8 sm:p-12 text-[#11120D] shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#11120D] text-[#E5F33C]">
                Enterprise Suite
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Hirevia Comes With Enterprise Superpowers
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#11120D]/80 leading-relaxed">
                Zero candidate-facing overhead, zero multi-role confusion. Everything streamlined for the HR Lead with multi-tenant company isolation.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-[#11120D] text-white space-y-2 border border-[#495462]/30">
                <h4 className="text-sm font-bold text-[#E5F33C]">Senior HR AI Advisor</h4>
                <p className="text-xs text-slate-300">
                  Instant 360° candidate hiring fit, skill breakdown, and 5 targeted interview questions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#11120D] text-white space-y-2 border border-[#495462]/30">
                <h4 className="text-sm font-bold text-[#E5F33C]">Google Meet Integration</h4>
                <p className="text-xs text-slate-300">
                  Direct Google Calendar v3 sync generating unique meeting rooms saved to candidate records.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#11120D] text-white space-y-2 border border-[#495462]/30">
                <h4 className="text-sm font-bold text-[#E5F33C]">Candidate Sourcing Engine</h4>
                <p className="text-xs text-slate-300">
                  PostgreSQL database filtering by YoE, location, skills, and natural language queries.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#11120D] text-white space-y-2 border border-[#495462]/30">
                <h4 className="text-sm font-bold text-[#E5F33C]">LinkedIn Outreach AI</h4>
                <p className="text-xs text-slate-300">
                  AI-personalized outreach messages with 1-click Copy Message and Open LinkedIn actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core HR Modules Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#495462]/30">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#495462]/30 border border-[#495462]/50 text-[#E5F33C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Six Core HR Modules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            See Our Advantages
          </h2>
          <p className="text-sm sm:text-base text-[#9AA6B2] mt-3">
            Pure HR workflow efficiency with enterprise-grade security and multi-tenant isolation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Central HR Dashboard & Priority Alerts</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              Real-time pipeline metrics, automated alert cards for candidates passing AI screening, and one-click direct review actions.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Open Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Module 2 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Senior HR AI Advisor Chatbot</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              10+ year veteran talent intelligence bot with multi-tenant company context. Delivers 360° hiring fit, strengths, red flags, and 5 targeted interview questions.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard/advisor" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Launch HR Advisor</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Candidate Sourcing & Database Filtering</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              Advanced query engine filtering candidate records directly in PostgreSQL by skills, YoE, location, and natural language search.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard/candidates" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Explore Sourcing</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Module 4 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Video Interview Review Studio</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              Automated processing pipeline (`Processing` &rarr; `Analyzing` &rarr; `Ready for HR Review`), secure video player, interactive question bookmarks, and real-time private HR notes.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard/interviews/ready" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Watch AI Interviews</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Module 5 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Google Meet & Calendar API Integration</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              Dynamically generates unique Google Meet links, attaches meetings to candidate records, and renders instant Open and Copy Link actions.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard/candidates" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Schedule Meetings</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Module 6 */}
          <div className="p-6 rounded-3xl bg-[#161812] border border-[#495462]/40 hover:border-[#E5F33C]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Automated LinkedIn Outreach Generator</h3>
            <p className="text-xs text-[#9AA6B2] mt-2 leading-relaxed">
              AI crafts high-conversion personalized outreach messages based on candidate CV and job requirements. Provides 1-click Copy Message and Open LinkedIn actions.
            </p>
            <div className="mt-4 pt-3 border-t border-[#495462]/30">
              <Link href="/dashboard/candidates" className="text-xs text-[#E5F33C] font-bold flex items-center hover:underline">
                <span>Generate Outreach</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#495462]/30 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#9AA6B2]">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-[#E5F33C]" />
          <span className="text-white font-extrabold">Hirevia</span>
          <span>&mdash; Enterprise HR Recruitment Intelligence Portal</span>
        </div>
        <p className="mt-4 sm:mt-0">&copy; 2026 Hirevia Technologies Inc. Built exclusively for HR professionals.</p>
      </footer>
    </div>
  );
}
