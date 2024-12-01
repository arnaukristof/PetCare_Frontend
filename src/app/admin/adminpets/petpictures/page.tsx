'use client'

import ProtectedRoute from "@/components/custom/ProtectedRoute"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react"

type Pet = {
  id: number
  name: string
}

export default function UploadImagePage() {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [petId, setPetId] = useState<string | undefined>(undefined)
  const [pets, setPets] = useState<Pet[]>([])
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/Pets/GetAllPets")
        if (!res.ok) throw new Error("Failed to fetch pets.")
        const data: Pet[] = await res.json()
        setPets(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPets()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file || !petId) {
      setUploadStatus("Pet must be selected and a file is required.")
      return
    }

    try {
      const data = new FormData()
      data.append("file", file)

      const res = await fetch(`http://localhost:5290/api/Image/UploadImageWithPetId?petId=${petId}`, {
        method: 'POST',
        body: data,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Failed to upload image.")
      }

      setUploadStatus("Image uploaded successfully!")
      setFile(undefined)
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus(error instanceof Error ? error.message : "An unknown error occurred.")
    }
  }

  return (
    <ProtectedRoute>
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Image for Pet</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="petId" className="block text-sm font-medium text-gray-700">Select Pet:</label>
          <select
            id="petId"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Select a pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Image:</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? undefined)}
          />
        </div>

        <Button
          type="submit"
        >
          Upload
        </Button>
      </form>

      {uploadStatus && (
        <p className={`mt-4 text-sm ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {uploadStatus}
        </p>
      )}
    </main>
    </ProtectedRoute>
  )
}
