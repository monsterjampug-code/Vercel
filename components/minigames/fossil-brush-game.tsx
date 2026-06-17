"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { RotateCcw } from "lucide-react"

interface FossilBrushGameProps {
  artifact: any
  userId: string
  currentHighScore: number
}

export function FossilBrushGame({ artifact, userId, currentHighScore }: FossilBrushGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(0)
  const [highScore, setHighScore] = useState(currentHighScore)
  const [gameOver, setGameOver] = useState(false)
  const [brushing, setBrushing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw dirt overlay
    ctx.fillStyle = "#92400e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw fossil shape underneath (revealed areas)
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = "#e7e5e4"

    // Draw a dinosaur bone shape
    ctx.beginPath()
    ctx.ellipse(200, 150, 80, 30, 0, 0, Math.PI * 2)
    ctx.ellipse(300, 150, 60, 25, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillRect(180, 140, 140, 20)

    ctx.globalCompositeOperation = "source-over"
  }, [])

  const handleBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver || !brushing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // "Brush away" dirt in circle
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = "source-over"

    // Calculate revealed percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++
    }

    const revealedPercent = Math.floor((transparentPixels / (canvas.width * canvas.height)) * 100)
    setRevealed(revealedPercent)

    if (revealedPercent >= 70 && !gameOver) {
      setGameOver(true)
      saveScore(revealedPercent)
      if (revealedPercent > highScore) {
        setHighScore(revealedPercent)
      }
    }
  }

  const saveScore = async (score: number) => {
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
          score: score,
          high_score: Math.max(existing.high_score, score),
          plays: existing.plays + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("minigame_scores").insert({
        user_id: userId,
        artifact_id: artifact.id,
        game_type: "fossil_brush",
        score: score,
        high_score: score,
        plays: 1,
      })
    }
  }

  const resetGame = () => {
    setGameOver(false)
    setRevealed(0)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#92400e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = "#e7e5e4"
    ctx.beginPath()
    ctx.ellipse(200, 150, 80, 30, 0, 0, Math.PI * 2)
    ctx.ellipse(300, 150, 60, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(180, 140, 140, 20)
    ctx.globalCompositeOperation = "source-over"
  }

  return (
    <Card className="border-2 border-purple-300 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900">🦴 {artifact.name} - Excavation</CardTitle>
        <CardDescription>Carefully brush away the dirt to reveal the fossil. Reveal 70% to complete!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-stone-600">Revealed: </span>
            <span className="text-2xl font-bold text-purple-700">{revealed}%</span>
          </div>
          <div>
            <span className="text-sm text-stone-600">High Score: </span>
            <span className="text-2xl font-bold text-amber-700">{highScore}%</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className="border-2 border-stone-300 rounded-lg cursor-crosshair w-full bg-amber-50"
          onMouseDown={() => setBrushing(true)}
          onMouseUp={() => setBrushing(false)}
          onMouseMove={handleBrush}
          onMouseLeave={() => setBrushing(false)}
        />

        <p className="text-sm text-stone-600 text-center">Click and drag to brush away the dirt</p>

        {gameOver && (
          <div className="text-center space-y-4 bg-purple-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900">Fossil Revealed!</h3>
            <p className="text-stone-700">You revealed {revealed}% of the fossil!</p>
            <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Excavate Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
