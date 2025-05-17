"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobData } from "@/types/job"
import { useState, useEffect } from "react"
import { DocumentSelector } from "@/components/document-selector"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface EditJobDialogProps {
  job: JobData
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (job: JobData) => void
}

export function EditJobDialog({ job, open, onOpenChange, onSave }: EditJobDialogProps) {
  const [editedJob, setEditedJob] = useState<JobData>(job)

  useEffect(() => {
    setEditedJob(job)
  }, [job])

  const handleChange = (field: keyof JobData, value: string | string[]) => {
    setEditedJob({ ...editedJob, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedJob)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editedJob.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role/Position</Label>
                  <Input
                    id="edit-role"
                    value={editedJob.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Salary Range</Label>
                  <Input
                    id="edit-salary"
                    value={editedJob.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editedJob.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saved">Saved</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Assignment">Assignment</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-source">Source</Label>
                  <Input
                    id="edit-source"
                    value={editedJob.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-link">Job Link</Label>
                  <Input id="edit-link" value={editedJob.link} onChange={(e) => handleChange("link", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Person</Label>
                <Input
                  id="edit-contact"
                  value={editedJob.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentSelector
                documents={editedJob.documents || []}
                onDocumentsChange={(documents) => handleChange("documents", documents)}
              />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editedJob.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
