import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SniffyCustomizer } from "@/components/sniffy-customizer"

export default async function SniffyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's Sniffy customization
  const { data: customization } = await supabase
    .from("sniffy_customization")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4 bg-transparent">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Customize Sniffy</h1>
          <p className="text-stone-600">Personalize your loyal archaeological companion</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <Card className="border-2 border-amber-300 h-fit sticky top-8">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-stone-100">
              <CardTitle className="text-2xl text-amber-900">Sniffy Preview</CardTitle>
              <CardDescription>Your personalized archaeological companion</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className={`relative w-full aspect-square rounded-xl border-4 border-amber-200 overflow-hidden ${
                  customization?.background === "desert"
                    ? "bg-gradient-to-b from-yellow-200 to-yellow-400"
                    : customization?.background === "cave"
                      ? "bg-gradient-to-b from-stone-400 to-stone-600"
                      : customization?.background === "jungle"
                        ? "bg-gradient-to-b from-green-300 to-green-500"
                        : customization?.background === "ruins"
                          ? "bg-gradient-to-b from-gray-300 to-stone-400"
                          : "bg-gradient-to-b from-blue-200 to-blue-400"
                }`}
              >
                {/* Background elements */}
                <div className="absolute inset-0">
                  {customization?.background === "desert" && (
                    <>
                      <div className="absolute bottom-0 left-0 text-6xl opacity-50">🌵</div>
                      <div className="absolute top-10 right-10 text-8xl">☀️</div>
                    </>
                  )}
                  {customization?.background === "cave" && (
                    <>
                      <div className="absolute top-5 left-5 text-4xl">🪨</div>
                      <div className="absolute bottom-10 right-10 text-4xl">🪨</div>
                    </>
                  )}
                  {customization?.background === "jungle" && (
                    <>
                      <div className="absolute top-0 left-0 text-5xl">🌿</div>
                      <div className="absolute top-0 right-0 text-5xl">🍃</div>
                    </>
                  )}
                  {customization?.background === "ruins" && (
                    <>
                      <div className="absolute bottom-5 left-5 text-5xl">🏛️</div>
                      <div className="absolute top-5 right-5 text-4xl">⚱️</div>
                    </>
                  )}
                </div>

                {/* Sniffy character */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                  {/* Accessory (behind dog) */}
                  {customization?.accessory === "backpack" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl z-0">🎒</div>
                  )}

                  {/* Dog body */}
                  <div
                    className="text-8xl relative z-10"
                    style={{
                      filter:
                        customization?.body_color === "brown"
                          ? "none"
                          : customization?.body_color === "golden"
                            ? "hue-rotate(30deg) brightness(1.2)"
                            : customization?.body_color === "white"
                              ? "brightness(1.8) saturate(0)"
                              : "hue-rotate(180deg)",
                    }}
                  >
                    🐕
                  </div>

                  {/* Hat */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl z-20">
                    {customization?.hat === "explorer" && "🎩"}
                    {customization?.hat === "safari" && "🧢"}
                    {customization?.hat === "fedora" && "🤠"}
                    {customization?.hat === "helmet" && "⛑️"}
                    {customization?.hat === "none" && ""}
                  </div>

                  {/* Accessory (in front of dog) */}
                  {customization?.accessory === "magnifying-glass" && (
                    <div className="absolute -right-8 top-8 text-4xl z-30">🔍</div>
                  )}
                  {customization?.accessory === "shovel" && (
                    <div className="absolute -right-10 top-4 text-4xl z-30">⛏️</div>
                  )}
                  {customization?.accessory === "compass" && (
                    <div className="absolute -left-8 top-8 text-3xl z-30">🧭</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <div>
            <SniffyCustomizer userId={user.id} initialCustomization={customization} />
          </div>
        </div>
      </div>
    </div>
  )
}
