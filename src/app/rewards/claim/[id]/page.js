"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import QRCode from "react-qr-code"

export default function ClaimRewardPage() {
  const { id } = useParams()
  const router = useRouter()
  const [reward, setReward] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qrValue, setQrValue] = useState(null)

  useEffect(() => {
    if (id) {
      const storedRewards = localStorage.getItem("rewards")
      const rewards = storedRewards ? JSON.parse(storedRewards) : []
      const foundReward = rewards.find((r) => r.id.toString() === id)
      setReward(foundReward)
      setLoading(false)
    }
  }, [id])

  const handleClaim = () => {
    const storedRewards = localStorage.getItem("rewards")
    let rewards = storedRewards ? JSON.parse(storedRewards) : []
    const rewardIndex = rewards.findIndex((r) => r.id.toString() === id)
    if (rewardIndex > -1) {
      if (rewards[rewardIndex].quantity > 1) {
        rewards[rewardIndex].quantity -= 1
      } else {
        rewards = rewards.filter((r) => r.id.toString() !== id)
      }
      localStorage.setItem("rewards", JSON.stringify(rewards))
    }
    const randomCode = Math.random().toString(36).substring(2, 10)
    setQrValue(randomCode)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!reward) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Reward not found or fully claimed.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold text-green-500">Claim Reward</h1>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-green-100 text-black">
        <div className="p-6">
          <h2 className="mb-4 text-3xl font-bold">{reward.title}</h2>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 space-y-4">
              <p className="text-lg">{reward.description}</p>
              <p className="text-lg">
                <span className="font-semibold">Owner:</span> {reward.owner}
              </p>
              <p className="text-lg font-bold">Quantity Available: {reward.quantity}</p>

              <p className="text-lg font-bold">Coins Required: {reward.coins}</p>
              {qrValue ? (
                <div className="space-y-4 text-center">
                  <p className="text-lg font-semibold">Show this QR code at the store:</p>
                  <div className="mx-auto w-32">
                    <QRCode value={qrValue} size={128} />
                  </div>
                  <p className="text-lg">
                    Code: <span className="font-mono font-bold">{qrValue}</span>
                  </p>
                  <button
                    onClick={() => router.push("/rewards")}
                    className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleClaim}
                  className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
                >
                  Claim Reward
                </button>
              )}
            </div>
            {reward.image && (
              <div className="mt-4 flex flex-1 items-center justify-center md:mt-0">
                <img
                  src={reward.image || "/placeholder.svg"}
                  alt={reward.title}
                  className="max-h-80 w-full rounded-lg object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
