"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2
} from "lucide-react";
import { playNotificationTing } from "@/lib/audio";

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Creation Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Core Engineering");
  const [location, setLocation] = useState("San Francisco, CA (or Remote)");
  const [salaryMin, setSalaryMin] = useState(150000);
  const [salaryMax, setSalaryMax] = useState(180000);
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("React, Next.js, Node.js, TypeScript");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const reqSkills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department,
          location,
          salaryMin,
          salaryMax,
          description: description || `We are actively hiring for ${title} to scale our enterprise infrastructure.`,
          requiredSkills: reqSkills,
        }),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        setTitle("");
        fetchJobs();
        playNotificationTing();
      } else {
        alert("Failed to create job opening.");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating job.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0D0E0B] relative pb-16 text-white">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5F33C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#495462]/35">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#E5F33C] uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-[#E5F33C]" />
              <span>Roles & Requisitions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Active Job Openings</h1>
            <p className="text-xs sm:text-sm text-[#9AA6B2]">
              Manage enterprise requisitions, AI screening thresholds, and candidate applicant pipelines.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] text-[#11120D] font-black text-xs flex items-center space-x-2 shadow-lg shadow-[#E5F33C]/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-[#11120D]" />
            <span>Post New Requisition</span>
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-[#161812] border-2 border-[#495462]/40 hover:border-[#E5F33C]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-black text-white">{job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5F33C] text-[#11120D] text-xs font-black">
                    Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9AA6B2]">
                  <span className="text-[#E5F33C] font-semibold">{job.department}</span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9AA6B2]" />
                    <span>{job.location}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1 text-white font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-[#E5F33C]" />
                    <span>
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </span>
                  <span>&bull;</span>
                  <span className="text-white">{job.experienceMin}+ yrs exp</span>
                </div>

                <p className="text-xs text-[#CBD5E1] leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#11120D] border border-[#E5F33C]/35 text-[11px] text-[#E5F33C] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                  {job.preferredSkills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#11120D] border border-[#495462]/40 text-[11px] text-[#9AA6B2] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Card Right Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px] shrink-0">
                <Link
                  href={`/dashboard/candidates?jobId=${job.id}`}
                  className="px-5 py-3 rounded-2xl bg-[#495462] hover:bg-[#586576] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-105"
                >
                  <Users className="w-3.5 h-3.5 text-[#E5F33C]" />
                  <span>Find Matching Talent</span>
                </Link>

                <div className="text-center p-2 rounded-xl bg-[#11120D] border border-[#495462]/30 text-[11px] text-[#9AA6B2]">
                  <span className="font-bold text-[#E5F33C]">{job.applicantsCount || 0}</span> Applicants in Pipeline
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Requisition Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#161812] border-2 border-[#E5F33C]/40 p-6 shadow-2xl glow-lime">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#9AA6B2] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#E5F33C] mb-1">
              <Sparkles className="w-4 h-4 text-[#E5F33C]" />
              <span className="text-xs font-black uppercase tracking-wider">New Position Opening</span>
            </div>
            <h3 className="text-xl font-black text-white">Create Job Requisition</h3>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Machine Learning Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Salary Min ($)</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Salary Max ($)</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                  Required Core Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11120D] border border-[#495462]/40 text-white text-xs focus:outline-none focus:border-[#E5F33C] transition-colors"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#9AA6B2] hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 rounded-2xl bg-[#E5F33C] hover:bg-[#d8e72e] disabled:opacity-50 text-[#11120D] font-black text-xs shadow-md shadow-[#E5F33C]/20 transition-all hover:scale-105"
                >
                  {creating ? "Publishing..." : "Publish Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
