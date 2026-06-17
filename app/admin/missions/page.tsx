import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { MissionEditForm } from "@/components/admin/mission-edit-form"
import { CreateMissionForm } from "@/components/admin/create-mission-form"

export default async function AdminMissionsPage() {
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

  const { data: missions } = await supabase.from("team_missions").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Missions</h1>
              <p className="text-amber-100 text-sm">Create, edit, and delete team missions</p>
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
        <Card className="border-2 border-amber-300 bg-white/80 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateMissionForm />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {missions?.map((mission) => (
            <Card key={mission.id} className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">{mission.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <MissionEditForm mission={mission} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
