import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, User } from "lucide-react"
import { revalidatePath } from "next/cache"

async function deleteEndorsement(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const adminSupabase = createAdminClient()
  await adminSupabase.from("endorsements").delete().eq("id", id)
  revalidatePath("/admin/endorsements")
}

export default async function AdminEndorsementsPage() {
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

  const { data: endorsements } = await supabase.from("endorsements").select("*").order("display_order")

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Endorsements</h1>
              <p className="text-amber-100 text-sm">Add, edit, and remove endorsements</p>
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
            <CardTitle>Add New Endorsement</CardTitle>
            <CardDescription>Create a new endorsement testimonial</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/endorsements/create">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Endorsement
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {endorsements?.map((endorsement) => (
            <Card key={endorsement.id} className="border-2 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center flex-shrink-0">
                    {endorsement.photo_url ? (
                      <img
                        src={endorsement.photo_url || "/placeholder.svg"}
                        alt={endorsement.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900">{endorsement.name}</h3>
                    <p className="text-stone-600 mb-2">{endorsement.job_title}</p>
                    <p className="text-sm text-stone-700 italic">"{endorsement.quote}"</p>
                    <p className="text-sm text-stone-500 mt-2">Order: {endorsement.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/endorsements/${endorsement.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={deleteEndorsement}>
                      <input type="hidden" name="id" value={endorsement.id} />
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
