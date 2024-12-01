"use client"

import { Schedule, columns, Pet, Worker } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./EditDialog";

export default function Schedules() {

  const [newScheduleDialogOpen, setNewScheduleDialogOpen] = useState(false);
  const [scheduleTypes, setScheduleTypes] = useState<{ id: number; scheduleTypeName: string  }[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const scheduleRes = await fetch('http://localhost:5290/api/Schedule/GetAllSchedulesWithAdditionalData');
      const scheduleData: Schedule[] = await scheduleRes.json();

      const uniquePets = Array.from(
        new Map(scheduleData.map((item) => [item.pet.id, item.pet])).values()
      );
  
      const uniqueWorkers = Array.from(
        new Map(scheduleData.map((item) => [item.worker.id, item.worker])).values()
      );
  
      setPets(uniquePets);
      setWorkers(uniqueWorkers);
      setSchedules(scheduleData);
    };
    const fetchScheduleTypes = async () => {
      const res = await fetch("http://localhost:5290/api/Schedule/GetScheduleTypes");
      const data = await res.json();
      console.log(data);
      setScheduleTypes(data);
    };

    fetchData();
    fetchScheduleTypes();
  }, []);

  const handleNewScheduleSave = async (newSchedule: Schedule) => {
    try {
      const res = await fetch("http://localhost:5290/api/Schedule/AddSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });
      if (!res.ok) throw new Error("Failed to save the new Schedule.");
      console.log("New schedule added", newSchedule);

      setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
    } catch (error) {
      console.error("Error adding new schedule:", error);
    }finally{
      setNewScheduleDialogOpen(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10">
        <h1>All Schedules</h1>

        <Button onClick={() => setNewScheduleDialogOpen(true)} className="mb-4">
          Add New Schedule
        </Button>

        <DataTable columns={columns} data={schedules} />

        {newScheduleDialogOpen && (
        <EditDialog
          schedule={{
          id: 0,
          scheduleTypeId: 0,
          scheduleType: { id: 0, scheduleTypeName: "" },
          name: "",
          age: 0,
          past: "",
          phoneNumber: "",
          email: "",
          date: null,
          workerId: 0,
          worker: { id: 0, name: "" },
          petId: 0,
          pet: { id: 0, name: "" },
          allergies: "",
          parentInfo: "",
          numberOfWalker: 0,
          lengthOfWalk: 0,
          verified: false,
        }}
          scheduleTypes={scheduleTypes}
          pets={pets}
          workers={workers}
          onClose={() => setNewScheduleDialogOpen(false)}
          onSave={handleNewScheduleSave}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
