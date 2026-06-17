"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CreateSiteForm() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [era, setEra] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!name || !location || !era) {
      alert("Please fill in name, location, and era")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("excavation_sites").insert({
      name,
      location,
      era,
      description,
    })

    if (error) {
      alert("Error creating site: " + error.message)
    } else {
      setName("")
      setLocation("")
      setEra("")
      setDescription("")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Pompeii" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Italy"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="era">Era</Label>
          <Input id="era" value={era} onChange={(e) => setEra(e.target.value)} placeholder="e.g., Roman Empire" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Site description..."
          rows={4}
        />
      </div>

      <Button onClick={handleCreate} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
        {loading ? "Creating..." : "Create Site"}
      </Button>
    </div>
  )
}
