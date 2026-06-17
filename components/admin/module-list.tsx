"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { ModuleEditDialog } from "./module-edit-dialog"

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

export function ModuleList({ modules }: { modules: Module[] }) {
  const router = useRouter()
  const [editingModule, setEditingModule] = useState<Module | null>(null)

  async function toggleActive(module: Module) {
    const supabase = createBrowserClient()

    const { error } = await supabase
      .from("feature_modules")
      .update({ is_active: !module.is_active })
      .eq("id", module.id)

    if (error) {
      alert(`Error updating module: ${error.message}`)
    } else {
      router.refresh()
    }
  }

  async function deleteModule(id: string) {
    if (!confirm("Are you sure you want to delete this module?")) return

    const supabase = createBrowserClient()

    const { error } = await supabase.from("feature_modules").delete().eq("id", id)

    if (error) {
      alert(`Error deleting module: ${error.message}`)
    } else {
      alert("Module deleted successfully!")
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id} className="p-4 border-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-4xl">{module.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{module.display_name}</h3>
                  <Badge variant={module.status === "released" ? "default" : "secondary"}>
                    {module.status === "released" ? "Released" : "Private [Experimental]"}
                  </Badge>
                  <Badge variant="outline">{module.required_permission.replace("_", " ")}</Badge>
                  {!module.is_active && <Badge variant="destructive">Inactive</Badge>}
                </div>
                <p className="text-sm text-stone-600 mb-2">{module.description}</p>
                <p className="text-xs text-stone-500">
                  Route: {module.route_path} | Order: {module.order_index}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toggleActive(module)}>
                {module.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingModule(module)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteModule(module.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {editingModule && (
        <ModuleEditDialog
          module={editingModule}
          onClose={() => setEditingModule(null)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}
