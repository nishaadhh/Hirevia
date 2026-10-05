"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Users,
  Briefcase,
  Video,
  Bot,
  BarChart3,
  Bell,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers
} from "lucide-react";
import { playNotificationTing } from "@/lib/audio";

export function Navbar() {
  const pathname = usePathname();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playNotificationTing();
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Sparkles },
    { label: "AI Chatbot", href: "/dashboard/advisor", icon: Bot, highlight: true },
    { label: "Candidates", href: "/dashboard/candidates", icon: Users },
    { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { label: "AI Interview Review", href: "/dashboard/interviews/ready", icon: Video },
    { label: "Squad Builder", href: "/dashboard/team-builder", icon: Layers },
    { label: "Analytics & Audit", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#495462]/35 px-4 lg:px-8 py-3 bg-[#11120D]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center shadow-lg shadow-[#E5F33C]/20 group-hover:scale-105 transition-transform font-black">
              <Bot className="w-5 h-5 text-[#11120D]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Hirevia</span>
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] shadow-sm">
                  HR ONLY
                </span>
              </div>
              <p className="text-[11px] text-[#9AA6B2] font-medium">Acme AI Corp &bull; Talent Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 pl-4 border-l border-[#495462]/30">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#E5F33C] text-[#11120D] shadow-md shadow-[#E5F33C]/20"
                      : link.highlight
                      ? "bg-[#1E2319] text-[#E5F33C] border border-[#E5F33C]/35 hover:bg-[#E5F33C]/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#11120D]" : link.highlight ? "text-[#E5F33C] animate-pulse" : ""}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Sound, Notification Alert, Strictly HR Profile */}
        <div className="flex items-center space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Audio ON" : "Audio OFF"}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? "bg-[#E5F33C]/15 border-[#E5F33C]/40 text-[#E5F33C] hover:bg-[#E5F33C]/25"
                : "bg-[#1B1E16] border-[#495462]/30 text-slate-500 hover:text-slate-300"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notificationsOpen && soundEnabled) playNotificationTing();
              }}
              className="relative p-2 rounded-xl bg-[#1B1E16] border border-[#495462]/40 text-slate-300 hover:text-white transition-all hover:border-[#E5F33C]/40"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5F33C] text-[10px] font-black text-[#11120D] rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-3xl glass-panel p-5 shadow-2xl border border-[#495462]/40 z-50 bg-[#161812]">
                <div className="flex items-center justify-between pb-3 border-b border-[#495462]/30">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">HR Notifications</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5F33C]/20 text-[#E5F33C] font-bold border border-[#E5F33C]/30">
                      1 Priority Alert
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-[#E5F33C] hover:underline font-semibold"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="py-2 space-y-2">
                  <div className="p-3.5 rounded-2xl bg-[#11120D] border border-[#E5F33C]/35">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-white">Candidate Ready for HR Review</p>
                      <span className="text-[10px] text-[#E5F33C] font-mono">LIVE</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Arjun Kumar has passed the AI Video Interview with an 87% match score for Senior Full Stack Developer.
                    </p>
                    <Link
                      href="/dashboard/interviews/ready"
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-flex items-center space-x-1.5 text-xs text-[#E5F33C] font-bold mt-2 hover:underline"
                    >
                      <span>Review Video & Notes</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Strictly HR User Profile Pill */}
          <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl bg-[#1B1E16] border border-[#495462]/40">
            <div className="w-8 h-8 rounded-xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center font-black text-xs shadow-md">
              DM
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white leading-none">Devon Miller</span>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-[#E5F33C] text-[#11120D]">
                  HR LEAD
                </span>
              </div>
              <p className="text-[10px] text-[#9AA6B2] leading-none mt-1">Acme AI Corp</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
