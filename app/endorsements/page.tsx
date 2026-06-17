import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, Quote } from "lucide-react"

export default async function EndorsementsPage() {
  const supabase = await createClient()

  const { data: endorsements } = await supabase
    .from("endorsements")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Endorsements</h1>
              <p className="text-amber-100 text-sm">What experts are saying about us</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Endorsements */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {endorsements?.map((endorsement) => (
            <Card
              key={endorsement.id}
              className="border-2 border-amber-200 hover:border-amber-400 transition-all hover:shadow-xl bg-white/90 backdrop-blur"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center">
                      {endorsement.photo_url ? (
                        <img
                          src={endorsement.photo_url || "/placeholder.svg"}
                          alt={endorsement.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-stone-400" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Quote */}
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-amber-400 mb-2" />
                      <p className="text-lg text-stone-700 italic leading-relaxed">{endorsement.quote}</p>
                    </div>

                    {/* Name and Job */}
                    <div>
                      <p className="text-xl font-bold text-stone-900">{endorsement.name}</p>
                      <p className="text-stone-600">{endorsement.job_title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {endorsements?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600 text-xl">No endorsements yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  )
}
