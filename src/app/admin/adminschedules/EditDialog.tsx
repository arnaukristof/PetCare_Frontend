"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Schedule, Pet, Worker } from "./columns";

type EditDialogProps = {
  schedule: Schedule | null;
  scheduleTypes: { id: number; scheduleTypeName: string }[];
  pets: Pet[];
  workers: Worker[];
  onClose: () => void;
  onSave: (updatedSchedule: Schedule) => void;
};

export function EditDialog({ schedule, scheduleTypes, pets, workers, onClose, onSave }: EditDialogProps) {
  const [formData, setFormData] = useState<Schedule | null>(schedule);

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    } else {
      setFormData({
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
      });
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: ["scheduleTypeId"].includes(name) ? parseInt(value) : value });
    }
  };

  const handleSwitchChange = (name: keyof Schedule) => (value: boolean) => {
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

  if (!schedule) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
        <div>
          <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700">
            Schedule Type
          </label>
          <select
            id="scheduleTypeId"
            name="scheduleTypeId"
            value={formData?.scheduleTypeId || ""}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="" disabled>
              Select a type
            </option>
            {scheduleTypes && scheduleTypes.length > 0 ? (
              scheduleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.scheduleTypeName}
                </option>
              ))
            ) : (
              <option disabled>No types available</option>
            )}
          </select>
        </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData?.age || ""}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>
          <div>
            <label htmlFor="past" className="block text-sm font-medium text-gray-700">
              Past
            </label>
            <Input
              id="past"
              name="past"
              value={formData?.past || ""}
              onChange={handleChange}
              placeholder="Past"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              PhoneNumber
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData?.phoneNumber || ""}
              onChange={handleChange}
              placeholder="PhoneNumber"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData?.date ? new Date(formData.date).toISOString().split("T")[0] : ""}
              onChange={(e) => {
                const { value } = e.target;
                if (formData) {
                  setFormData({ ...formData, date: value ? new Date(value) : null }); // ISO formátumú dátum beállítása
                }
              }}
              placeholder="Date"
            />
          </div>
          <div>
            <label htmlFor="petId" className="block text-sm font-medium text-gray-700">
              Pet
            </label>
            <select
              id="petId"
              name="petId"
              value={formData?.petId || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>
                Select a Pet
              </option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="workerId" className="block text-sm font-medium text-gray-700">
              Worker
            </label>
            <select
              id="workerId"
              name="workerId"
              value={formData?.workerId || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>
                Select a Worker
              </option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
              Allergies
            </label>
            <Input
              id="allergies"
              name="allergies"
              value={formData?.allergies || ""}
              onChange={handleChange}
              placeholder="Allergies"
            />
          </div>
          <div>
            <label htmlFor="parentInfo" className="block text-sm font-medium text-gray-700">
              ParentInfo
            </label>
            <Input
              id="parentInfo"
              name="parentInfo"
              value={formData?.parentInfo || ""}
              onChange={handleChange}
              placeholder="ParentInfo"
            />
          </div>
          <div>
            <label htmlFor="numberOfWalker" className="block text-sm font-medium text-gray-700">
              NumberOfWalker
            </label>
            <Input
              id="numberOfWalker"
              name="numberOfWalker"
              type="number"
              value={formData?.numberOfWalker || ""}
              onChange={handleChange}
              placeholder="NumberOfWalker"
            />
          </div>
          <div>
          <label htmlFor="lengthOfWalk" className="block text-sm font-medium text-gray-700">
            Length of Walk
          </label>
          <select
            id="lengthOfWalk"
            name="lengthOfWalk"
            value={formData?.lengthOfWalk || ""}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="" disabled>
              Select Length
            </option>
            <option value="0">0 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </div>
          <div>
            <label htmlFor="verified" className="flex items-center space-x-2">
              <span>Verified</span>
              <Switch
                checked={formData?.verified || false}
                onCheckedChange={handleSwitchChange("verified")}
              />
            </label>
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
