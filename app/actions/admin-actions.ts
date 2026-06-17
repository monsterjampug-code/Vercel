"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(
  userId: string,
  data: {
    display_name: string
    email: string
    permission_level: string
  },
) {
  console.log("[v0] updateUserProfile called with:", { userId, data })

  const supabase = await createClient()

  // Verify the current user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Current user:", user?.id)

  if (!user) {
    console.log("[v0] Not authenticated")
    return { error: "Not authenticated" }
  }

  const { data: adminProfile, error: profileError } = await supabase
    .from("profiles")
    .select("permission_level")
    .eq("id", user.id)
    .single()

  console.log("[v0] Admin profile check:", { adminProfile, profileError })

  if (adminProfile?.permission_level !== "admin") {
    console.log("[v0] Not authorized - user permission:", adminProfile?.permission_level)
    return { error: "Not authorized - admin access required" }
  }

  console.log("[v0] Attempting to update profile with admin client:", userId)
  const adminClient = createAdminClient()

  const { data: updateData, error } = await adminClient
    .from("profiles")
    .update({
      display_name: data.display_name,
      email: data.email,
      permission_level: data.permission_level,
    })
    .eq("id", userId)
    .select()

  console.log("[v0] Update result:", { updateData, error })

  if (error) {
    console.error("[v0] Error updating user profile:", error)
    return { error: error.message }
  }

  if (!updateData || updateData.length === 0) {
    console.error("[v0] No rows updated - possible RLS issue")
    return { error: "Failed to update profile - no rows affected" }
  }

  revalidatePath("/admin/users")
  console.log("[v0] Profile updated successfully")
  return { success: true, data: updateData[0] }
}
