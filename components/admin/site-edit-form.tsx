"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface Site {
  id: string
  name: string
  location: string
  era: string
  description: string | null
}

export function SiteEditForm({ site }: { site: Site }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(site.name)
  const [location, setLocation] = useState(site.location)
  const [era, setEra] = useState(site.era)
  const [description, setDescription] = useState(site.description || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("excavation_sites")
      .update({
        name,
        location,
        era,
        description,
      })
      .eq("id", site.id)

    if (error) {
      alert("Error updating site: " + error.message)
    } else {
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this site?")) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("excavation_sites").delete().eq("id", site.id)

    if (error) {
      alert("Error deleting site: " + error.message)
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
            <strong>Location:</strong> {site.location}
          </p>
          <p>
            <strong>Era:</strong> {site.era}
          </p>
          {site.description && <p className="mt-2">{site.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Site
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
    <div className="space-y-4 p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${site.id}`}>Site Name</Label>
          <Input
            id={`name-${site.id}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Pompeii"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`location-${site.id}`}>Location</Label>
          <Input
            id={`location-${site.id}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Italy"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`era-${site.id}`}>Era</Label>
          <Input
            id={`era-${site.id}`}
            value={era}
            onChange={(e) => setEra(e.target.value)}
            placeholder="e.g., Roman Empire"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${site.id}`}>Description</Label>
        <Textarea
          id={`description-${site.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Site description..."
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
