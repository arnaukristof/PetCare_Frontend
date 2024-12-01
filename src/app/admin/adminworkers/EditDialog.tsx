import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Worker } from "./columns";
import { MultiSelect } from "@/components/custom/MultiSelect"; // MultiSelect import

type EditDialogProps = {
  worker: Worker | null;
  onClose: () => void;
  onSave: (updatedWorker: Worker) => void;
};

export function EditDialog({ worker, onClose, onSave }: EditDialogProps) {
  const [formData, setFormData] = useState<Worker | null>(worker);
  const [petTypes, setPetTypes] = useState<{ value: number; label: string }[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {

    if (worker) {
      setFormData(worker);
    } else {
      setFormData({
        id: 0,
        name: "",
        petTypes: [],
        daysOfWeek: []
      });
    }
  }, [worker]);

  useEffect(() => {
    const fetchPetTypes = async () => {
      const res = await fetch("http://localhost:5290/api/PetElements/GetPetTypes");
      const data = await res.json();
      setPetTypes(data.map((pt: { id: number; typeName: string }) => ({
        value: pt.id,
        label: pt.typeName,
      })));
    };
  
    const fetchDaysOfWeek = async () => {
      const res = await fetch("http://localhost:5290/api/Workers/GetDays");
      const data = await res.json();
      setDaysOfWeek(data.map((day: { id: number; dayName: string }) => ({
        value: day.id,
        label: day.dayName,
      })));
    };
    fetchPetTypes();
    fetchDaysOfWeek();
  },[]);
  
const handleChange = <K extends keyof Worker>(name: K, value: Worker[K]) => {
  if (formData) {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!worker) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Worker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Worker Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Types</label>
            <MultiSelect
              options={petTypes}
              value={(formData?.petTypes || []).map((pt) => Number(pt))}
              onChange={(selected) => handleChange("petTypes", selected)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days of Week</label>
            <MultiSelect
              options={daysOfWeek}
              value={(formData?.daysOfWeek || []).map((dw) => Number(dw))}
              onChange={(selected) => handleChange("daysOfWeek", selected)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
