"use client"
import { JobCard } from "@/components/job-card"
import type { JobData } from "@/types/job"
import { useState } from "react"
import { AddJobDialog } from "@/components/add-job-dialog"

interface KanbanViewProps {
  jobs: JobData[]
  onUpdateJob: (job: JobData) => void
  onArchiveJob: (jobId: string) => void
}

export function KanbanView({ jobs, onUpdateJob, onArchiveJob }: KanbanViewProps) {
  const statuses = ["Saved", "Applied", "Interview", "Assignment", "Offer"]
  const [draggedJob, setDraggedJob] = useState<JobData | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [prefilledStatus, setPrefilledStatus] = useState<string>("Saved")

  const handleDragStart = (job: JobData) => {
    setDraggedJob(job)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    if (draggedJob && draggedJob.status !== targetStatus) {
      const updatedJob = { ...draggedJob, status: targetStatus }
      onUpdateJob(updatedJob)
    }
    setDraggedJob(null)
  }

  const handleAddJob = (job: JobData) => {
    onUpdateJob(job)
    setIsAddDialogOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {statuses.map((status) => (
          <div key={status} className="flex flex-col">
            <h3
              className={`text-lg font-semibold mb-4 flex items-center justify-between ${
                status === "Interview"
                  ? "text-purple-600"
                  : status === "Assignment"
                    ? "text-amber-500"
                    : status === "Offer"
                      ? "text-emerald-500"
                      : status === "Applied"
                        ? "text-blue-600"
                        : "text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {status}
                <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {jobs.filter((job) => job.status === status).length}
                </span>
              </div>
              <button
                onClick={() => {
                  setPrefilledStatus(status)
                  setIsAddDialogOpen(true)
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </h3>
            <div
              className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex-grow"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {jobs
                .filter((job) => job.status === status)
                .map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={() => handleDragStart(job)}
                    onDragEnd={() => setDraggedJob(null)}
                    className="mb-4 cursor-move transition-shadow duration-200 hover:shadow-md active:shadow-lg"
                    style={{ opacity: draggedJob && draggedJob.id === job.id ? 0 : 1 }}
                  >
                    <JobCard job={job} onUpdateJob={onUpdateJob} onArchiveJob={onArchiveJob} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <AddJobDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddJob={handleAddJob}
        initialStatus={prefilledStatus}
      />
    </>
  )
}
