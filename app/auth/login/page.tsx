"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-stone-100 p-3 sm:p-4">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-4 sm:left-10 text-6xl sm:text-9xl">🦴</div>
        <div className="absolute top-40 right-10 sm:right-20 text-5xl sm:text-8xl">🏺</div>
        <div className="absolute bottom-20 left-1/4 text-5xl sm:text-7xl">🗿</div>
        <div className="absolute bottom-32 right-1/3 text-6xl sm:text-9xl">🦖</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">Archaeological Explorer</h1>
          <p className="text-sm sm:text-base text-stone-600">Uncover the secrets of the past</p>
        </div>

        <Card className="border-2 border-amber-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-stone-100">
            <CardTitle className="text-2xl text-amber-900">Login</CardTitle>
            <CardDescription className="text-stone-600">
              Enter your credentials to continue your expedition
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-stone-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="archaeologist@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-stone-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Begin Expedition"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm text-stone-600">
                New explorer?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-4"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
