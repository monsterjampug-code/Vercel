"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CreateMissionForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("active")
  const [maxParticipants, setMaxParticipants] = useState("10")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!name || !description || !location) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("team_missions").insert({
      name,
      description,
      location,
      status,
      max_participants: Number.parseInt(maxParticipants),
    })

    if (error) {
      alert("Error creating mission: " + error.message)
    } else {
      setName("")
      setDescription("")
      setLocation("")
      setStatus("active")
      setMaxParticipants("10")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Mission Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mission name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Egypt, Peru"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mission description..."
          rows={6}
        />
      </div>

      <Button onClick={handleCreate} disabled={loading} className="bg-amber-600 hover:bg-amber-700">
        {loading ? "Creating..." : "Create Mission"}
      </Button>
    </div>
  )
}
