"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function SetupAdminPage() {
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const setupAdmin = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(
          data.message === "Admin account already exists and is confirmed"
            ? "✓ Admin account already exists and is ready to use!"
            : "✓ Admin account created successfully with email confirmed!\n\nEmail: admin@admin.com\nPassword: RoboticsE\n\nYou can now log in without email verification.",
        )
      } else {
        setResult(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`✗ Error: ${error instanceof Error ? error.message : "Failed to setup admin"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-stone-100 p-4">
      <Card className="w-full max-w-md border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-stone-100">
          <CardTitle className="text-2xl text-amber-900">Setup Admin Account</CardTitle>
          <CardDescription className="text-stone-600">
            Create the premade admin account for the archaeology website
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-stone-600">Click the button below to create the admin account with:</p>
            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-sm font-mono">
                <strong>Email:</strong> admin@admin.com
              </p>
              <p className="text-sm font-mono">
                <strong>Password:</strong> RoboticsE
              </p>
            </div>
            <Button onClick={setupAdmin} disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-700">
              {isLoading ? "Setting up..." : "Create Admin Account"}
            </Button>
            {result && (
              <div
                className={`p-3 rounded whitespace-pre-line text-sm ${
                  result.startsWith("✓")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {result}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
