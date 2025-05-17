"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Archive, FileText, ArrowUpDown, ArrowUp, ArrowDown, Check, X } from "lucide-react"
import type { JobData } from "@/types/job"
import { EditJobDialog } from "@/components/edit-job-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ListViewProps {
  jobs: JobData[]
  onUpdateJob: (job: JobData) => void
  onArchiveJob: (jobId: string) => void
}

type SortField = "company" | "role" | "source" | "status" | "dateApplied" | "salary"
type SortDirection = "asc" | "desc" | null

export function ListView({ jobs, onUpdateJob, onArchiveJob }: ListViewProps) {
  const [editingJob, setEditingJob] = useState<JobData | null>(null)
  const [sortField, setSortField] = useState<SortField>("company")
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ jobId: string; field: keyof JobData } | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleEdit = (job: JobData) => {
    setEditingJob(job)
  }

  const handleSave = (job: JobData) => {
    onUpdateJob(job)
    setEditingJob(null)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: null -> asc -> desc -> null
      setSortDirection(current => 
        current === null ? "asc" : 
        current === "asc" ? "desc" : null
      )
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    if (!sortDirection) return 0

    const aValue = a[sortField]?.toLowerCase() || ""
    const bValue = b[sortField]?.toLowerCase() || ""

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

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
      case "Archived":
        return "bg-gray-100 text-gray-500"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCellEdit = (job: JobData, field: keyof JobData) => {
    setEditingCell({ jobId: job.id, field })
    setEditValue(String(job[field] || ""))
  }

  const handleCellSave = () => {
    if (!editingCell) return

    const job = jobs.find(j => j.id === editingCell.jobId)
    if (!job) return

    const updatedJob = {
      ...job,
      [editingCell.field]: editValue
    }

    onUpdateJob(updatedJob)
    setEditingCell(null)
  }

  const handleCellCancel = () => {
    setEditingCell(null)
  }

  const renderEditableCell = (job: JobData, field: keyof JobData) => {
    if (editingCell?.jobId === job.id && editingCell?.field === field) {
      if (field === "status") {
        return (
          <div className="flex items-center gap-2 h-8">
            <Select
              value={editValue}
              onValueChange={setEditValue}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Saved">Saved</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCellSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCellCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-2 h-8">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCellSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCellCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    if (field === "status") {
      return (
        <Badge 
          className={`${getStatusColor(job.status)} cursor-pointer h-8 flex items-center`}
          onClick={() => handleCellEdit(job, field)}
        >
          {job.status}
        </Badge>
      )
    }

    return (
      <div 
        className="cursor-pointer hover:bg-gray-50 p-1 rounded h-8 flex items-center"
        onClick={() => handleCellEdit(job, field)}
      >
        {job[field] || "—"}
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("company")}
            >
              <div className="flex items-center gap-2">
                Company {getSortIcon("company")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("role")}
            >
              <div className="flex items-center gap-2">
                Role {getSortIcon("role")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("source")}
            >
              <div className="flex items-center gap-2">
                Source {getSortIcon("source")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-2">
                Status {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("dateApplied")}
            >
              <div className="flex items-center gap-2">
                Date Applied {getSortIcon("dateApplied")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("salary")}
            >
              <div className="flex items-center gap-2">
                Salary Range {getSortIcon("salary")}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                {renderEditableCell(job, "company")}
              </TableCell>
              <TableCell>
                {renderEditableCell(job, "role")}
              </TableCell>
              <TableCell>
                {renderEditableCell(job, "source")}
              </TableCell>
              <TableCell>
                {renderEditableCell(job, "status")}
              </TableCell>
              <TableCell>
                {renderEditableCell(job, "dateApplied")}
              </TableCell>
              <TableCell>
                {renderEditableCell(job, "salary")}
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
