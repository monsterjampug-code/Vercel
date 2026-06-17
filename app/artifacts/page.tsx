import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-700 border-gray-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-400",
}

export default async function ArtifactsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all artifacts
  const { data: artifacts } = await supabase
    .from("artifacts")
    .select("*")
    .eq("user_id", user.id)
    .order("discovered_at", { ascending: false })

  // Group by rarity for stats
  const rarityCounts = artifacts?.reduce(
    (acc, artifact) => {
      acc[artifact.rarity] = (acc[artifact.rarity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Artifact Library</h1>
          <p className="text-stone-600">Your personal collection of archaeological discoveries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {["common", "uncommon", "rare", "epic", "legendary"].map((rarity) => (
            <Card key={rarity} className="border-2">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-amber-900">{rarityCounts?.[rarity] || 0}</div>
                <div className="text-sm text-stone-600 capitalize">{rarity}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Artifacts Grid */}
        {artifacts && artifacts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts.map((artifact) => (
              <Card key={artifact.id} className="border-2 border-amber-200 hover:shadow-xl transition-shadow">
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
                      <Sparkles className="w-3 h-3 mr-1" />
                      {artifact.rarity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-amber-900">{artifact.name}</CardTitle>
                  <CardDescription>
                    <span className="text-stone-700 font-medium">{artifact.era}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-stone-600 mb-3">{artifact.description}</p>
                  <div className="text-xs text-stone-500">
                    Discovered: {new Date(artifact.discovered_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-amber-200">
            <CardContent className="py-16 text-center">
              <div className="text-7xl mb-4">🏜️</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-2">No Artifacts Yet</h3>
              <p className="text-stone-600 mb-6">Start an excavation run to discover ancient treasures!</p>
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
