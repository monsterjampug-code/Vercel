import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, TrendingUp } from "lucide-react"
import { ExcavationForm } from "@/components/excavation-form"

export default async function ExcavationPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch recent excavation runs
  const { data: recentRuns } = await supabase
    .from("excavation_runs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Excavation Runs</h1>
          <p className="text-stone-600">Start a new dig site or view your past expeditions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Start new excavation */}
          <div>
            <Card className="border-2 border-amber-300 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-stone-100">
                <div className="text-5xl mb-2">⛏️</div>
                <CardTitle className="text-2xl text-amber-900">Start New Excavation</CardTitle>
                <CardDescription>Choose a site and begin your archaeological dig</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ExcavationForm userId={user.id} />
              </CardContent>
            </Card>
          </div>

          {/* Recent excavations */}
          <div>
            <Card className="border-2 border-stone-300">
              <CardHeader>
                <CardTitle className="text-xl text-stone-900">Recent Expeditions</CardTitle>
                <CardDescription>Your latest excavation activities</CardDescription>
              </CardHeader>
              <CardContent>
                {recentRuns && recentRuns.length > 0 ? (
                  <div className="space-y-4">
                    {recentRuns.map((run) => (
                      <div key={run.id} className="border-2 border-amber-100 rounded-lg p-4 bg-amber-50/50">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-amber-900">{run.site_name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              run.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : run.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {run.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-stone-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{run.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(run.start_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{run.artifacts_found} artifacts found</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500">
                    <div className="text-5xl mb-3">🏜️</div>
                    <p>No excavations yet. Start your first dig!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
