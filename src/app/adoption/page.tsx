import React from 'react'
import Image from 'next/image'
import kep from './kutya.jpeg'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

async function getPets(): Promise<Pet[]> {
  const result = await fetch('http://localhost:5290/api/Pets/GetAllPetsWithAdditionalData')

  return result.json()
}

export default async function Adoption() {
  const pets = await getPets()

  return (
    <main className='items-stretch m-10'>
      <div className='grid grid-cols-2 gap-8'>
        {pets.map(pet =>(
          <Card key={pet.id}>
            <CardHeader>
              <div>
                <CardTitle>{pet.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='flex-auto flex space-x-5'>
              <div>
                <Image 
                  src={kep}
                  width={300}
                  height={300} 
                  alt=''/>
              </div>
              <div className='flex-auto flex space-x-10'>
                <div>
                    <div>Pet type:</div>
                    <div>Pet breed:</div>
                    <div>Pet size:</div>
                    <div>Age:</div>
                    <div>Kept: :</div>
                    <div>Medication:</div>
                    <div>Description</div>
                  </div>
                  <div>
                    <div>{pet.petType.typeName}</div>
                    <div>{pet.petBreed.breedName}</div>
                    <div>{pet.petSize.sizeName}</div>
                    <div>{pet.age} years old</div>
                    <div>{pet.indoor ? "Indoor" : "Outdoor"}</div>
                    <div>{pet.medication ? "All medications received" : "Not received all medications" }</div>
                    <div>{pet.description}</div>
                  </div>
                </div>
              {/* <div>
                <div className='flex-auto flex space-x-10'>
                  <div>Pet type:</div>
                  <div>{pet.petType.typeName}</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Pet breed:</div>
                  <div>{pet.petBreed.breedName}</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Pet size:</div>
                  <div>{pet.petSize.sizeName}</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Age:</div>
                  <div>{pet.age} years old</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Kept: :</div>
                  <div>{pet.indoor ? "Indoor" : "Outdoor"}</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Medication:</div>
                  <div>{pet.medication ? "All medications received" : "Not received all medications" }</div>
                </div>
                <div className='flex-auto flex space-x-10'>
                  <div>Description</div>
                  <div>{pet.description}</div>
                </div>
              </div> */}
            </CardContent>
            <CardFooter>
              <button>View pet</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}