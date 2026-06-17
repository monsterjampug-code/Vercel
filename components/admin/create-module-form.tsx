"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CreateModuleForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    icon: "",
    route_path: "",
    status: "private",
    required_permission: "basic",
    order_index: 10,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createBrowserClient()

    const { error } = await supabase.from("feature_modules").insert([formData])

    if (error) {
      alert(`Error creating module: ${error.message}`)
    } else {
      alert("Module created successfully!")
      setFormData({
        name: "",
        display_name: "",
        description: "",
        icon: "",
        route_path: "",
        status: "private",
        required_permission: "basic",
        order_index: 10,
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Module Name (Internal)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., custom_feature"
            required
          />
        </div>

        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="e.g., Custom Feature"
            required
          />
        </div>

        <div>
          <Label htmlFor="icon">Icon (emoji or text)</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g., 🎨 or Icon"
            required
          />
        </div>

        <div>
          <Label htmlFor="route_path">Route Path</Label>
          <Input
            id="route_path"
            value={formData.route_path}
            onChange={(e) => setFormData({ ...formData, route_path: e.target.value })}
            placeholder="e.g., /custom-feature"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="released">Released (All users can see)</SelectItem>
              <SelectItem value="private">Private (Beta testers & admins only)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="required_permission">Required Permission</Label>
          <Select
            value={formData.required_permission}
            onValueChange={(value) => setFormData({ ...formData, required_permission: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic User</SelectItem>
              <SelectItem value="beta_tester">Beta Tester</SelectItem>
              <SelectItem value="admin">Admin Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="order_index">Display Order</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this feature does..."
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
        {isLoading ? "Creating..." : "Create Module"}
      </Button>
    </form>
  )
}
