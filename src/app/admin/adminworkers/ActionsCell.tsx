import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditDialog } from "./EditDialog"; // Importáld az EditDialog-ot
import { Worker } from "./columns";

type ActionsCellProps = {
  worker: Worker;
};

export function ActionsCell({ worker }: ActionsCellProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [petTypes, setPetTypes] = useState<{ id: number; typeName: string  }[]>([]);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/PetElements/GetPetTypes");
        const data = await res.json();
        setPetTypes(data);
      } catch (error) {
        console.error("Failed to fetch pet types:", error);
      }
    };

    fetchPetTypes();
  }, []);

  const handleSave = async (updatedWorker: Worker) => {
    try {
      await fetch(`http://localhost:5290/api/Workers/EditWorker5${updatedWorker.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWorker),
      });
      console.log("Worker updated:", updatedWorker);
    } catch (error) {
      console.error("Error updating worker:", error);
    } 
    finally {
      setEditDialogOpen(false);
    }
  };

  const handleDelete = async (workerId: number) => {
    if (!confirm("Are you sure you want to delete this worker?")) {
      return;
    }
  
    try {
      await fetch(`http://localhost:5290/api/Workers/${workerId}`, {
        method: "DELETE",
      });
      console.log(`Worker with ID ${workerId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting worker:", error);
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
          <DropdownMenuItem onClick={() => handleDelete(worker.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editDialogOpen && (
        <EditDialog
          worker={worker}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
