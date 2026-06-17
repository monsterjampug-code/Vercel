import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, Calendar, Shield } from "lucide-react"
import { UserEditForm } from "@/components/admin/user-edit-form"

export default async function AdminUsersPage() {
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

  // Fetch all users with their profiles
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-red-100">
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-red-100 text-sm">View and edit all users</p>
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
        <div className="grid gap-6">
          {profiles?.map((userProfile) => (
            <Card key={userProfile.id} className="border-2 border-red-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {userProfile.display_name || "No name"}
                    {userProfile.permission_level === "admin" && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    {userProfile.permission_level === "beta_tester" && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Beta Tester</span>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Mail className="w-4 h-4" />
                      <span>Email: {userProfile.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <Calendar className="w-4 h-4" />
                      <span>Joined: {new Date(userProfile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <UserEditForm profile={userProfile} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
