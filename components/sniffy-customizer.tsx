"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

interface SniffyCustomization {
  hat: string
  body_color: string
  accessory: string
  background: string
}

const HATS = [
  { id: "explorer", label: "Explorer Hat", icon: "🎩" },
  { id: "safari", label: "Safari Cap", icon: "🧢" },
  { id: "fedora", label: "Fedora", icon: "🤠" },
  { id: "helmet", label: "Safety Helmet", icon: "⛑️" },
  { id: "none", label: "No Hat", icon: "❌" },
]

const BODY_COLORS = [
  { id: "brown", label: "Brown", color: "bg-amber-700" },
  { id: "golden", label: "Golden", color: "bg-yellow-600" },
  { id: "white", label: "White", color: "bg-gray-100" },
  { id: "black", label: "Black", color: "bg-gray-900" },
]

const ACCESSORIES = [
  { id: "magnifying-glass", label: "Magnifying Glass", icon: "🔍" },
  { id: "shovel", label: "Shovel", icon: "⛏️" },
  { id: "compass", label: "Compass", icon: "🧭" },
  { id: "backpack", label: "Backpack", icon: "🎒" },
  { id: "none", label: "None", icon: "❌" },
]

const BACKGROUNDS = [
  { id: "desert", label: "Desert", gradient: "from-yellow-200 to-yellow-400" },
  { id: "cave", label: "Cave", gradient: "from-stone-400 to-stone-600" },
  { id: "jungle", label: "Jungle", gradient: "from-green-300 to-green-500" },
  { id: "ruins", label: "Ruins", gradient: "from-gray-300 to-stone-400" },
  { id: "ocean", label: "Ocean", gradient: "from-blue-200 to-blue-400" },
]

export function SniffyCustomizer({
  userId,
  initialCustomization,
}: {
  userId: string
  initialCustomization: SniffyCustomization | null
}) {
  const [customization, setCustomization] = useState<SniffyCustomization>({
    hat: initialCustomization?.hat || "explorer",
    body_color: initialCustomization?.body_color || "brown",
    accessory: initialCustomization?.accessory || "magnifying-glass",
    background: initialCustomization?.background || "desert",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("sniffy_customization")
        .upsert(
          {
            user_id: userId,
            ...customization,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        )
        .select()

      if (error) throw error

      setMessage({ type: "success", text: "Sniffy has been customized successfully!" })
      router.refresh()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save customization. Please try again." })
      console.error("Failed to save customization:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hats */}
      <Card className="border-2 border-stone-300">
        <CardHeader>
          <CardTitle className="text-xl text-stone-900">Hat</CardTitle>
          <CardDescription>Choose a hat for Sniffy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {HATS.map((hat) => (
              <button
                key={hat.id}
                onClick={() => setCustomization({ ...customization, hat: hat.id })}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  customization.hat === hat.id
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : "border-stone-200 bg-white hover:border-amber-300"
                }`}
              >
                <div className="text-4xl mb-2">{hat.icon}</div>
                <div className="text-xs font-medium text-stone-700">{hat.label}</div>
                {customization.hat === hat.id && <Check className="w-5 h-5 text-amber-600 mx-auto mt-1" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Body Color */}
      <Card className="border-2 border-stone-300">
        <CardHeader>
          <CardTitle className="text-xl text-stone-900">Body Color</CardTitle>
          <CardDescription>Select Sniffy's fur color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {BODY_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setCustomization({ ...customization, body_color: color.id })}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  customization.body_color === color.id
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : "border-stone-200 bg-white hover:border-amber-300"
                }`}
              >
                <div className={`w-12 h-12 ${color.color} rounded-full mx-auto mb-2 border-2 border-stone-300`} />
                <div className="text-xs font-medium text-stone-700">{color.label}</div>
                {customization.body_color === color.id && <Check className="w-5 h-5 text-amber-600 mx-auto mt-1" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessories */}
      <Card className="border-2 border-stone-300">
        <CardHeader>
          <CardTitle className="text-xl text-stone-900">Accessory</CardTitle>
          <CardDescription>Equip Sniffy with tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {ACCESSORIES.map((accessory) => (
              <button
                key={accessory.id}
                onClick={() => setCustomization({ ...customization, accessory: accessory.id })}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  customization.accessory === accessory.id
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : "border-stone-200 bg-white hover:border-amber-300"
                }`}
              >
                <div className="text-4xl mb-2">{accessory.icon}</div>
                <div className="text-xs font-medium text-stone-700">{accessory.label}</div>
                {customization.accessory === accessory.id && <Check className="w-5 h-5 text-amber-600 mx-auto mt-1" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background */}
      <Card className="border-2 border-stone-300">
        <CardHeader>
          <CardTitle className="text-xl text-stone-900">Background</CardTitle>
          <CardDescription>Set the environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setCustomization({ ...customization, background: bg.id })}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  customization.background === bg.id
                    ? "border-amber-500 shadow-md"
                    : "border-stone-200 hover:border-amber-300"
                }`}
              >
                <div className={`w-full h-16 bg-gradient-to-b ${bg.gradient} rounded-md mb-2`} />
                <div className="text-xs font-medium text-stone-700">{bg.label}</div>
                {customization.background === bg.id && <Check className="w-5 h-5 text-amber-600 mx-auto mt-1" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4">
        <Button
          onClick={handleSave}
          className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Customization"}
        </Button>
        {message && (
          <div
            className={`mt-3 p-3 rounded-lg text-center ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
