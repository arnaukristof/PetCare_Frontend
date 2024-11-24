"use client"

import { Pet, columns } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./EditDialog";

// async function getData(): Promise<Pet[]> {
//   // Fetch data from your API here.
//   const res = await fetch(
//     'http://localhost:5290/api/Pets/GetAllPetswithadditionaldata', 
//     { next: { revalidate: 10 } });
//   const data = await res.json();
//   return data;
// }

export default  function Pets() {

  const [newPetDialogOpen, setNewPetDialogOpen] = useState(false);  // Új állapot hozzáadása az új pet dialógushoz
  const [petSizes, setPetSizes] = useState<{ id: number; sizeName: string  }[]>([]);
  const [petTypes, setPetTypes] = useState<{ id: number; typeName: string  }[]>([]);
  const [petBreeds, setPetBreeds] = useState<{ id: number; breedName: string  }[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const petRes = await fetch('http://localhost:5290/api/Pets/GetAllPetswithadditionaldata');
      const petData = await petRes.json();
      setPets(petData);  // A peteket ide állítjuk be
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

  const handleSave = async (newPet: Pet) => {
    try {
      await fetch("http://localhost:5290/api/Pets/AddPet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPet),
      });
      console.log("New pet added:", newPet);
    } catch (error) {
      console.error("Error adding new pet:", error);
    } finally {
      setNewPetDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1>All Pets</h1>

      {/* Gomb hozzáadása az új pet felvételéhez */}
      <Button onClick={() => setNewPetDialogOpen(true)} className="mb-4">
        Add New Pet
      </Button>

      <DataTable columns={columns} data={pets} />

      {/* Az új pet felvételéhez szükséges dialógus */}
      {newPetDialogOpen && (
        <EditDialog
          pet={null} // Új pet esetén nincs előre kitöltött adat
          petSizes={petSizes}
          petTypes={petTypes}
          petBreeds={petBreeds}
          onClose={() => setNewPetDialogOpen(false)}
          onSave={handleSave}  // Az új pet mentéséhez használt callback
        />
      )}
    </div>
  )
}
