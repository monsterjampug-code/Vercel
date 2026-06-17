import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AtlatlGame } from "@/components/minigames/atlatl-game"
import { FossilBrushGame } from "@/components/minigames/fossil-brush-game"
import { PotteryPuzzleGame } from "@/components/minigames/pottery-puzzle-game"
import { CoinIdentifyGame } from "@/components/minigames/coin-identify-game"
import { JewelryMatchGame } from "@/components/minigames/jewelry-match-game"
import { ToolQuizGame } from "@/components/minigames/tool-quiz-game"

export default async function MinigamePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: artifact } = await supabase
    .from("artifacts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!artifact) {
    notFound()
  }

  // Get current score
  const { data: score } = await supabase
    .from("minigame_scores")
    .select("*")
    .eq("artifact_id", artifact.id)
    .eq("user_id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-4 bg-transparent">
          <Link href="/minigames">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Minigames
          </Link>
        </Button>

        {/* Render game based on artifact type */}
        {artifact.type === "weapon" && artifact.name.includes("Atlatl") && (
          <AtlatlGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {artifact.type === "fossil" && (
          <FossilBrushGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {artifact.type === "pottery" && (
          <PotteryPuzzleGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {artifact.type === "currency" && (
          <CoinIdentifyGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {artifact.type === "jewelry" && (
          <JewelryMatchGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {artifact.type === "tool" && (
          <ToolQuizGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
        {/* Default fallback for other types */}
        {!["weapon", "fossil", "pottery", "currency", "jewelry", "tool"].includes(artifact.type) && (
          <AtlatlGame artifact={artifact} userId={user.id} currentHighScore={score?.high_score || 0} />
        )}
      </div>
    </div>
  )
}
