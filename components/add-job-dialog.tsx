"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobData } from "@/types/job"
import { DocumentSelector } from "@/components/document-selector"
import { extractJobDetailsFromUrl } from "@/lib/openrouter"

interface AddJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddJob: (job: JobData) => void
  initialStatus?: string
}

export function AddJobDialog({ open, onOpenChange, onAddJob, initialStatus = "Saved" }: AddJobDialogProps) {
  const [activeTab, setActiveTab] = useState("manual")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [job, setJob] = useState<Partial<JobData>>({
    company: "",
    role: "",
    location: "",
    status: initialStatus,
    salary: "",
    source: "",
    link: "",
    dateApplied: new Date().toISOString().split('T')[0],
    contact: "",
    notes: "",
    documents: [],
  })

  // Reset form when dialog opens with new initialStatus
  useEffect(() => {
    if (open) {
      setJob(prev => ({ ...prev, status: initialStatus }))
    }
  }, [open, initialStatus])

  const handleChange = (field: keyof JobData, value: string | string[]) => {
    setJob({ ...job, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "manual") {
      if (!job.company || !job.role) return

      onAddJob({
        id: Date.now().toString(),
        company: job.company || "",
        role: job.role || "",
        location: job.location || "",
        status: job.status || "Saved",
        salary: job.salary || "",
        source: job.source || "",
        link: job.link || "",
        dateApplied: job.dateApplied || "",
        contact: job.contact || "",
        notes: job.notes || "",
        documents: job.documents || [],
      })
    } else if (activeTab === "url" && url) {
      setIsLoading(true)
      setError(null)
      
      try {
        const jobDetails = await extractJobDetailsFromUrl(url)
        
        onAddJob({
          id: Date.now().toString(),
          company: jobDetails.company || "",
          role: jobDetails.role || "",
          location: "",
          status: "Saved",
          salary: jobDetails.salary || "",
          source: jobDetails.source || "",
          link: url,
          dateApplied: "",
          contact: "",
          notes: `Imported from ${url}`,
          documents: [],
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to extract job details")
        return
      } finally {
        setIsLoading(false)
      }
    }

    // Reset form
    setJob({
      company: "",
      role: "",
      location: "",
      status: "Saved",
      salary: "",
      source: "",
      link: "",
      dateApplied: "",
      contact: "",
      notes: "",
      documents: [],
    })
    setUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="url">Import from URL</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
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
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={job.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Position *</Label>
                      <Input id="role" value={job.role} onChange={(e) => handleChange("role", e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input id="salary" value={job.salary} onChange={(e) => handleChange("salary", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={job.status} onValueChange={(value) => handleChange("status", value)}>
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
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={job.source}
                        onChange={(e) => handleChange("source", e.target.value)}
                        placeholder="LinkedIn, Indeed, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="link">Job Link</Label>
                      <Input
                        id="link"
                        value={job.link}
                        onChange={(e) => handleChange("link", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      value={job.contact}
                      onChange={(e) => handleChange("contact", e.target.value)}
                      placeholder="Name, title, email, etc."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <DocumentSelector
                    documents={job.documents || []}
                    onDocumentsChange={(documents) => handleChange("documents", documents)}
                  />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={job.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Additional details, interview notes, etc."
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
                  Add Job
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="url">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job Posting URL</Label>
                <Input
                  id="jobUrl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the URL of the job posting to automatically extract details
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-1">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Importing..." : "Import Job"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
