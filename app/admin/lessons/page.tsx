import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { LessonEditForm } from "@/components/admin/lesson-edit-form"
import { CreateLessonForm } from "@/components/admin/create-lesson-form"

export default async function AdminLessonsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("permission_level").eq("id", user.id).single()

  if (profile?.permission_level !== "admin") {
    redirect("/dashboard")
  }

  const { data: lessons } = await supabase.from("lessons").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100">
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Lessons</h1>
              <p className="text-orange-100 text-sm">Create, edit, and delete lessons</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Create new lesson */}
        <Card className="border-2 border-orange-300 bg-white/80 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLessonForm />
          </CardContent>
        </Card>

        {/* Existing lessons */}
        <div className="grid gap-6">
          {lessons?.map((lesson) => (
            <Card key={lesson.id} className="border-2 border-orange-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <LessonEditForm lesson={lesson} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
