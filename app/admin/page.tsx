import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, BookOpen, Map, MapPin, ArrowLeft, Gamepad2 } from "lucide-react"

export default async function AdminPage() {
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

  // Get stats
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: lessonCount } = await supabase.from("lessons").select("*", { count: "exact", head: true })

  const { count: missionCount } = await supabase.from("team_missions").select("*", { count: "exact", head: true })

  const { count: siteCount } = await supabase.from("excavation_sites").select("*", { count: "exact", head: true })

  const { count: moduleCount } = await supabase.from("feature_modules").select("*", { count: "exact", head: true })

  const { count: minigameCount } = await supabase
    .from("minigame_scores")
    .select("artifact_id", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Control Panel</h1>
              <p className="text-red-100 text-sm">Manage users and content</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{userCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{lessonCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Missions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{missionCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{siteCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{moduleCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Minigames Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{minigameCount || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Management */}
          <Link href="/admin/users" className="group">
            <Card className="border-2 border-red-300 hover:border-red-500 transition-all hover:shadow-xl bg-gradient-to-br from-red-100 to-orange-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-16 h-16 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-900">User Management</CardTitle>
                <CardDescription className="text-stone-600">
                  View and edit all registered users, manage permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">Manage Users</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Content Management - Lessons */}
          <Link href="/admin/lessons" className="group">
            <Card className="border-2 border-orange-300 hover:border-orange-500 transition-all hover:shadow-xl bg-gradient-to-br from-orange-100 to-amber-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-16 h-16 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-orange-900">Manage Lessons</CardTitle>
                <CardDescription className="text-stone-600">
                  Create, edit, and delete educational lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Edit Lessons</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Content Management - Missions */}
          <Link href="/admin/missions" className="group">
            <Card className="border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-xl bg-gradient-to-br from-amber-100 to-yellow-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                  <Map className="w-16 h-16 text-amber-600" />
                </div>
                <CardTitle className="text-2xl text-amber-900">Manage Missions</CardTitle>
                <CardDescription className="text-stone-600">Create, edit, and delete team missions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Edit Missions</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Content Management - Excavation Sites */}
          <Link href="/admin/sites" className="group">
            <Card className="border-2 border-yellow-300 hover:border-yellow-500 transition-all hover:shadow-xl bg-gradient-to-br from-yellow-100 to-amber-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-16 h-16 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl text-yellow-900">Manage Excavation Sites</CardTitle>
                <CardDescription className="text-stone-600">
                  Create, edit, and delete dig site locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Edit Sites</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Content Management - Feature Modules */}
          <Link href="/admin/modules" className="group">
            <Card className="border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-xl bg-gradient-to-br from-purple-100 to-pink-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                <CardTitle className="text-2xl text-purple-900">Manage Feature Modules</CardTitle>
                <CardDescription className="text-stone-600">
                  Create and manage entire feature sections like Sniffy customization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Edit Modules</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Content Management - Minigames */}
          <Link href="/admin/minigames" className="group">
            <Card className="border-2 border-green-300 hover:border-green-500 transition-all hover:shadow-xl bg-gradient-to-br from-green-100 to-emerald-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-16 h-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">Manage Minigames</CardTitle>
                <CardDescription className="text-stone-600">
                  Configure minigames, artifacts, and game settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">Edit Minigames</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Team Management */}
          <Link href="/admin/team" className="group">
            <Card className="border-2 border-blue-300 hover:border-blue-500 transition-all hover:shadow-xl bg-gradient-to-br from-blue-100 to-cyan-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                <CardTitle className="text-2xl text-blue-900">Manage Team Members</CardTitle>
                <CardDescription className="text-stone-600">Add, edit, and remove team member profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Edit Team</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Endorsements Management */}
          <Link href="/admin/endorsements" className="group">
            <Card className="border-2 border-teal-300 hover:border-teal-500 transition-all hover:shadow-xl bg-gradient-to-br from-teal-100 to-emerald-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
                <CardTitle className="text-2xl text-teal-900">Manage Endorsements</CardTitle>
                <CardDescription className="text-stone-600">
                  Add, edit, and remove testimonials and endorsements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Edit Endorsements</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
