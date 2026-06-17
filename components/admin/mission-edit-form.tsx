"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface Mission {
  id: string
  name: string
  description: string
  location: string
  status: string
  max_participants: number
}

export function MissionEditForm({ mission }: { mission: Mission }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(mission.name)
  const [description, setDescription] = useState(mission.description)
  const [location, setLocation] = useState(mission.location)
  const [status, setStatus] = useState(mission.status)
  const [maxParticipants, setMaxParticipants] = useState(mission.max_participants.toString())
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("team_missions")
      .update({
        name,
        description,
        location,
        status,
        max_participants: Number.parseInt(maxParticipants),
      })
      .eq("id", mission.id)

    if (error) {
      alert("Error updating mission: " + error.message)
    } else {
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this mission?")) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("team_missions").delete().eq("id", mission.id)

    if (error) {
      alert("Error deleting mission: " + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-stone-600">
          <p>
            <strong>Location:</strong> {mission.location}
          </p>
          <p>
            <strong>Status:</strong> {mission.status}
          </p>
          <p>
            <strong>Max Participants:</strong> {mission.max_participants}
          </p>
          <p className="mt-2">{mission.description.substring(0, 200)}...</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Mission
          </Button>
          <Button onClick={handleDelete} variant="destructive" disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 border-2 border-amber-200 rounded-lg bg-amber-50">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${mission.id}`}>Mission Name</Label>
          <Input
            id={`name-${mission.id}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mission name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`location-${mission.id}`}>Location</Label>
          <Input
            id={`location-${mission.id}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Egypt, Peru"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`status-${mission.id}`}>Status</Label>
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
          <Label htmlFor={`maxParticipants-${mission.id}`}>Max Participants</Label>
          <Input
            id={`maxParticipants-${mission.id}`}
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${mission.id}`}>Description</Label>
        <Textarea
          id={`description-${mission.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mission description..."
          rows={6}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading} className="bg-amber-600 hover:bg-amber-700">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
