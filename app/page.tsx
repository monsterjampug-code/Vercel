import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-100 to-amber-100">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 left-10 text-9xl">🦴</div>
        <div className="absolute top-1/4 right-20 text-8xl">🏺</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🗿</div>
        <div className="absolute bottom-20 right-1/3 text-9xl">🦖</div>
        <div className="absolute bottom-32 left-20 text-8xl">⛏️</div>
      </div>

      <div className="absolute top-4 left-2 right-2 sm:top-6 sm:left-6 sm:right-6 z-20 flex justify-between gap-2">
        <Button
          asChild
          variant="outline"
          className="bg-white/90 backdrop-blur border-amber-300 hover:bg-amber-50 hover:border-amber-400 shadow-lg text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
        >
          <Link href="/team" className="flex items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-xl">👥</span>
            <span className="font-semibold text-amber-900 hidden sm:inline">Meet the Team</span>
            <span className="font-semibold text-amber-900 sm:hidden">Team</span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="bg-white/90 backdrop-blur border-amber-300 hover:bg-amber-50 hover:border-amber-400 shadow-lg text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
        >
          <Link href="/endorsements" className="flex items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-xl">⭐</span>
            <span className="font-semibold text-amber-900 hidden sm:inline">Expert Endorsements</span>
            <span className="font-semibold text-amber-900 sm:hidden">Reviews</span>
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center pt-12 sm:pt-0">
          <div className="text-6xl sm:text-8xl mb-6 sm:mb-8">🏛️</div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-amber-900 mb-4 sm:mb-6 text-balance px-2">
            Archaeological Explorer
          </h1>
          <p className="text-lg sm:text-2xl text-stone-700 mb-8 sm:mb-12 text-pretty px-4">
            Embark on thrilling excavation runs, discover ancient artifacts, and uncover the secrets of lost
            civilizations
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
            >
              <Link href="/auth/sign-up">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-amber-600 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-transparent"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">⛏️</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Excavation Runs</h3>
                <p className="text-stone-600">
                  Start digging at various sites around the world and uncover hidden treasures
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Learn Archaeology</h3>
                <p className="text-stone-600">
                  Access lessons about fossils, ancient civilizations, and dating methods
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Team Missions</h3>
                <p className="text-stone-600">Collaborate with other explorers on challenging team expeditions</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🐕</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Customize Sniffy</h3>
                <p className="text-stone-600">Personalize your loyal archaeological companion with unique items</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🏺</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Artifact Library</h3>
                <p className="text-stone-600">Build your personal collection of discovered ancient artifacts</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🦖</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Fossil Discoveries</h3>
                <p className="text-stone-600">Find prehistoric fossils from different eras throughout history</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
