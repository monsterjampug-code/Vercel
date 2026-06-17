"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { RotateCcw, CheckCircle } from "lucide-react"

interface PotteryPuzzleGameProps {
  artifact: any
  userId: string
  currentHighScore: number
}

export function PotteryPuzzleGame({ artifact, userId, currentHighScore }: PotteryPuzzleGameProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; placed: boolean; position: number }>>([])
  const [moves, setMoves] = useState(0)
  const [highScore, setHighScore] = useState(currentHighScore)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    // Initialize puzzle pieces
    const initialPieces = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      placed: false,
      position: i,
    })).sort(() => Math.random() - 0.5)
    setPieces(initialPieces)
  }, [])

  const handlePieceClick = (piece: any) => {
    if (gameOver || piece.placed) return

    const newPieces = pieces.map((p) => (p.id === piece.id ? { ...p, placed: true } : p))
    setPieces(newPieces)
    setMoves(moves + 1)

    // Check if all placed
    if (newPieces.every((p) => p.placed)) {
      setGameOver(true)
      const score = Math.max(100 - moves * 5, 0)
      if (score > highScore) {
        setHighScore(score)
        saveScore(score)
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
          score,
          high_score: Math.max(existing.high_score, score),
          plays: existing.plays + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("minigame_scores").insert({
        user_id: userId,
        artifact_id: artifact.id,
        game_type: "pottery_puzzle",
        score,
        high_score: score,
        plays: 1,
      })
    }
  }

  const resetGame = () => {
    const initialPieces = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      placed: false,
      position: i,
    })).sort(() => Math.random() - 0.5)
    setPieces(initialPieces)
    setMoves(0)
    setGameOver(false)
  }

  return (
    <Card className="border-2 border-purple-300 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900">🏺 {artifact.name} - Restoration</CardTitle>
        <CardDescription>
          Click the pottery fragments in order to restore the vessel. Fewer moves = higher score!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-stone-600">Moves: </span>
            <span className="text-2xl font-bold text-purple-700">{moves}</span>
          </div>
          <div>
            <span className="text-sm text-stone-600">High Score: </span>
            <span className="text-2xl font-bold text-amber-700">{highScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece.id}
              onClick={() => handlePieceClick(piece)}
              disabled={piece.placed}
              className={`h-32 border-2 rounded-lg transition-all ${
                piece.placed
                  ? "bg-green-100 border-green-400"
                  : "bg-amber-100 border-amber-400 hover:border-amber-600 hover:shadow-lg"
              }`}
            >
              {piece.placed ? (
                <div className="flex items-center justify-center h-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-2">🏺</div>
                  <div className="text-sm text-stone-600">Fragment {piece.id + 1}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {gameOver && (
          <div className="text-center space-y-4 bg-purple-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900">Pottery Restored!</h3>
            <p className="text-stone-700">Completed in {moves} moves</p>
            <p className="text-stone-700">Score: {Math.max(100 - moves * 5, 0)}</p>
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
