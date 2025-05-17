import { JobData } from "@/types/job"

export async function extractJobDetailsFromUrl(url: string): Promise<Partial<JobData>> {
  const response = await fetch('/api/extract-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to extract job details')
  }

  return response.json()
} 