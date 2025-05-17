"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Archive, FileText } from "lucide-react"
import type { JobData } from "@/types/job"
import { EditJobDialog } from "@/components/edit-job-dialog"

interface ListViewProps {
  jobs: JobData[]
  onUpdateJob: (job: JobData) => void
  onArchiveJob: (jobId: string) => void
}

export function ListView({ jobs, onUpdateJob, onArchiveJob }: ListViewProps) {
  const [editingJob, setEditingJob] = useState<JobData | null>(null)

  const handleEdit = (job: JobData) => {
    setEditingJob(job)
  }

  const handleSave = (job: JobData) => {
    onUpdateJob(job)
    setEditingJob(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Saved":
        return "bg-gray-200 text-gray-800"
      case "Applied":
        return "bg-blue-100 text-blue-800"
      case "Interview":
        return "bg-purple-100 text-purple-800"
      case "Assignment":
        return "bg-amber-100 text-amber-800"
      case "Offer":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.company}</TableCell>
              <TableCell>{job.role}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              </TableCell>
              <TableCell>{job.dateApplied || "—"}</TableCell>
              <TableCell>
                {job.documents && job.documents.length > 0 ? (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{job.documents.length}</span>
                  </div>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(job)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onArchiveJob(job.id)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingJob && (
        <EditJobDialog
          job={editingJob}
          open={!!editingJob}
          onOpenChange={() => setEditingJob(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
