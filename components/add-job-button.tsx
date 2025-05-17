"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { JobData } from "@/types/job"
import { AddJobDialog } from "@/components/add-job-dialog"

interface AddJobButtonProps {
  onAddJob: (job: JobData) => void
}

export function AddJobButton({ onAddJob }: AddJobButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddJob = (job: JobData) => {
    onAddJob(job)
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
        <Plus className="h-4 w-4 mr-2" /> Add Job
      </Button>

      <AddJobDialog open={isOpen} onOpenChange={setIsOpen} onAddJob={handleAddJob} />
    </>
  )
}
