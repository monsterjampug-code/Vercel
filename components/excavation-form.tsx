"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

const SITE_LOCATIONS = [
  "Sahara Desert, Egypt",
  "Valley of the Kings, Egypt",
  "Pompeii, Italy",
  "Machu Picchu, Peru",
  "Gobi Desert, Mongolia",
  "Badlands, South Dakota",
  "Dinosaur Provincial Park, Canada",
  "Olduvai Gorge, Tanzania",
]

export function ExcavationForm({ userId }: { userId: string }) {
  const [siteName, setSiteName] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create excavation run
      const { data: excavation, error: excavationError } = await supabase
        .from("excavation_runs")
        .insert({
          user_id: userId,
          site_name: siteName,
          location: location,
          notes: notes,
          status: "in-progress",
        })
        .select()
        .single()

      if (excavationError) throw excavationError

      // Simulate finding artifacts with random generation
      const artifactTypes = [
        { name: "Ancient Pottery Shard", type: "pottery", era: "Bronze Age", rarity: "common" },
        { name: "Stone Tool", type: "tool", era: "Stone Age", rarity: "common" },
        { name: "Roman Coin", type: "currency", era: "Roman Empire", rarity: "uncommon" },
        { name: "Egyptian Scarab", type: "jewelry", era: "Ancient Egypt", rarity: "rare" },
        { name: "Dinosaur Fossil Fragment", type: "fossil", era: "Mesozoic", rarity: "rare" },
        { name: "Viking Sword", type: "weapon", era: "Viking Age", rarity: "epic" },
        { name: "Golden Death Mask", type: "ceremonial", era: "Ancient Egypt", rarity: "legendary" },
        { name: "Indigenous Atlatl", type: "weapon", era: "Pre-Columbian", rarity: "uncommon" },
      ]

      const numArtifacts = Math.floor(Math.random() * 3) + 1 // 1-3 artifacts
      const foundArtifacts = []

      for (let i = 0; i < numArtifacts; i++) {
        const artifact = artifactTypes[Math.floor(Math.random() * artifactTypes.length)]
        foundArtifacts.push({
          user_id: userId,
          excavation_run_id: excavation.id,
          name: artifact.name,
          type: artifact.type,
          era: artifact.era,
          rarity: artifact.rarity,
          description: `Discovered at ${siteName}`,
        })
      }

      const { error: artifactsError } = await supabase.from("artifacts").insert(foundArtifacts)

      if (artifactsError) throw artifactsError

      // Update excavation run
      await supabase
        .from("excavation_runs")
        .update({
          artifacts_found: numArtifacts,
          status: "completed",
        })
        .eq("id", excavation.id)

      router.push("/artifacts")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to start excavation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input
          id="siteName"
          placeholder="e.g., Ancient Temple Ruins"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
          className="border-amber-200 focus:border-amber-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={location} onValueChange={setLocation} required>
          <SelectTrigger className="border-amber-200 focus:border-amber-400">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {SITE_LOCATIONS.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Expedition Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Document your expectations and initial observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border-amber-200 focus:border-amber-400 min-h-24"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
        {isLoading ? "Excavating..." : "Begin Excavation"}
      </Button>
    </form>
  )
}
