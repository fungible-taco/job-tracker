import { Navbar } from "@/components/navbar"
import { JobTrackerDashboard } from "@/components/job-tracker-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <JobTrackerDashboard />
    </main>
  )
}
