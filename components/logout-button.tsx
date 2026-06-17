"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}
