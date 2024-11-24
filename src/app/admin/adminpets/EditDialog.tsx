"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Pet } from "./columns";

type EditDialogProps = {
  pet: Pet | null;
  petSizes: { id: number; sizeName: string }[];
  petTypes: { id: number; typeName: string }[];
  petBreeds: { id: number; breedName: string }[];
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
};

export function EditDialog({ pet, petSizes, petTypes, petBreeds, onClose, onSave }: EditDialogProps) {
  const [formData, setFormData] = useState<Pet | null>(pet);

  useEffect(() => {
    if (pet) {
      setFormData(pet); // Frissítjük a formData-t, amikor a pet változik
    } else {
      setFormData({
        id: 0, // Új pethez ideiglenes ID
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
      });
    }
  }, [pet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: ["petSizeId", "petTypeId", "petBreedId"].includes(name) ? parseInt(value) : value });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!pet) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pet</DialogTitle>
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
              onChange={handleChange}
              placeholder="Pet Name"
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
              placeholder="Pet Age"
            />
          </div>
          <div>
            <label htmlFor="petSize" className="block text-sm font-medium text-gray-700">
              Pet Size
            </label>
            <select
              id="petSizeId"
              name="petSizeId"
              value={formData?.petSizeId || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>
                Select a size
              </option>
              {petSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.sizeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="petType" className="block text-sm font-medium text-gray-700">
              Pet Type
            </label>
            <select
              id="petTypeId"
              name="petTypeId"
              value={formData?.petTypeId || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>
                Select a type
              </option>
              {petTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700">
              Pet Breed
            </label>
            <select
              id="petBreedId"
              name="petBreedId"
              value={formData?.petBreedId || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>
                Select a breed
              </option>
              {petBreeds.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.breedName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={formData?.description || ""}
              onChange={handleChange}
              placeholder="Description"
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
