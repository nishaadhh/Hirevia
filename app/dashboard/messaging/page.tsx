"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
  Paperclip,
  CheckCheck
} from "lucide-react";
import { playNotificationTing } from "@/lib/audio";
import { ScheduleModal } from "@/components/ScheduleModal";

export default function MessagingPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Schedule modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        const convList = data.conversations || [];
        setConversations(convList);
        if (convList.length > 0 && !activeConv) {
          setActiveConv(convList[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    setSending(true);
    const content = inputText.trim();
    setInputText("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        playNotificationTing();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0a0d14] relative flex flex-col h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full flex-1 flex flex-col">
        {/* Main Messenger Container */}
        <div className="flex-1 rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl">
          {/* Left: Conversations Thread List */}
          <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-slate-950/40">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Direct Messages</h2>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">
                {conversations.length} Threads
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {conversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`p-4 cursor-pointer transition-colors flex items-start space-x-3 ${
                      isSelected
                        ? "bg-indigo-600/20 border-l-4 border-indigo-500"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <img
                      src={
                        conv.candidateAvatar ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={conv.candidateName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{conv.candidateName}</h4>
                        <span className="text-[10px] text-slate-500">2h ago</span>
                      </div>
                      <p className="text-[11px] text-indigo-300 truncate mt-0.5">{conv.subject}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Stream */}
          <div className="flex-1 flex flex-col bg-slate-900/30">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        activeConv.candidateAvatar ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={activeConv.candidateName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white">{activeConv.candidateName}</h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                          87% AI Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{activeConv.candidateHeadline}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Next Round</span>
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m) => {
                    const isMe = m.senderRole === "RECRUITER" || m.senderRole === "COMPANY_ADMIN";
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl p-4 space-y-1.5 shadow-md ${
                            isMe
                              ? "bg-indigo-600 text-white rounded-br-sm"
                              : "bg-slate-800/90 text-slate-100 rounded-bl-sm border border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between space-x-3 text-[10px] opacity-80">
                            <span className="font-semibold">{m.senderName}</span>
                            <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{m.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer */}
                <div className="p-4 border-t border-white/10 bg-slate-950/60">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message to candidate..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={sending || !inputText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select a conversation thread to view messages.
              </div>
            )}
          </div>
        </div>
      </div>

      {activeConv && (
        <ScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          candidateName={activeConv.candidateName}
          candidateProfileId={activeConv.candidateId}
          jobTitle="Senior Full Stack Developer"
        />
      )}
    </div>
  );
}
