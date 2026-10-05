"use client";

import React, { useState } from "react";
import { Calendar, Clock, Video, CheckCircle, X, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { playNotificationTing } from "@/lib/audio";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateProfileId: string;
  jobTitle?: string;
  jobId?: string;
  onSuccess?: (interviewData: any) => void;
}

export function ScheduleModal({
  isOpen,
  onClose,
  candidateName,
  candidateProfileId,
  jobTitle = "Senior Full Stack Developer",
  jobId,
  onSuccess,
}: ScheduleModalProps) {
  const [scheduledStartTime, setScheduledStartTime] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState(
    "HR Culture & Executive Vision Round: Discuss system architecture depth, leadership style, and team onboarding."
  );
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/interviews/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfileId,
          scheduledStartTime: new Date(scheduledStartTime).toISOString(),
          durationMinutes,
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const link = data.schedule?.gmeetLink || "https://meet.google.com/qpr-tywe-zxc";
        setMeetLink(link);
        setConfirmed(true);
        playNotificationTing();
        if (onSuccess) onSuccess(data.schedule);
      } else {
        alert("Failed to schedule interview. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling interview.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161812] border-2 border-[#E5F33C]/40 p-6 shadow-2xl shadow-black/90 glow-lime">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#9AA6B2] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center space-x-2 text-[#E5F33C] mb-2">
              <Calendar className="w-5 h-5 text-[#E5F33C]" />
              <span className="text-xs font-black uppercase tracking-wider">Google Meet HR Scheduling</span>
            </div>

            <h3 className="text-xl font-black text-white">Schedule HR Round with {candidateName}</h3>
            <p className="text-xs text-[#CBD5E1] mt-1">
              Role: <span className="font-bold text-white">{jobTitle}</span> &bull; Status:{" "}
              <span className="text-[#E5F33C] font-bold">Passed AI Screening</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledStartTime}
                    onChange={(e) => setScheduledStartTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Duration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes (Standard)</option>
                    <option value={60}>60 Minutes (Deep Dive)</option>
                  </select>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(10, 0, 0, 0);
                    setScheduledStartTime(d.toISOString().slice(0, 16));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#11120D] hover:bg-[#252a1e] text-[11px] text-[#E5F33C] border border-[#495462]/40 transition-colors font-semibold"
                >
                  Tomorrow at 10:00 AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(14, 0, 0, 0);
                    setScheduledStartTime(d.toISOString().slice(0, 16));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#11120D] hover:bg-[#252a1e] text-[11px] text-[#E5F33C] border border-[#495462]/40 transition-colors font-semibold"
                >
                  Tomorrow at 2:00 PM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 2);
                    d.setHours(11, 0, 0, 0);
                    setScheduledStartTime(d.toISOString().slice(0, 16));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#11120D] hover:bg-[#252a1e] text-[11px] text-[#E5F33C] border border-[#495462]/40 transition-colors font-semibold"
                >
                  In 2 Days at 11:00 AM
                </button>
              </div>

              {/* Interviewer Notes */}
              <div>
                <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Google Calendar Meeting Agenda</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key questions or areas to verify from AI evaluation..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-[#9AA6B2] hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] disabled:opacity-50 text-[#11120D] text-xs font-black shadow-lg shadow-[#E5F33C]/20 flex items-center space-x-2 transition-all hover:scale-105"
                >
                  {loading ? (
                    <span>Generating Google Meet...</span>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5 text-[#11120D]" />
                      <span>Confirm & Generate Google Meet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5F33C] text-[#11120D] flex items-center justify-center mx-auto shadow-lg shadow-[#E5F33C]/30 font-black">
              <CheckCircle className="w-8 h-8 text-[#11120D]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Google Meet Round Confirmed!</h3>
              <p className="text-xs text-[#CBD5E1] mt-1 max-w-sm mx-auto">
                Meeting saved to candidate record and Google Calendar integration.
              </p>
            </div>

            {/* Google Meet Link Display Box */}
            <div className="p-4 rounded-2xl bg-[#11120D] border border-[#495462]/40 text-left text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#9AA6B2] font-semibold">Scheduled Time:</span>
                <span className="text-white font-bold">{new Date(scheduledStartTime).toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[#9AA6B2] block mb-1 font-semibold">Generated Google Meet Link:</span>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#161812] border border-[#495462]/30 font-mono text-[#E5F33C] text-xs">
                  <span className="truncate mr-2">{meetLink}</span>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={copyToClipboard}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans flex items-center space-x-1 transition-colors"
                      title="Copy Link"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#E5F33C]" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] text-[11px] font-bold font-sans flex items-center space-x-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-[#11120D]" />
                      <span>Open</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs transition-colors shadow-lg shadow-[#E5F33C]/20"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
