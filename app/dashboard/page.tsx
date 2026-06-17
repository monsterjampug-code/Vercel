import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { User, Shield } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user stats
  const { count: excavationCount } = await supabase
    .from("excavation_runs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: artifactCount } = await supabase
    .from("artifacts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: completedLessons } = await supabase
    .from("user_lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                <User className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="truncate">{profile?.display_name || "Explorer"}</span>
                  {profile?.permission_level === "admin" && (
                    <span className="text-xs bg-red-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      Admin
                    </span>
                  )}
                  {profile?.permission_level === "beta_tester" && (
                    <span className="text-xs bg-blue-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                      Beta Tester
                    </span>
                  )}
                </h1>
                <p className="text-amber-100 text-xs sm:text-sm hidden sm:block">Archaeological Expedition Dashboard</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Excavations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600">{excavationCount || 0}</div>
              <p className="text-sm text-stone-600 mt-1">Total digs completed</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Artifacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600">{artifactCount || 0}</div>
              <p className="text-sm text-stone-600 mt-1">Discoveries in collection</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600">{completedLessons || 0}</div>
              <p className="text-sm text-stone-600 mt-1">Knowledge acquired</p>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons grid stacks better on mobile (1 col on mobile, 2 on sm, 3 on md, 4 on lg, 5 on xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Start Excavation */}
          <Link href="/excavation" className="group">
            <Card className="border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-xl bg-gradient-to-br from-amber-100 to-amber-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">⛏️</div>
                <CardTitle className="text-2xl text-amber-900">Start an Excavation Run</CardTitle>
                <CardDescription className="text-stone-600">
                  Begin a new dig site and discover ancient artifacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Start Digging</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Lessons */}
          <Link href="/lessons" className="group">
            <Card className="border-2 border-stone-300 hover:border-stone-500 transition-all hover:shadow-xl bg-gradient-to-br from-stone-100 to-stone-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                <CardTitle className="text-2xl text-stone-900">Lessons</CardTitle>
                <CardDescription className="text-stone-600">
                  Learn about archaeology, fossils, and ancient civilizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-stone-600 hover:bg-stone-700">Study Now</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Team Missions */}
          <Link href="/missions" className="group">
            <Card className="border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-xl bg-gradient-to-br from-amber-100 to-yellow-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
                <CardTitle className="text-2xl text-amber-900">Team Missions</CardTitle>
                <CardDescription className="text-stone-600">
                  Join expeditions and collaborate with fellow archaeologists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">View Missions</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Customize Sniffy */}
          <Link href="/sniffy" className="group">
            <Card className="border-2 border-stone-300 hover:border-stone-500 transition-all hover:shadow-xl bg-gradient-to-br from-stone-100 to-amber-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🐕</div>
                <CardTitle className="text-2xl text-stone-900">Customize Sniffy</CardTitle>
                <CardDescription className="text-stone-600">
                  Personalize your loyal archaeological companion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-stone-600 hover:bg-stone-700">Customize</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Artifact Library */}
          <Link href="/artifacts" className="group">
            <Card className="border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-xl bg-gradient-to-br from-yellow-100 to-amber-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🏺</div>
                <CardTitle className="text-2xl text-amber-900">Artifact Library</CardTitle>
                <CardDescription className="text-stone-600">
                  View your collection of discovered treasures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Collection</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Button */}
          {profile?.permission_level === "admin" && (
            <Link href="/admin" className="group">
              <Card className="border-2 border-red-300 hover:border-red-500 transition-all hover:shadow-xl bg-gradient-to-br from-red-100 to-orange-50 h-full">
                <CardHeader>
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                    <Shield className="w-16 h-16 text-red-600 mx-auto" />
                  </div>
                  <CardTitle className="text-2xl text-red-900">Administrate</CardTitle>
                  <CardDescription className="text-stone-600">Manage users, content, and site settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-red-600 hover:bg-red-700">Admin Panel</Button>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Meet the Team */}
          <Link href="/team" className="group">
            <Card className="border-2 border-blue-300 hover:border-blue-500 transition-all hover:shadow-xl bg-gradient-to-br from-blue-100 to-cyan-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                <CardTitle className="text-2xl text-blue-900">Meet the Team</CardTitle>
                <CardDescription className="text-stone-600">Get to know the team behind your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Team</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Endorsements */}
          <Link href="/endorsements" className="group">
            <Card className="border-2 border-teal-300 hover:border-teal-500 transition-all hover:shadow-xl bg-gradient-to-br from-teal-100 to-emerald-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
                <CardTitle className="text-2xl text-teal-900">Endorsements</CardTitle>
                <CardDescription className="text-stone-600">See what experts are saying about us</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Read More</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Minigames */}
          <Link href="/minigames" className="group">
            <Card className="border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-xl bg-gradient-to-br from-purple-100 to-pink-50 h-full">
              <CardHeader>
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
                <CardTitle className="text-2xl text-purple-900">Minigames</CardTitle>
                <CardDescription className="text-stone-600">
                  Play interactive games with your discovered artifacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Play Now</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Decorative fossil elements */}
        <div className="fixed bottom-4 right-4 text-6xl sm:text-9xl opacity-5 pointer-events-none">🦖</div>
        <div className="fixed top-1/4 left-4 text-5xl sm:text-7xl opacity-5 pointer-events-none">🦴</div>
      </main>
    </div>
  )
}
