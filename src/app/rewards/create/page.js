"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import { PlusCircle, Upload } from "lucide-react"

export default function CreateReward() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [owner, setOwner] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [image, setImage] = useState(null)
  const router = useRouter()

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result)
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error("Error compressing image:", error)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newReward = {
      id: Date.now(),
      title,
      description,
      owner,
      quantity: Number(quantity),
      image,
    }

    const storedRewards = localStorage.getItem("rewards")
    const rewards = storedRewards ? JSON.parse(storedRewards) : []
    rewards.push(newReward)

    try {
      localStorage.setItem("rewards", JSON.stringify(rewards))
      router.push("/rewards")
    } catch (error) {
      console.error("Error saving reward:", error)
      alert(
        "Unable to save reward: Storage quota exceeded. Please try uploading a smaller image or remove some rewards.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-green-500">
          Create Reward
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
              required
            />
          </div>

          <div>
            <label htmlFor="owner" className="block text-lg font-medium mb-2">
              Owner
            </label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Coffee House, Gas Station"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-lg font-medium mb-2">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-lg font-medium mb-2">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 800x800px)</p>
                </div>
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            {image && (
              <img
                src={image || "/placeholder.svg"}
                alt="Reward Preview"
                className="mt-4 max-w-xs mx-auto rounded-lg border-2 border-green-500"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <PlusCircle className="mr-2" />
            Create Reward
          </button>
        </form>
      </div>
    </div>
  )
}

