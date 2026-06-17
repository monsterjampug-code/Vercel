"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserProfile } from "@/app/actions/admin-actions"

interface Profile {
  id: string
  email: string | null
  display_name: string | null
  permission_level: string
}

export function UserEditForm({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name || "")
  const [email, setEmail] = useState(profile.email || "")
  const [permissionLevel, setPermissionLevel] = useState(profile.permission_level || "basic")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    console.log("[v0] handleSave called with:", { displayName, email, permissionLevel })
    setLoading(true)

    const result = await updateUserProfile(profile.id, {
      display_name: displayName,
      email: email,
      permission_level: permissionLevel,
    })

    console.log("[v0] updateUserProfile result:", result)

    if (result.error) {
      alert("Error updating user: " + result.error)
    } else {
      alert("User updated successfully!")
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full md:w-auto">
        Edit User
      </Button>
    )
  }

  return (
    <div className="space-y-4 p-4 border-2 border-red-200 rounded-lg bg-red-50">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${profile.id}`}>Display Name</Label>
          <Input
            id={`name-${profile.id}`}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`email-${profile.id}`}>Email</Label>
          <Input
            id={`email-${profile.id}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`permission-${profile.id}`}>Permission Level</Label>
        <Select value={permissionLevel} onValueChange={setPermissionLevel}>
          <SelectTrigger id={`permission-${profile.id}`}>
            <SelectValue placeholder="Select permission level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic - Normal User</SelectItem>
            <SelectItem value="beta_tester">Beta Tester - Can view unreleased modules</SelectItem>
            <SelectItem value="admin">Admin - Full control</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-stone-600">
          {permissionLevel === "basic" && "Normal user with standard access"}
          {permissionLevel === "beta_tester" && "Can view and test unreleased experimental modules"}
          {permissionLevel === "admin" && "Full control over website, users, and content"}
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
