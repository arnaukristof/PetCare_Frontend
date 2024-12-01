import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditDialog } from "./EditDialog";
import { Pet } from "./columns";

type ActionsCellProps = {
  pet: Pet;
};

export function ActionsCell({ pet }: ActionsCellProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [petSizes, setPetSizes] = useState<{ id: number; sizeName: string  }[]>([]);
  const [petTypes, setPetTypes] = useState<{ id: number; typeName: string  }[]>([]);
  const [petBreeds, setPetBreeds] = useState<{ id: number; breedName: string  }[]>([]);

  useEffect(() => {

    const fetchPetSizes = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/PetElements/GetPetSizes");
        const data = await res.json();
        setPetSizes(data);
      } catch (error) {
        console.error("Failed to fetch pet sizes:", error);
      }
    };

    const fetchPetTypes = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/PetElements/GetPetTypes");
        const data = await res.json();
        setPetTypes(data);
      } catch (error) {
        console.error("Failed to fetch pet types:", error);
      }
    };

    const fetchPetBreeds = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/PetElements/GetPetBreeds");
        const data = await res.json();
        setPetBreeds(data);
      } catch (error) {
        console.error("Failed to fetch pet breeds:", error);
      }
    };

    fetchPetSizes();
    fetchPetTypes();
    fetchPetBreeds();
  }, []);

  const handleSave = async (updatedPet: Pet) => {
    try {
      await fetch(`http://localhost:5290/api/Pets/UpdatePet${updatedPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPet),
      });
      console.log("Pet updated:", updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
    } 
    finally {
      setEditDialogOpen(false);
    }
  };

  const handleDelete = async (petId: number) => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }
  
    try {
      await fetch(`http://localhost:5290/api/Pets/DeletePet${petId}`, {
        method: "DELETE",
      });
      console.log(`Pet with ID ${petId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(pet.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editDialogOpen && (
        <EditDialog
          pet={pet}
          petSizes={petSizes}
          petTypes={petTypes}
          petBreeds={petBreeds}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
