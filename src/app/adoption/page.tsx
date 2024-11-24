"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

interface Pet {
  id: number;
  name: string;
  age: number;

  petSizeId: number;
  petSize: { id: number, sizeName: string }

  petTypeId: number;
  petType: { id: number, typeName: string }

  petBreedId: number;
  petBreed: { id: number, breedName: string }

  medication: boolean;
  indoor: boolean;
  description: string;
  verified: boolean;
}

interface PetImage {
  id: number
  name: string
  imageUrl: string
}

async function getPets(): Promise<Pet[]> {
  const result = await fetch('http://localhost:5290/api/Pets/GetAllPetsWithAdditionalData')
  return result.json()
}

async function getFirstImageByPetId(petId: number): Promise<PetImage | null> {
  const res = await fetch(`http://localhost:5290/api/Image/GetImagesByPetId/${petId}`)
  if (!res.ok) return null
  const images: PetImage[] = await res.json()
  return images.length > 0 ? images[0] : null
}

export default function Adoption() {
  // const [pets, setPets] = useState<Pet[]>([])
  const [petsWithImages, setPetsWithImages] = useState<(Pet & { imageUrl: string | null })[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadPets = async () => {
      try {
        const fetchedPets = await getPets()
        const petsWithImages = await Promise.all(
          fetchedPets.map(async (pet) => {
            const image = await getFirstImageByPetId(pet.id)
            return { ...pet, imageUrl: image?.imageUrl || null }
          })
        )
        setPetsWithImages(petsWithImages)
      } catch (error) {
        console.error('Error fetching pets:', error)
      }
    }
    loadPets()
  }, [])

  const handleViewPet = (id: number) => {
    router.push(`/adoption/${id}`)
  }

  return (
    <main className="items-stretch m-10">
    <div className="grid grid-cols-2 gap-8">
      {petsWithImages.map((pet) => (
        <Card key={pet.id}>
          <CardHeader>
            <div>
              <CardTitle>{pet.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-auto flex space-x-5">
            <div>
              {pet.imageUrl ? (
                <Image
                  src={pet.imageUrl}
                  width={300}
                  height={300}
                  alt={`${pet.name} image`}
                />
              ) : (
                <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
                  <p>No Image</p>
                </div>
              )}
            </div>
            <div className="flex-auto flex space-x-10">
              <div>
                <div>Pet type:</div>
                <div>Pet breed:</div>
                <div>Pet size:</div>
                <div>Age:</div>
                <div>Kept:</div>
                <div>Medication:</div>
                <div>Description:</div>
              </div>
              <div>
                <div>{pet.petType.typeName}</div>
                <div>{pet.petBreed.breedName}</div>
                <div>{pet.petSize.sizeName}</div>
                <div>{pet.age} years old</div>
                <div>{pet.indoor ? 'Indoor' : 'Outdoor'}</div>
                <div>
                  {pet.medication
                    ? 'All medications received'
                    : 'Not received all medications'}
                </div>
                <div>{pet.description}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleViewPet(pet.id)}>View pet</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </main>
  )
}