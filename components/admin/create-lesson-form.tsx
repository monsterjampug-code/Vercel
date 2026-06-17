"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CreateLessonForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [duration, setDuration] = useState("15")
  const [category, setCategory] = useState("General")
  const [status, setStatus] = useState("released")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!title || !content) {
      alert("Please fill in title and content")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("lessons").insert({
      title,
      content,
      difficulty,
      duration_minutes: Number.parseInt(duration),
      category,
      status,
    })

    if (error) {
      alert("Error creating lesson: " + error.message)
    } else {
      setTitle("")
      setContent("")
      setDifficulty("beginner")
      setDuration("15")
      setCategory("General")
      setStatus("released")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Fossils, Tools"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
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
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
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
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Lesson content..."
          rows={8}
        />
      </div>

      <Button onClick={handleCreate} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
        {loading ? "Creating..." : "Create Lesson"}
      </Button>
    </div>
  )
}
