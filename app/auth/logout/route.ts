import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  const origin = new URL(request.url).origin

  return NextResponse.redirect(new URL("/auth/login", origin))
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  const origin = new URL(request.url).origin

  return NextResponse.redirect(new URL("/auth/login", origin))
}
