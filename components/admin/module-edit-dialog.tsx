"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"

interface Module {
  id: string
  name: string
  display_name: string
  description: string
  icon: string
  route_path: string
  status: string
  required_permission: string
  order_index: number
  is_active: boolean
}

export function ModuleEditDialog({
  module,
  onClose,
  onSuccess,
}: {
  module: Module
  onClose: () => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(module)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createBrowserClient()

    const { error } = await supabase
      .from("feature_modules")
      .update({
        display_name: formData.display_name,
        description: formData.description,
        icon: formData.icon,
        route_path: formData.route_path,
        status: formData.status,
        required_permission: formData.required_permission,
        order_index: formData.order_index,
        is_active: formData.is_active,
      })
      .eq("id", module.id)

    if (error) {
      alert(`Error updating module: ${error.message}`)
    } else {
      alert("Module updated successfully!")
      onSuccess()
      onClose()
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Module: {module.display_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="route_path">Route Path</Label>
              <Input
                id="route_path"
                value={formData.route_path}
                onChange={(e) => setFormData({ ...formData, route_path: e.target.value })}
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
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="private">Private [Experimental]</SelectItem>
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
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Updating..." : "Update Module"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
