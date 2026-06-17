"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Target, UserPlus, UserCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-orange-100 text-orange-700 border-orange-300",
  expert: "bg-red-100 text-red-700 border-red-300",
}

interface Mission {
  id: string
  title: string
  description: string
  objective: string
  reward: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  max_participants: number
  status?: string
}

export function MissionCard({
  mission,
  participantCount,
  isJoined,
  userId,
}: {
  mission: Mission
  participantCount: number
  isJoined: boolean
  userId: string
}) {
  const [joined, setJoined] = useState(isJoined)
  const [count, setCount] = useState(participantCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      if (joined) {
        // Leave mission
        const { error } = await supabase
          .from("mission_participants")
          .delete()
          .eq("mission_id", mission.id)
          .eq("user_id", userId)

        if (error) throw error

        setJoined(false)
        setCount(count - 1)
      } else {
        // Join mission
        const { error } = await supabase.from("mission_participants").insert({
          mission_id: mission.id,
          user_id: userId,
          status: "active",
        })

        if (error) throw error

        setJoined(true)
        setCount(count + 1)
      }
      router.refresh()
    } catch (error) {
      console.error("Failed to update mission participation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFull = count >= mission.max_participants

  return (
    <Card className={`border-2 ${joined ? "border-amber-400 bg-amber-50/30" : "border-stone-300"}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={`${DIFFICULTY_COLORS[mission.difficulty]} border`}>{mission.difficulty}</Badge>
            {mission.status === "private" && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-300 border text-xs">Experimental</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Users className="w-4 h-4" />
            <span>
              {count}/{mission.max_participants}
            </span>
          </div>
        </div>
        <CardTitle className="text-2xl text-amber-900">{mission.title}</CardTitle>
        <CardDescription className="text-stone-600">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <Target className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-stone-700">Objective</div>
              <div className="text-sm text-stone-600">{mission.objective}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Trophy className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-stone-700">Reward</div>
              <div className="text-sm text-stone-600">{mission.reward}</div>
            </div>
          </div>
        </div>

        <Button
          className={`w-full ${joined ? "bg-stone-600 hover:bg-stone-700" : "bg-amber-600 hover:bg-amber-700"}`}
          onClick={handleJoin}
          disabled={isLoading || (!joined && isFull)}
        >
          {isLoading ? (
            "Processing..."
          ) : joined ? (
            <>
              <UserCheck className="w-4 h-4 mr-2" />
              Leave Mission
            </>
          ) : isFull ? (
            "Mission Full"
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Join Mission
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
