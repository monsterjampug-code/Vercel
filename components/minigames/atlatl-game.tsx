"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { Target, RotateCcw } from "lucide-react"

interface AtlatlGameProps {
  artifact: any
  userId: string
  currentHighScore: number
}

export function AtlatlGame({ artifact, userId, currentHighScore }: AtlatlGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(currentHighScore)
  const [spearFlying, setSpearFlying] = useState(false)
  const [power, setPower] = useState(0)
  const [charging, setCharging] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [targets, setTargets] = useState<Array<{ x: number; y: number; radius: number; hit: boolean }>>([])

  useEffect(() => {
    // Generate random targets
    const newTargets = []
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        radius: 20 + Math.random() * 30,
        hit: false,
      })
    }
    setTargets(newTargets)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#fef3c7"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.fillStyle = "#d6d3d1"
    ctx.fillRect(0, 350, canvas.width, 50)

    // Draw targets
    targets.forEach((target) => {
      if (!target.hit) {
        // Target circles
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw player with atlatl
    ctx.fillStyle = "#78350f"
    ctx.fillRect(40, 320, 20, 30) // Body
    ctx.beginPath()
    ctx.arc(50, 310, 10, 0, Math.PI * 2)
    ctx.fill() // Head

    // Draw atlatl/spear
    if (charging) {
      ctx.strokeStyle = "#92400e"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(60, 325)
      ctx.lineTo(60 + power, 325 - power * 0.5)
      ctx.stroke()
    }
  }, [targets, charging, power])

  const handleMouseDown = () => {
    if (spearFlying || gameOver) return
    setCharging(true)
    const interval = setInterval(() => {
      setPower((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 2
      })
    }, 20)
  }

  const handleMouseUp = async () => {
    if (!charging || gameOver) return
    setCharging(false)
    setSpearFlying(true)

    // Simulate spear trajectory and check for hits
    const trajectory = { x: 60 + power * 1.5, y: 325 - power * 1.2 }

    let hit = false
    const updatedTargets = targets.map((target) => {
      const distance = Math.sqrt(Math.pow(trajectory.x - target.x, 2) + Math.pow(trajectory.y - target.y, 2))
      if (distance < target.radius && !target.hit) {
        hit = true
        return { ...target, hit: true }
      }
      return target
    })

    if (hit) {
      const points = Math.floor(power)
      const newScore = score + points
      setScore(newScore)

      if (newScore > highScore) {
        setHighScore(newScore)
        await saveScore(newScore)
      }
    }

    setTargets(updatedTargets)
    setPower(0)

    setTimeout(() => {
      setSpearFlying(false)
      // Check if all targets hit
      if (updatedTargets.every((t) => t.hit)) {
        setGameOver(true)
      }
    }, 500)
  }

  const saveScore = async (newScore: number) => {
    const supabase = createBrowserClient()

    const { data: existing } = await supabase
      .from("minigame_scores")
      .select("*")
      .eq("artifact_id", artifact.id)
      .eq("user_id", userId)
      .single()

    if (existing) {
      await supabase
        .from("minigame_scores")
        .update({
          score: newScore,
          high_score: Math.max(existing.high_score, newScore),
          plays: existing.plays + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("minigame_scores").insert({
        user_id: userId,
        artifact_id: artifact.id,
        game_type: "atlatl",
        score: newScore,
        high_score: newScore,
        plays: 1,
      })
    }
  }

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    setPower(0)
    const newTargets = []
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        radius: 20 + Math.random() * 30,
        hit: false,
      })
    }
    setTargets(newTargets)
  }

  return (
    <Card className="border-2 border-purple-300 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Target className="w-6 h-6" />
          {artifact.name} - Target Practice
        </CardTitle>
        <CardDescription>Hold mouse button to charge, release to throw. Hit all targets!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-stone-600">Score: </span>
            <span className="text-2xl font-bold text-purple-700">{score}</span>
          </div>
          <div>
            <span className="text-sm text-stone-600">High Score: </span>
            <span className="text-2xl font-bold text-amber-700">{highScore}</span>
          </div>
          <div>
            <span className="text-sm text-stone-600">Power: </span>
            <span className="text-xl font-bold text-blue-700">{power}%</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-stone-300 rounded-lg cursor-crosshair w-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (charging) {
              setCharging(false)
              setPower(0)
            }
          }}
        />

        {gameOver && (
          <div className="text-center space-y-4 bg-purple-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900">All Targets Hit!</h3>
            <p className="text-stone-700">Final Score: {score}</p>
            <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
