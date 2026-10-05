"use client";

import React, { useState, useEffect } from "react";
import { Send, Globe, Mail, Sparkles, CheckCircle2, X, Copy, Check, ExternalLink } from "lucide-react";
import { playNotificationTing } from "@/lib/audio";

interface OutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateProfileId: string;
  candidateHeadline?: string;
  candidateSkills?: string[];
  jobTitle?: string;
  onSuccess?: () => void;
}

export function OutreachModal({
  isOpen,
  onClose,
  candidateName,
  candidateProfileId,
  candidateHeadline = "Senior Full Stack Engineer",
  candidateSkills = ["React", "Node.js", "System Design"],
  jobTitle = "Senior Full Stack Developer",
  onSuccess,
}: OutreachModalProps) {
  const [platform, setPlatform] = useState<"LINKEDIN" | "EMAIL">("LINKEDIN");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchOutreachTemplate();
    }
  }, [isOpen, candidateProfileId, platform]);

  const fetchOutreachTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/candidates/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfileId,
          platform,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.personalizedMessage || "");
        setLinkedInUrl(
          data.linkedInSearchUrl ||
            `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(candidateName)}`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    playNotificationTing();
    setTimeout(() => setCopied(false), 2000);
  };

  const openLinkedInProfile = () => {
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161812] border-2 border-[#E5F33C]/40 p-6 shadow-2xl shadow-black/90 glow-lime">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#9AA6B2] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-[#E5F33C] mb-2">
            <Sparkles className="w-4 h-4 text-[#E5F33C]" />
            <span className="text-xs font-black uppercase tracking-wider">Automated LinkedIn Outreach Generator</span>
          </div>

          <h3 className="text-xl font-black text-white">Send Interview Request to {candidateName}</h3>
          <p className="text-xs text-[#CBD5E1] mt-1">
            Candidate: <span className="text-white font-bold">{candidateHeadline}</span> &bull; Role:{" "}
            <span className="text-[#E5F33C] font-bold">{jobTitle}</span>
          </p>

          {/* Platform Tab Buttons */}
          <div className="flex items-center space-x-2 mt-4 p-1 rounded-2xl bg-[#11120D] border border-[#495462]/40">
            <button
              type="button"
              onClick={() => setPlatform("LINKEDIN")}
              className={`flex-1 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all ${
                platform === "LINKEDIN"
                  ? "bg-[#E5F33C] text-[#11120D] shadow-md font-black"
                  : "text-[#9AA6B2] hover:text-white font-bold"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>LinkedIn InMail / DM</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatform("EMAIL")}
              className={`flex-1 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all ${
                platform === "EMAIL"
                  ? "bg-[#E5F33C] text-[#11120D] shadow-md font-black"
                  : "text-[#9AA6B2] hover:text-white font-bold"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Email</span>
            </button>
          </div>

          {/* Message Area */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#CBD5E1]">Personalized Message</label>
              <span className="text-[10px] text-[#E5F33C] font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#E5F33C]" />
                <span>AI Tailored for {candidateName}</span>
              </span>
            </div>

            <textarea
              rows={8}
              value={loading ? "Generating tailored outreach message with OpenAI GPT-4..." : message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-[#11120D] border border-[#495462]/40 text-white text-xs leading-relaxed focus:outline-none focus:border-[#E5F33C] transition-colors resize-none font-sans"
            />
          </div>

          {/* Action Buttons: Copy Message & Open LinkedIn */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#495462]/30 mt-4">
            <button
              type="button"
              onClick={copyMessage}
              className="px-4 py-2.5 rounded-xl bg-[#495462] hover:bg-[#586576] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#E5F33C]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Message Copied!" : "Copy Message"}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={openLinkedInProfile}
                className="px-5 py-2.5 rounded-xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-[#E5F33C]/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#11120D]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
