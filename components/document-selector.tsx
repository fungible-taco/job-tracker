import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText } from "lucide-react"

interface DocumentSelectorProps {
  documents: string[]
  onDocumentsChange: (documents: string[]) => void
}

export function DocumentSelector({ documents, onDocumentsChange }: DocumentSelectorProps) {
  const [selectedResume, setSelectedResume] = useState<string>("")
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("")

  // Mock documents - in a real app, these would come from a database
  const availableDocuments = [
    { id: "resume1", name: "General Resume", type: "resume" },
    { id: "resume2", name: "Tech Resume", type: "resume" },
    { id: "cover1", name: "General Cover Letter", type: "cover" },
    { id: "cover2", name: "Tech Cover Letter", type: "cover" },
  ]

  const handleAddDocument = (type: "resume" | "cover") => {
    const selectedDoc = type === "resume" ? selectedResume : selectedCoverLetter
    if (selectedDoc && !documents.includes(selectedDoc)) {
      onDocumentsChange([...documents, selectedDoc])
      if (type === "resume") {
        setSelectedResume("")
      } else {
        setSelectedCoverLetter("")
      }
    }
  }

  const handleRemoveDocument = (docId: string) => {
    onDocumentsChange(documents.filter((id) => id !== docId))
  }

  const handleCreateNew = (type: "resume" | "cover") => {
    // In a real app, this would open a modal to create a new document
    alert(`Create new ${type} functionality would redirect to the core edior product!`)
  }

  const selectedResumeDoc = availableDocuments.find(doc => documents.includes(doc.id) && doc.type === "resume")
  const selectedCoverDoc = availableDocuments.find(doc => documents.includes(doc.id) && doc.type === "cover")

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Pro Tip:</span> Using tailored resumes and cover letters increases your chances of getting an interview by 61%. Take the time to customize your documents for each application!
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Resume</Label>
            <div className="flex gap-2">
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments
                    .filter(doc => doc.type === "resume")
                    .map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={() => handleAddDocument("resume")} 
                disabled={!selectedResume}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCreateNew("resume")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            {selectedResumeDoc && (
              <div className="flex items-center justify-between p-2 border rounded-md mt-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{selectedResumeDoc.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(selectedResumeDoc.id)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <div className="flex gap-2">
              <Select value={selectedCoverLetter} onValueChange={setSelectedCoverLetter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a cover letter" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments
                    .filter(doc => doc.type === "cover")
                    .map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={() => handleAddDocument("cover")} 
                disabled={!selectedCoverLetter}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCreateNew("cover")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            {selectedCoverDoc && (
              <div className="flex items-center justify-between p-2 border rounded-md mt-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{selectedCoverDoc.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(selectedCoverDoc.id)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 