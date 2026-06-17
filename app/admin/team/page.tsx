import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, User } from "lucide-react"
import { revalidatePath } from "next/cache"

async function deleteTeamMember(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const adminSupabase = createAdminClient()
  await adminSupabase.from("team_members").delete().eq("id", id)
  revalidatePath("/admin/team")
}

export default async function AdminTeamPage() {
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

  const { data: teamMembers } = await supabase.from("team_members").select("*").order("display_order")

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100">
      <header className="bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Team Members</h1>
              <p className="text-stone-100 text-sm">Add, edit, and remove team members</p>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Team Member</CardTitle>
            <CardDescription>Create a new team member profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/team/create">
              <Button className="bg-stone-600 hover:bg-stone-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {teamMembers?.map((member) => (
            <Card key={member.id} className="border-2 border-stone-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center flex-shrink-0">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900">{member.name}</h3>
                    <p className="text-stone-600">{member.role}</p>
                    <p className="text-sm text-stone-500">Order: {member.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/team/${member.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={deleteTeamMember}>
                      <input type="hidden" name="id" value={member.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
