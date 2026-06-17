import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This route creates the premade admin account
// Call this once to set up the admin user
export async function POST() {
  try {
    // Create a Supabase admin client using service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if admin user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users.find((user) => user.email === "admin@admin.com")

    if (existingAdmin) {
      if (!existingAdmin.email_confirmed_at) {
        console.log("[v0] Admin exists but email not confirmed, deleting and recreating...")
        await supabase.auth.admin.deleteUser(existingAdmin.id)
      } else {
        return NextResponse.json({
          message: "Admin account already exists and is confirmed",
          email: "admin@admin.com",
        })
      }
    }

    // Create the admin user with confirmed email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "admin@admin.com",
      password: "RoboticsE",
      email_confirm: true, // Auto-confirm the email to bypass verification
      user_metadata: {
        username: "Admin",
      },
    })

    if (authError) {
      console.error("[v0] Error creating admin user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Wait a moment for the profile trigger to run
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the profile to admin permission level
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        permission_level: "admin",
        is_admin: true,
        username: "Admin",
      })
      .eq("id", authData.user.id)

    if (profileError) {
      console.error("[v0] Error updating admin profile:", profileError)
      // Continue anyway, the profile trigger should have created it
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully with confirmed email",
      email: "admin@admin.com",
      password: "RoboticsE",
    })
  } catch (error) {
    console.error("[v0] Setup admin error:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
