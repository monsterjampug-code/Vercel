import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"

export default async function AdminMinigamesPage() {
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

  // Get all unique artifacts that have been discovered
  const { data: artifacts } = await supabase.from("artifacts").select("id, name, type, rarity, user_id").order("name")

  // Get minigame scores with artifact info
  const { data: scores } = await supabase
    .from("minigame_scores")
    .select(`
      *,
      artifacts (name, type)
    `)
    .order("high_score", { ascending: false })
    .limit(50)

  // Count total plays per artifact type
  const artifactStats = artifacts?.reduce((acc: any, art: any) => {
    if (!acc[art.type]) {
      acc[art.type] = { count: 0, artifacts: [] }
    }
    acc[art.type].count++
    acc[art.type].artifacts.push(art)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-100">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Minigames</h1>
              <p className="text-green-100 text-sm">View minigame statistics and manage artifacts</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-300 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Total Artifacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{artifacts?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Games Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{scores?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-700">Artifact Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{Object.keys(artifactStats || {}).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Artifacts by Type */}
        <Card className="border-2 border-green-300 bg-white/80 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle>Artifacts by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(artifactStats || {}).map(([type, data]: [string, any]) => (
                <div key={type} className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-semibold text-lg text-green-900 capitalize">{type}</h3>
                  <p className="text-sm text-stone-600">{data.count} artifacts discovered</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.artifacts.slice(0, 5).map((art: any) => (
                      <span
                        key={art.id}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-300"
                      >
                        {art.name}
                      </span>
                    ))}
                    {data.artifacts.length > 5 && (
                      <span className="text-xs text-stone-500 px-2 py-1">+{data.artifacts.length - 5} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Scores */}
        <Card className="border-2 border-green-300 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Top Minigame Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scores?.slice(0, 20).map((score: any) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div>
                    <p className="font-semibold text-green-900">{score.artifacts?.name || "Unknown Artifact"}</p>
                    <p className="text-sm text-stone-600 capitalize">Type: {score.artifacts?.type || "Unknown"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{score.high_score}</p>
                    <p className="text-xs text-stone-500">Plays: {score.times_played}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
