"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-700 border-green-300",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-300",
  advanced: "bg-red-100 text-red-700 border-red-300",
}

interface Lesson {
  id: string
  title: string
  category: string
  content: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration_minutes: number
  status?: string // Added status field
}

export function LessonCard({ lesson, isCompleted, userId }: { lesson: Lesson; isCompleted: boolean; userId: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_lesson_progress").upsert(
        {
          user_id: userId,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,lesson_id",
        },
      )

      if (error) throw error

      setCompleted(true)
      router.refresh()
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`border-2 ${completed ? "border-green-300 bg-green-50/30" : "border-stone-300"} relative`}>
      {completed && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`${DIFFICULTY_COLORS[lesson.difficulty]} border text-xs`}>{lesson.difficulty}</Badge>
          <Badge variant="outline" className="text-xs">
            {lesson.category}
          </Badge>
          {lesson.status === "private" && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-300 border text-xs">Experimental</Badge>
          )}
        </div>
        <CardTitle className="text-xl text-stone-900">{lesson.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-stone-600">
          <Clock className="w-4 h-4" />
          {lesson.duration_minutes} minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isExpanded && (
          <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-stone-700 leading-relaxed">{lesson.content}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-stone-300 bg-transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {isExpanded ? "Hide" : "Read"}
          </Button>
          {!completed && (
            <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleComplete} disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
