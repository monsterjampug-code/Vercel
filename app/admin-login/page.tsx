"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Attempting admin login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log("[v0] Login error:", error)
        throw error
      }

      console.log("[v0] Login successful, checking admin permissions...")

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("permission_level")
          .eq("id", data.user.id)
          .single()

        console.log("[v0] User profile:", profile)

        if (profile?.permission_level !== "admin") {
          await supabase.auth.signOut()
          throw new Error("Unauthorized: Admin access only")
        }

        console.log("[v0] Admin verified, redirecting to /dashboard")
        window.location.href = "/dashboard"
      }
    } catch (error: unknown) {
      console.log("[v0] Error during admin login:", error)
      setError(error instanceof Error ? error.message : "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-900 to-stone-800 p-4">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 left-10 text-9xl">🦴</div>
        <div className="absolute top-40 right-20 text-8xl">🏺</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">🗿</div>
        <div className="absolute bottom-32 right-1/3 text-9xl">🦖</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-stone-300">Authorized Personnel Only</p>
        </div>

        <Card className="border-2 border-red-900 shadow-2xl bg-stone-950">
          <CardHeader className="bg-gradient-to-r from-red-950 to-stone-950">
            <CardTitle className="text-2xl text-red-400">Administrator Login</CardTitle>
            <CardDescription className="text-stone-400">
              Enter admin credentials to access system controls
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-stone-300">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-stone-700 bg-stone-900 text-white"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-stone-300">
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-red-900 focus:border-red-600 bg-stone-900 text-white"
                    placeholder="Enter admin password"
                  />
                </div>
                {error && <p className="text-sm text-red-400 bg-red-950 p-2 rounded border border-red-900">{error}</p>}
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Access Admin Panel"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-stone-400 hover:text-stone-300 text-sm underline">
            Return to regular login
          </a>
        </div>
      </div>
    </div>
  )
}
