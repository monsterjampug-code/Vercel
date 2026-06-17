import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { ModuleList } from "@/components/admin/module-list"
import { CreateModuleForm } from "@/components/admin/create-module-form"

export default async function AdminModulesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("permission_level").eq("id", user.id).single()

  if (profile?.permission_level !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all feature modules
  const { data: modules } = await supabase.from("feature_modules").select("*").order("order_index")

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-red-100">
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Feature Modules</h1>
              <p className="text-red-100 text-sm">Create and manage entire feature sections</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-2 border-red-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Feature Module
            </CardTitle>
            <CardDescription>
              Add a new feature section to the dashboard (like Sniffy customization, lessons, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateModuleForm />
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Existing Modules</CardTitle>
            <CardDescription>Manage visibility, permissions, and order of feature modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ModuleList modules={modules || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
