"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit2, Archive } from "lucide-react"
import type { JobData } from "@/types/job"
import { EditJobDialog } from "@/components/edit-job-dialog"

interface JobCardProps {
  job: JobData
  onUpdateJob: (job: JobData) => void
  onArchiveJob: (jobId: string) => void
}

export function JobCard({ job, onUpdateJob, onArchiveJob }: JobCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (updatedJob: JobData) => {
    onUpdateJob(updatedJob)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview":
        return "bg-purple-100 text-purple-800"
      case "Assignment":
        return "bg-amber-100 text-amber-800"
      case "Offer":
        return "bg-emerald-100 text-emerald-800"
      case "Applied":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="mb-2">
            <h4 className="font-semibold text-lg">{job.company}</h4>
          </div>

          <p className="text-gray-700 font-medium mb-4">{job.role}</p>

          {job.salary && (
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Salary:</span> {job.salary.replace(/(\d),(\d{3})/g, "$1K")}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            {job.documents && job.documents.length > 0 && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>
                  {job.documents.length} document{job.documents.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {job.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">{job.notes}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onArchiveJob(job.id)}>
            <Archive className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <EditJobDialog job={job} open={isEditing} onOpenChange={setIsEditing} onSave={handleSave} />
    </>
  )
}
