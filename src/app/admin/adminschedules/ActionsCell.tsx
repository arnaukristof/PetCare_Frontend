import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditDialog } from "./EditDialog";
import { Schedule, Pet, Worker } from "./columns";

type ActionsCellProps = {
  schedule: Schedule;
};

export function ActionsCell({ schedule }: ActionsCellProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [scheduleTypes, setScheduleTypes] = useState<{ id: number; scheduleTypeName: string  }[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);


  useEffect(() => {
    const fetchScheduleTypes = async () => {
      try {
        const res = await fetch("http://localhost:5290/api/Schedule/GetScheduleTypes");
        const data = await res.json();
        setScheduleTypes(data);
      } catch (error) {
        console.error("Failed to fetch schedule types:", error);
      }
    };
    fetchScheduleTypes();
  }, []);

  const handleSave = async (updatedSchedule: Schedule) => {
    try {
      await fetch(`http://localhost:5290/api/Schedule/UpdateSchedule${updatedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSchedule),
      });
      console.log("Schedule updated:", updatedSchedule);
    } catch (error) {
      console.error("Error updating schedule:", error);
    } 
    finally {
      setEditDialogOpen(false);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) {
      return;
    }
  
    try {
      await fetch(`http://localhost:5290/api/Schedule/DeleteSchedule${scheduleId}`, {
        method: "DELETE",
      });
      console.log(`Schedule with ID ${scheduleId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting schedule:", error);
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
          <DropdownMenuItem onClick={() => handleDelete(schedule.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editDialogOpen && (
        <EditDialog
          schedule={schedule}
          scheduleTypes={scheduleTypes}
          pets={pets}
          workers={workers}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
