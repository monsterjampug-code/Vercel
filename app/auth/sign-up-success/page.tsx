import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-stone-100 p-4">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🦴</div>
        <div className="absolute top-40 right-20 text-8xl">🏺</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">🗿</div>
        <div className="absolute bottom-32 right-1/3 text-9xl">🦖</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-2 border-amber-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-stone-100 text-center">
            <div className="text-6xl mb-4">📧</div>
            <CardTitle className="text-2xl text-amber-900">Check Your Email</CardTitle>
            <CardDescription className="text-stone-600">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-stone-700 mb-6">
              Please check your email and click the confirmation link to activate your account and begin your
              archaeological journey!
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
