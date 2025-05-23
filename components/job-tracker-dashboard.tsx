"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanView } from "@/components/kanban-view"
import { ListView } from "@/components/list-view"
import { JobMetrics } from "@/components/job-metrics"
import { AddJobButton } from "@/components/add-job-button"
import type { JobData } from "@/types/job"

export function JobTrackerDashboard() {
  const [jobs, setJobs] = useState<JobData[]>([
    {
      id: "1",
      company: "Google",
      role: "Senior Project Manager",
      location: "Mountain View, CA",
      status: "Applied",
      salary: "$150,000 - $180,000",
      source: "LinkedIn",
      link: "https://careers.google.com",
      dateApplied: "2025-05-10",
      contact: "John Smith, Recruiter",
      notes: "Applied for the cloud infrastructure team",
      documents: ["Resume-PM.pdf"],
    },
    {
      id: "2",
      company: "Microsoft",
      role: "Technical Project Manager",
      location: "Redmond, WA",
      status: "Interview",
      salary: "$140,000 - $170,000",
      source: "Company Website",
      link: "https://careers.microsoft.com",
      dateApplied: "2025-05-05",
      contact: "Sarah Johnson, HR",
      notes: "First interview scheduled for May 20th",
      documents: ["Resume-PM.pdf", "Cover-Letter-Microsoft.pdf"],
    },
    {
      id: "3",
      company: "Amazon",
      role: "Project Manager II",
      location: "Seattle, WA",
      status: "Saved",
      salary: "$130,000 - $160,000",
      source: "Referral",
      link: "https://amazon.jobs",
      dateApplied: "",
      contact: "",
      notes: "Need to prepare tailored resume",
      documents: [],
    },
    {
      id: "4",
      company: "Apple",
      role: "Senior Project Manager",
      location: "Cupertino, CA",
      status: "Offer",
      salary: "$160,000 - $190,000",
      source: "LinkedIn",
      link: "https://apple.com/careers",
      dateApplied: "2025-04-15",
      contact: "Michael Brown, Hiring Manager",
      notes: "Received offer on May 15th, need to respond by May 22nd",
      documents: ["Resume-PM.pdf", "Cover-Letter-Apple.pdf"],
    },
    {
      id: "5",
      company: "Netflix",
      role: "Technical Project Manager",
      location: "Los Gatos, CA",
      status: "Applied",
      salary: "$145,000 - $175,000",
      source: "Indeed",
      link: "https://jobs.netflix.com",
      dateApplied: "2025-05-12",
      contact: "",
      notes: "Applied for the streaming platform team",
      documents: ["Resume-PM.pdf"],
    },
    {
      id: "6",
      company: "Meta",
      role: "Project Manager",
      location: "Menlo Park, CA",
      status: "Assignment",
      salary: "$155,000 - $185,000",
      source: "LinkedIn",
      link: "https://careers.meta.com",
      dateApplied: "2025-05-01",
      contact: "Jessica Lee, Recruiter",
      notes: "Need to complete project management assignment by May 25th",
      documents: ["Resume-PM.pdf", "Cover-Letter-Meta.pdf"],
    },
    {
      id: "7",
      company: "Salesforce",
      role: "Senior Project Manager",
      location: "San Francisco, CA",
      status: "Applied",
      salary: "$145,000 - $175,000",
      source: "Company Website",
      link: "https://salesforce.com/careers",
      dateApplied: "2025-05-15",
      contact: "David Wilson, Recruiter",
      notes: "Applied for the CRM platform team",
      documents: ["Resume-PM.pdf", "Cover-Letter-Salesforce.pdf"],
    },
    {
      id: "8",
      company: "Adobe",
      role: "Technical Project Manager",
      location: "San Jose, CA",
      status: "Interview",
      salary: "$140,000 - $170,000",
      source: "LinkedIn",
      link: "https://adobe.com/careers",
      dateApplied: "2025-05-08",
      contact: "Emily Chen, HR",
      notes: "Second interview scheduled for May 22nd",
      documents: ["Resume-PM.pdf"],
    },
    {
      id: "9",
      company: "Oracle",
      role: "Project Manager",
      location: "Austin, TX",
      status: "Saved",
      salary: "$135,000 - $165,000",
      source: "Indeed",
      link: "https://oracle.com/careers",
      dateApplied: "",
      contact: "",
      notes: "Need to update resume with cloud experience",
      documents: [],
    },
    {
      id: "10",
      company: "IBM",
      role: "Senior Project Manager",
      location: "New York, NY",
      status: "Archived",
      salary: "$150,000 - $180,000",
      source: "Company Website",
      link: "https://ibm.com/careers",
      dateApplied: "2025-05-14",
      contact: "Robert Taylor, Hiring Manager",
      notes: "Applied for the AI/ML division",
      documents: ["Resume-PM.pdf", "Cover-Letter-IBM.pdf"],
    }
  ])

  const addJob = (job: JobData) => {
    setJobs([...jobs, { ...job, id: Date.now().toString() }])
  }

  const updateJob = (updatedJob: JobData) => {
    setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
  }

  const archiveJob = (jobId: string) => {
    setJobs(jobs.map((job) => 
      job.id === jobId ? { ...job, status: "Archived" } : job
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Job Tracker</h1>
        <p className="text-gray-600 text-lg">Track every job you apply to, never lose sight of your progress.</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 pt-8">Welcome back, Ivan!</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <JobMetrics jobs={jobs} />
        <div className="flex-grow flex justify-end items-start">
          <AddJobButton onAddJob={addJob} />
        </div>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanView jobs={jobs} onUpdateJob={updateJob} onArchiveJob={archiveJob} />
        </TabsContent>
        <TabsContent value="list">
          <ListView jobs={jobs} onUpdateJob={updateJob} onArchiveJob={archiveJob} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
