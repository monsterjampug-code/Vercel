"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface Lesson {
  id: string
  title: string
  content: string
  difficulty: string
  duration_minutes: number
  category: string
  status?: string
}

export function LessonEditForm({ lesson }: { lesson: Lesson }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [content, setContent] = useState(lesson.content)
  const [difficulty, setDifficulty] = useState(lesson.difficulty)
  const [duration, setDuration] = useState(lesson.duration_minutes.toString())
  const [category, setCategory] = useState(lesson.category)
  const [status, setStatus] = useState(lesson.status || "released")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("lessons")
      .update({
        title,
        content,
        difficulty,
        duration_minutes: Number.parseInt(duration),
        category,
        status,
      })
      .eq("id", lesson.id)

    if (error) {
      alert("Error updating lesson: " + error.message)
    } else {
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("lessons").delete().eq("id", lesson.id)

    if (error) {
      alert("Error deleting lesson: " + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-stone-600">
          <p>
            <strong>Category:</strong> {lesson.category}
          </p>
          <p>
            <strong>Difficulty:</strong> {lesson.difficulty}
          </p>
          <p>
            <strong>Duration:</strong> {lesson.duration_minutes} minutes
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-semibold ${lesson.status === "private" ? "text-purple-600" : "text-green-600"}`}>
              {lesson.status === "private" ? "Private (Experimental)" : "Released"}
            </span>
          </p>
          <p className="mt-2">{lesson.content.substring(0, 200)}...</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Lesson
          </Button>
          <Button onClick={handleDelete} variant="destructive" disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${lesson.id}`}>Title</Label>
          <Input
            id={`title-${lesson.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lesson title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`category-${lesson.id}`}>Category</Label>
          <Input
            id={`category-${lesson.id}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Fossils, Tools"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`difficulty-${lesson.id}`}>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`duration-${lesson.id}`}>Duration (minutes)</Label>
          <Input
            id={`duration-${lesson.id}`}
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`status-${lesson.id}`}>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="released">Released - All users can view</SelectItem>
              <SelectItem value="private">Private - Only Beta Testers & Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`content-${lesson.id}`}>Content</Label>
        <Textarea
          id={`content-${lesson.id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Lesson content..."
          rows={8}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
