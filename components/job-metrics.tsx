import type { JobData } from "@/types/job"

interface JobMetricsProps {
  jobs: JobData[]
}

export function JobMetrics({ jobs }: JobMetricsProps) {
  // Count metrics
  const totalJobs = jobs.length
  const appliedCount = jobs.filter((job) => job.status !== "Saved").length
  const interviewCount = jobs.filter((job) => job.status === "Interview").length
  const offerCount = jobs.filter((job) => job.status === "Offer").length
  const assignmentCount = jobs.filter((job) => job.status === "Assignment").length
  const archivedCount = jobs.filter((job) => job.status === "Archived").length

  // Calculate rates
  const interviewRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0
  const successRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0
  const assignmentRate = appliedCount > 0 ? Math.round((assignmentCount / appliedCount) * 100) : 0

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm border border-gray-100">
        <span className="text-xs text-gray-500">Total Jobs</span>
        <span className="text-lg font-bold text-gray-800">{totalJobs}</span>
      </div>

      <div className="h-6 border-r border-gray-200"></div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm border border-gray-100">
        <span className="text-xs text-gray-500">Interviews</span>
        <span className="text-lg font-bold text-purple-600">{interviewRate}%</span>
      </div>

      <div className="h-6 border-r border-gray-200"></div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm border border-gray-100">
        <span className="text-xs text-gray-500">Assignments</span>
        <span className="text-lg font-bold text-amber-500">{assignmentRate}%</span>
      </div>

      <div className="h-6 border-r border-gray-200"></div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm border border-gray-100">
        <span className="text-xs text-gray-500">Offers</span>
        <span className="text-lg font-bold text-emerald-500">{successRate}%</span>
      </div>
      <div className="h-6 border-r border-gray-200"></div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm border border-gray-100">
        <span className="text-xs text-gray-500">Archived</span>
        <span className="text-lg font-bold text-grey-500">{archivedCount}</span>
      </div>
     
    </div>
  )
}
