import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { revalidatePath } from "next/cache"

async function createTeamMember(formData: FormData) {
  "use server"
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const photo_url = formData.get("photo_url") as string
  const display_order = Number.parseInt(formData.get("display_order") as string) || 0

  const adminSupabase = createAdminClient()
  await adminSupabase.from("team_members").insert({
    name,
    role,
    photo_url: photo_url || null,
    display_order,
  })

  revalidatePath("/admin/team")
  redirect("/admin/team")
}

export default async function CreateTeamMemberPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100">
      <header className="bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create Team Member</h1>
            <Link href="/admin/team">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Team Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTeamMember} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required placeholder="Dr. Jane Smith" />
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Input id="role" name="role" required placeholder="Lead Archaeologist" />
              </div>

              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input id="photo_url" name="photo_url" placeholder="https://example.com/photo.jpg" />
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue="0" />
              </div>

              <Button type="submit" className="w-full bg-stone-600 hover:bg-stone-700">
                Create Team Member
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
