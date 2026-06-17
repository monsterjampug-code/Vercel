import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react"
import { LessonCard } from "@/components/lesson-card"

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-700 border-green-300",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-300",
  advanced: "bg-red-100 text-red-700 border-red-300",
}

export default async function LessonsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("permission_level").eq("id", user.id).single()

  // Fetch all lessons (RLS will filter based on permission)
  const { data: lessons } = await supabase.from("lessons").select("*").order("difficulty", { ascending: true })

  // Fetch user progress
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("completed", true)

  const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4 bg-transparent">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Archaeological Lessons</h1>
          <p className="text-stone-600">Expand your knowledge of archaeology, fossils, and ancient civilizations</p>
        </div>

        {/* Progress Stats */}
        <Card className="border-2 border-stone-300 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-stone-900">{progress?.length || 0}</span>
                <span className="text-stone-600">lessons completed</span>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-stone-900">{lessons?.length || 0}</span>
                <span className="text-stone-600">total lessons</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        {lessons && lessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessonIds.has(lesson.id)}
                userId={user.id}
              />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-stone-300">
            <CardContent className="py-16 text-center">
              <div className="text-7xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">No Lessons Available</h3>
              <p className="text-stone-600">Check back later for new educational content!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
