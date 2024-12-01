"use client"

import { Worker, columns } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./EditDialog";

export default function Workers() {

  const [newWorkerDialogOpen, setNewWorkerDialogOpen] = useState(false); 
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const workerRes = await fetch('http://localhost:5290/api/Workers/GetWorkersWithAdditionalData');
      const workerData = await workerRes.json();
      setWorkers(workerData);
    }
    fetchData();
  }, []);

  const handleNewWorkerSave = async (newWorker: Worker) => {
    try {
      const payload = {
        name: newWorker.name,
        petTypes: newWorker.petTypes,
        daysOfWeek: newWorker.daysOfWeek,
      };
      console.log("Payload sent to API:", JSON.stringify(payload));
      const res = await fetch("http://localhost:5290/api/Workers/CreateWorker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const error = await res.json();
        console.error("API error:", error);
        throw new Error("Failed to save the new Worker.");
      }
  
      const savedWorker = await res.json();
      console.log("New worker added", savedWorker);
  
      setWorkers((prevWorkers) => [...prevWorkers, savedWorker]);
    } catch (error) {
      console.error("Error adding new worker:", error);
    } finally {
      setNewWorkerDialogOpen(false);
    }
  };


  return (
    <>
      <ProtectedRoute>
        <div className="container mx-auto py-10">
          <h1>All Workers</h1>

          <Button onClick={() => setNewWorkerDialogOpen(true)} className="mb-4">
            Add New Worker
          </Button>

          <DataTable columns={columns} data={workers} />

          {newWorkerDialogOpen && (
            <EditDialog
            worker={{
              id: 0,
              name: "",
              petTypes: [],
              daysOfWeek: []
            }}
            onClose={() => setNewWorkerDialogOpen(false)}
            onSave={handleNewWorkerSave}
            />
          )}
        </div>
      </ProtectedRoute>
    </>
  )
}