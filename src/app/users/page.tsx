//import { lightningCssTransform } from 'next/dist/build/swc/generated-native';
import React from 'react'

interface Pet {
  id: number;
  name: string;
  age: number;
  petSizeId: number;
  petTypeId: number;
  petBreedId: number;
  medication: boolean;
  indoor: boolean;
  description: string;
  workerId: number;
  verified: boolean;
}

const UsersPage = async () => {
  const res = await fetch(
    'https://localhost:7245/api/pets/getallpets', 
    { next: { revalidate: 10 } });
  const pets: Pet[] = await res.json();

  return (
    <>
      <h1>Pets</h1>
      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {pets.map(pet => <li key={pet.id}> {pet.name} </li>)}
      </ul>
    </>
  )
}

export default UsersPage