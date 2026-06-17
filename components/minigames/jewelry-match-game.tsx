"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { RotateCcw } from "lucide-react"

interface JewelryMatchGameProps {
  artifact: any
  userId: string
  currentHighScore: number
}

const GEMS = ["💎", "💍", "👑", "📿", "✨", "🔮"]

export function JewelryMatchGame({ artifact, userId, currentHighScore }: JewelryMatchGameProps) {
  const [cards, setCards] = useState<Array<{ id: number; gem: string; flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [highScore, setHighScore] = useState(currentHighScore)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    resetGame()
  }, [])

  const initializeCards = () => {
    const gems = [...GEMS, ...GEMS]
    const shuffled = gems
      .sort(() => Math.random() - 0.5)
      .map((gem, index) => ({
        id: index,
        gem,
        flipped: false,
        matched: false,
      }))
    setCards(shuffled)
  }

  const handleCardClick = (cardId: number) => {
    if (gameOver || flippedCards.length >= 2) return
    const card = cards.find((c) => c.id === cardId)
    if (!card || card.flipped || card.matched) return

    const newCards = cards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    setCards(newCards)

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      const firstCard = newCards.find((c) => c.id === first)
      const secondCard = newCards.find((c) => c.id === second)

      if (firstCard?.gem === secondCard?.gem) {
        setTimeout(() => {
          const matched = newCards.map((c) => (c.id === first || c.id === second ? { ...c, matched: true } : c))
          setCards(matched)
          setFlippedCards([])

          if (matched.every((c) => c.matched)) {
            setGameOver(true)
            const score = Math.max(100 - moves * 2, 10)
            if (score > highScore) {
              setHighScore(score)
              saveScore(score)
            }
          }
        }, 500)
      } else {
        setTimeout(() => {
          const unflipped = newCards.map((c) => (c.id === first || c.id === second ? { ...c, flipped: false } : c))
          setCards(unflipped)
          setFlippedCards([])
        }, 1000)
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
        game_type: "jewelry_match",
        score,
        high_score: score,
        plays: 1,
      })
    }
  }

  const resetGame = () => {
    initializeCards()
    setFlippedCards([])
    setMoves(0)
    setGameOver(false)
  }

  return (
    <Card className="border-2 border-purple-300 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900">💍 {artifact.name} - Pattern Matching</CardTitle>
        <CardDescription>Match pairs of gems. Fewer moves = higher score!</CardDescription>
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

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square border-2 rounded-lg text-4xl flex items-center justify-center transition-all ${
                card.matched
                  ? "bg-green-100 border-green-400"
                  : card.flipped
                    ? "bg-purple-100 border-purple-400"
                    : "bg-amber-100 border-amber-400 hover:border-amber-600 hover:shadow-lg"
              }`}
            >
              {card.flipped || card.matched ? card.gem : "?"}
            </button>
          ))}
        </div>

        {gameOver && (
          <div className="text-center space-y-4 bg-purple-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900">All Pairs Matched!</h3>
            <p className="text-stone-700">Completed in {moves} moves</p>
            <p className="text-stone-700">Score: {Math.max(100 - moves * 2, 10)}</p>
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
