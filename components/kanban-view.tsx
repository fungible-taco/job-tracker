"use client"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { JobCard } from "@/components/job-card"
import type { JobData } from "@/types/job"

interface KanbanViewProps {
  jobs: JobData[]
  onUpdateJob: (job: JobData) => void
  onArchiveJob: (jobId: string) => void
}

export function KanbanView({ jobs, onUpdateJob, onArchiveJob }: KanbanViewProps) {
  const statuses = ["Saved", "Applied", "Interview", "Assignment", "Offer"]

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const job = jobs.find((job) => job.id === draggableId)
    if (job) {
      const updatedJob = { ...job, status: destination.droppableId }
      onUpdateJob(updatedJob)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {statuses.map((status) => (
          <div key={status} className="flex flex-col">
            <h3
              className={`text-lg font-semibold mb-4 ${
                status === "Interview"
                  ? "text-purple-600"
                  : status === "Assignment"
                    ? "text-amber-500"
                    : status === "Offer"
                      ? "text-emerald-500"
                      : "text-gray-800"
              }`}
            >
              {status}
            </h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex-grow"
                >
                  {jobs
                    .filter((job) => job.status === status)
                    .map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4"
                          >
                            <JobCard job={job} onUpdateJob={onUpdateJob} onArchiveJob={onArchiveJob} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
