"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { RotateCcw } from "lucide-react"

interface CoinIdentifyGameProps {
  artifact: any
  userId: string
  currentHighScore: number
}

const COIN_QUESTIONS = [
  {
    question: "This coin shows Julius Caesar. What era is it from?",
    options: ["Ancient Rome", "Medieval", "Renaissance", "Modern"],
    correct: 0,
  },
  {
    question: "This ancient Greek drachma was used for what?",
    options: ["Decoration", "Currency", "Religious ceremonies", "Weaponry"],
    correct: 1,
  },
  {
    question: "Byzantine coins often featured which imagery?",
    options: ["Animals", "Christian symbols", "Ships", "Mountains"],
    correct: 1,
  },
]

export function CoinIdentifyGame({ artifact, userId, currentHighScore }: CoinIdentifyGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(currentHighScore)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)

    if (answerIndex === COIN_QUESTIONS[currentQuestion].correct) {
      const newScore = score + 10
      setScore(newScore)

      if (newScore > highScore) {
        setHighScore(newScore)
      }
    }

    setTimeout(() => {
      if (currentQuestion < COIN_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setGameOver(true)
        const finalScore = answerIndex === COIN_QUESTIONS[currentQuestion].correct ? score + 10 : score
        if (finalScore > currentHighScore) {
          saveScore(finalScore)
        }
      }
    }, 1500)
  }

  const saveScore = async (finalScore: number) => {
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
          score: finalScore,
          high_score: Math.max(existing.high_score, finalScore),
          plays: existing.plays + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("minigame_scores").insert({
        user_id: userId,
        artifact_id: artifact.id,
        game_type: "coin_identify",
        score: finalScore,
        high_score: finalScore,
        plays: 1,
      })
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setSelectedAnswer(null)
  }

  return (
    <Card className="border-2 border-purple-300 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900">🪙 {artifact.name} - Identification</CardTitle>
        <CardDescription>Test your knowledge of ancient coins and currency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-stone-600">Question: </span>
            <span className="text-2xl font-bold text-purple-700">
              {currentQuestion + 1}/{COIN_QUESTIONS.length}
            </span>
          </div>
          <div>
            <span className="text-sm text-stone-600">Score: </span>
            <span className="text-2xl font-bold text-amber-700">{score}</span>
          </div>
        </div>

        {!gameOver ? (
          <>
            <div className="text-center">
              <div className="text-6xl mb-4">🪙</div>
              <h3 className="text-xl font-semibold text-stone-800 mb-6">{COIN_QUESTIONS[currentQuestion].question}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {COIN_QUESTIONS[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`h-16 text-lg ${
                    selectedAnswer === index
                      ? index === COIN_QUESTIONS[currentQuestion].correct
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 bg-purple-100 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900">Quiz Complete!</h3>
            <p className="text-stone-700">
              Final Score: {score} / {COIN_QUESTIONS.length * 10}
            </p>
            <p className="text-stone-600">High Score: {highScore}</p>
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
