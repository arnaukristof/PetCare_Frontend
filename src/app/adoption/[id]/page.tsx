'use client'

import React, { useState, useEffect } from 'react'

interface Pet {
  id: number
  name: string
  age: number
  petSizeId: number
  petTypeId: number
  petBreedId: number
  indoor: boolean
  medication: boolean
  description: string
}

interface PetType {
  id: number
  typeName: string
}

interface PetSize {
  id: number
  sizeName: string
}

interface PetBreed {
  id: number
  breedName: string
}

// API Hívások
const fetchPetById = async (id: number): Promise<Pet> =>
  fetch(`http://localhost:5290/api/Pets/GetPetById/${id}`).then((res) => res.json())

const fetchPetTypes = async (): Promise<PetType[]> =>
  fetch(`http://localhost:5290/api/PetElements/GetPetTypes`).then((res) => res.json())

const fetchPetSizes = async (): Promise<PetSize[]> =>
  fetch(`http://localhost:5290/api/PetElements/GetPetSizes`).then((res) => res.json())

const fetchPetBreeds = async (): Promise<PetBreed[]> =>
  fetch(`http://localhost:5290/api/PetElements/GetPetBreeds`).then((res) => res.json())

export default function PetDetails() {
  const [pet, setPet] = useState<Pet | null>(null)
  const [petTypes, setPetTypes] = useState<PetType[]>([])
  const [petSizes, setPetSizes] = useState<PetSize[]>([])
  const [petBreeds, setPetBreeds] = useState<PetBreed[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const id = window.location.pathname.split('/').pop() // ID az URL-ből
      if (!id) {
        console.error('No ID found in URL')
        return
      }

      const [fetchedPet, fetchedPetTypes, fetchedPetSizes, fetchedPetBreeds] = await Promise.all([
        fetchPetById(Number(id)),
        fetchPetTypes(),
        fetchPetSizes(),
        fetchPetBreeds(),
      ])

      setPet(fetchedPet)
      setPetTypes(fetchedPetTypes)
      setPetSizes(fetchedPetSizes)
      setPetBreeds(fetchedPetBreeds)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!pet) {
    return <p>No data available for this pet.</p>
  }

  const petType = petTypes.find((type) => type.id === pet.petTypeId)?.typeName || 'Unknown'
  const petSize = petSizes.find((size) => size.id === pet.petSizeId)?.sizeName || 'Unknown'
  const petBreed = petBreeds.find((breed) => breed.id === pet.petBreedId)?.breedName || 'Unknown'

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">{pet.name}</h1>
      <div className="space-y-2">
        <p><strong>Type:</strong> {petType}</p>
        <p><strong>Breed:</strong> {petBreed}</p>
        <p><strong>Size:</strong> {petSize}</p>
        <p><strong>Age:</strong> {pet.age} years old</p>
        <p><strong>Indoor:</strong> {pet.indoor ? 'Yes' : 'No'}</p>
        <p><strong>Medication:</strong> {pet.medication ? 'All received' : 'Not completed'}</p>
        <p><strong>Description:</strong> {pet.description}</p>
      </div>
    </main>
  )
}
