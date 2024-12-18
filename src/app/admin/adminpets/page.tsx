"use client"

import { Pet, columns } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./EditDialog";
import Link from "next/link";
import ProtectedRoute from '@/components/custom/ProtectedRoute'

export default  function Pets() {

  const [newPetDialogOpen, setNewPetDialogOpen] = useState(false);
  const [petSizes, setPetSizes] = useState<{ id: number; sizeName: string  }[]>([]);
  const [petTypes, setPetTypes] = useState<{ id: number; typeName: string  }[]>([]);
  const [petBreeds, setPetBreeds] = useState<{ id: number; breedName: string  }[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const petRes = await fetch('http://localhost:5290/api/Pets/GetAllPetswithadditionaldata');
      const petData = await petRes.json();
      setPets(petData);
    };

    const fetchPetSizes = async () => {
      const res = await fetch("http://localhost:5290/api/PetElements/GetPetSizes");
      const data = await res.json();
      setPetSizes(data);
    };

    const fetchPetTypes = async () => {
      const res = await fetch("http://localhost:5290/api/PetElements/GetPetTypes");
      const data = await res.json();
      setPetTypes(data);
    };

    const fetchPetBreeds = async () => {
      const res = await fetch("http://localhost:5290/api/PetElements/GetPetBreeds");
      const data = await res.json();
      setPetBreeds(data);
    };

    fetchData();
    fetchPetSizes();
    fetchPetTypes();
    fetchPetBreeds();
  }, []);

  const handleNewPetSave = async (newPet: Pet) => {
    try {
      const res = await fetch("http://localhost:5290/api/Pets/AddPet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPet),
      });
      if (!res.ok) throw new Error("Failed to save the new Pet.");
      console.log("New pet added", newPet);

      setPets((prevPets) => [...prevPets, newPet]);
    } catch (error) {
      console.error("Error adding new pet:", error);
    }finally{
      setNewPetDialogOpen(false);
    }
  };

  return (
    <>
    <ProtectedRoute>
    <div className="container mx-auto py-10">
      <h1>All Pets</h1>
      <Button onClick={() => setNewPetDialogOpen(true)} className="mb-4">
        Add New Pet
      </Button>
      <Button className="m-4">
        <Link href="/admin/adminpets/petpictures" >Add Pet Pictures</Link>
      </Button>

      <DataTable columns={columns} data={pets} />

      {newPetDialogOpen && (
        <EditDialog
        pet={{
          id: 0, 
          name: "",
          age: 0,
          petSizeId: 0,
          petSize: { id: 0, sizeName: "" },
          petTypeId: 0,
          petType: { id: 0, typeName: "" },
          petBreedId: 0,
          petBreed: { id: 0, breedName: "" },
          medication: false,
            indoor: false,
            description: "",
            verified: false,
          }}
          petSizes={petSizes}
          petTypes={petTypes}
          petBreeds={petBreeds}
          onClose={() => setNewPetDialogOpen(false)}
          onSave={handleNewPetSave}
          />
        )}
    </div>
    </ProtectedRoute>
    </>
  )
}
