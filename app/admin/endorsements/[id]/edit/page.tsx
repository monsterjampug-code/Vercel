import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { revalidatePath } from "next/cache"

async function updateEndorsement(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const job_title = formData.get("job_title") as string
  const quote = formData.get("quote") as string
  const photo_url = formData.get("photo_url") as string
  const display_order = Number.parseInt(formData.get("display_order") as string) || 0

  const adminSupabase = createAdminClient()
  await adminSupabase
    .from("endorsements")
    .update({
      name,
      job_title,
      quote,
      photo_url: photo_url || null,
      display_order,
    })
    .eq("id", id)

  revalidatePath("/admin/endorsements")
  redirect("/admin/endorsements")
}

export default async function EditEndorsementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: endorsement } = await supabase.from("endorsements").select("*").eq("id", id).single()

  if (!endorsement) {
    redirect("/admin/endorsements")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Endorsement</h1>
            <Link href="/admin/endorsements">
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
            <CardTitle>Edit Endorsement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateEndorsement} className="space-y-4">
              <input type="hidden" name="id" value={endorsement.id} />

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required defaultValue={endorsement.name} />
              </div>

              <div>
                <Label htmlFor="job_title">Job Title *</Label>
                <Input id="job_title" name="job_title" required defaultValue={endorsement.job_title} />
              </div>

              <div>
                <Label htmlFor="quote">Quote *</Label>
                <Textarea
                  id="quote"
                  name="quote"
                  required
                  defaultValue={endorsement.quote}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input id="photo_url" name="photo_url" defaultValue={endorsement.photo_url || ""} />
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={endorsement.display_order} />
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                Update Endorsement
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
