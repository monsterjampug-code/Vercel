import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MissionCard } from "@/components/mission-card"

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-orange-100 text-orange-700 border-orange-300",
  expert: "bg-red-100 text-red-700 border-red-300",
}

export default async function MissionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("permission_level").eq("id", user.id).single()

  // Fetch all missions (RLS will filter based on permission)
  const { data: missions } = await supabase.from("team_missions").select("*").order("difficulty", { ascending: true })

  // Fetch user's joined missions
  const { data: userMissions } = await supabase
    .from("mission_participants")
    .select("*, team_missions(*)")
    .eq("user_id", user.id)

  // Get participant counts for each mission
  const missionParticipants = await Promise.all(
    (missions || []).map(async (mission) => {
      const { count } = await supabase
        .from("mission_participants")
        .select("*", { count: "exact", head: true })
        .eq("mission_id", mission.id)
        .eq("status", "active")

      return { missionId: mission.id, count: count || 0 }
    }),
  )

  const participantMap = new Map(missionParticipants.map((p) => [p.missionId, p.count]))
  const joinedMissionIds = new Set(userMissions?.map((m) => m.mission_id) || [])

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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Team Missions</h1>
          <p className="text-stone-600">Join collaborative expeditions with fellow archaeologists</p>
        </div>

        {/* User's Active Missions */}
        {userMissions && userMissions.length > 0 && (
          <Card className="border-2 border-amber-300 mb-8 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Active Missions
              </CardTitle>
              <CardDescription>Missions you've joined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userMissions.map((participation) => (
                  <div key={participation.id} className="border-2 border-amber-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-amber-900">{participation.team_missions.title}</h3>
                        <p className="text-sm text-stone-600 mt-1">{participation.team_missions.objective}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Missions */}
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Available Missions</h2>
        {missions && missions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                participantCount={participantMap.get(mission.id) || 0}
                isJoined={joinedMissionIds.has(mission.id)}
                userId={user.id}
              />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-stone-300">
            <CardContent className="py-16 text-center">
              <div className="text-7xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">No Missions Available</h3>
              <p className="text-stone-600">Check back later for new team expeditions!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
