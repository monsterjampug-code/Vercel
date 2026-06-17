import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { SiteEditForm } from "@/components/admin/site-edit-form"
import { CreateSiteForm } from "@/components/admin/create-site-form"

export default async function AdminSitesPage() {
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

  const { data: sites } = await supabase.from("excavation_sites").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-yellow-100">
      <header className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Excavation Sites</h1>
              <p className="text-yellow-100 text-sm">Create, edit, and delete dig site locations</p>
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
        <Card className="border-2 border-yellow-300 bg-white/80 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Excavation Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateSiteForm />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {sites?.map((site) => (
            <Card key={site.id} className="border-2 border-yellow-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">{site.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteEditForm site={site} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
