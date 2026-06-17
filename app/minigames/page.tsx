import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Gamepad2, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-700 border-gray-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-400",
}

const GAME_DESCRIPTIONS = {
  fossil: "Carefully brush away dirt to reveal the complete fossil",
  pottery: "Piece together fragments to restore ancient pottery",
  tool: "Match the tool to its historical use and era",
  currency: "Identify the origin and date coins correctly",
  jewelry: "Create matching patterns with precious gems",
  weapon: "Practice your aim with ancient weaponry",
  ceremonial: "Perform the ancient ritual in the correct sequence",
  tablet: "Decipher ancient writings and symbols",
  statue: "Restore the statue to its original glory",
}

export default async function MinigamesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch discovered artifacts
  const { data: artifacts } = await supabase
    .from("artifacts")
    .select("*")
    .eq("user_id", user.id)
    .order("discovered_at", { ascending: false })

  // Fetch minigame scores
  const { data: scores } = await supabase.from("minigame_scores").select("*").eq("user_id", user.id)

  const scoresMap =
    scores?.reduce((acc: Record<string, any>, score) => {
      acc[score.artifact_id] = score
      return acc
    }, {}) || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4 bg-transparent">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-purple-900">Artifact Minigames</h1>
          </div>
          <p className="text-stone-600">Play interactive games with your discovered artifacts</p>
        </div>

        {artifacts && artifacts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts.map((artifact) => {
              const score = scoresMap[artifact.id]
              return (
                <Card key={artifact.id} className="border-2 border-purple-200 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl">
                        {artifact.type === "fossil" && "🦴"}
                        {artifact.type === "pottery" && "🏺"}
                        {artifact.type === "tool" && "🔨"}
                        {artifact.type === "currency" && "🪙"}
                        {artifact.type === "jewelry" && "💍"}
                        {artifact.type === "weapon" && "⚔️"}
                        {artifact.type === "ceremonial" && "👑"}
                        {!["fossil", "pottery", "tool", "currency", "jewelry", "weapon", "ceremonial"].includes(
                          artifact.type,
                        ) && "🏛️"}
                      </div>
                      <Badge className={`${RARITY_COLORS[artifact.rarity as keyof typeof RARITY_COLORS]} border`}>
                        {artifact.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-purple-900">{artifact.name}</CardTitle>
                    <CardDescription>
                      {GAME_DESCRIPTIONS[artifact.type as keyof typeof GAME_DESCRIPTIONS] || "Play a unique minigame"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {score && (
                      <div className="flex justify-between text-sm bg-purple-50 p-2 rounded">
                        <span className="text-stone-600">High Score:</span>
                        <span className="font-bold text-purple-700">{score.high_score}</span>
                      </div>
                    )}
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link href={`/minigames/${artifact.id}`}>
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Game
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-2 border-purple-200">
            <CardContent className="py-16 text-center">
              <div className="text-7xl mb-4">
                <Lock className="w-20 h-20 mx-auto text-stone-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-2">No Artifacts Discovered Yet</h3>
              <p className="text-stone-600 mb-6">
                You need to discover artifacts before you can play minigames with them!
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/excavation">Start Excavating</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
