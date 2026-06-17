import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"

export default async function TeamPage() {
  const supabase = await createClient()

  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Meet the Team</h1>
              <p className="text-stone-100 text-xs sm:text-sm hidden sm:block">
                The team behind your archaeological journey
              </p>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base px-3 sm:px-4"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
                <span className="sm:hidden">←</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Team Members */}
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers?.map((member) => (
            <Card
              key={member.id}
              className="border-2 border-stone-200 hover:border-stone-400 transition-all hover:shadow-xl bg-white/90 backdrop-blur"
            >
              <CardContent className="pt-6 text-center">
                {/* Photo */}
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-stone-400" />
                  )}
                </div>

                {/* Name and Role */}
                <h3 className="text-2xl font-bold text-stone-900 mb-2">{member.name}</h3>
                <p className="text-stone-600 text-lg">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {teamMembers?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600 text-xl">No team members yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  )
}
