"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

interface PetSize {
  id: number;
  sizeName: string;
}

interface PetType {
  id: number;
  typeName: string;
}

interface PetBreed {
  id: number;
  breedName: string;
}

interface WorkerPetType {
  workerId: number;
  petTypeId: number;
}

export default function AddPet() {
  const [petSizes, setPetSizes] = useState<PetSize[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [petBreeds, setPetBreeds] = useState<PetBreed[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    petSizeId: 0,
    petTypeId: 0,
    petBreedId: 0,
    medication: false,
    indoor: false,
    description: "",
    verified: false,
  });

  const [scheduleData, setScheduleData] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [sizesRes, typesRes, breedsRes] = await Promise.all([
          fetch("http://localhost:5290/api/PetElements/GetPetSizes"),
          fetch("http://localhost:5290/api/PetElements/GetPetTypes"),
          fetch("http://localhost:5290/api/PetElements/GetPetBreeds"),
        ]);

        if (sizesRes.ok) setPetSizes(await sizesRes.json());
        if (typesRes.ok) setPetTypes(await typesRes.json());
        if (breedsRes.ok) setPetBreeds(await breedsRes.json());
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      if (formData.petTypeId === 0) return;

      try {
        const response = await fetch(`http://localhost:5290/api/AvailableDays?petTypeId=${formData.petTypeId}`);
        if (response.ok) {
          const days = await response.json();
          const daysMap: { [key: string]: number } = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };
          setAvailableDays(days.map((day: string) => daysMap[day]));
        } else {
          console.error("Failed to fetch available days");
        }
      } catch (error) {
        console.error("Error fetching available days:", error);
      }
    };

    fetchAvailableDays();
  }, [formData.petTypeId]);

  const isDayEnabled = (date: Date) => availableDays.includes(date.getDay());

  const getRandomWorkerId = async (petTypeId: number): Promise<number | null> => {
    try {
      const response = await fetch("http://localhost:5290/api/Worker_PetType/GetAllWorker_PetTypes");
      const workers: WorkerPetType[] = await response.json();
      const filteredWorkers = workers.filter((worker) => worker.petTypeId === petTypeId);
      return filteredWorkers.length > 0
        ? filteredWorkers[Math.floor(Math.random() * filteredWorkers.length)].workerId
        : null;
    } catch (error) {
      console.error("Error fetching worker IDs:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const petData = {
      ...formData,
      age: parseInt(formData.age, 10),
    };

    try {
      const petResponse = await fetch("http://localhost:5290/api/Pets/AddPet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });

      if (petResponse.ok) {
        const petResult = await petResponse.json();
        const petId = petResult.id;

        const workerId = await getRandomWorkerId(formData.petTypeId);
        if (!workerId) {
          alert("No worker available for this pet type.");
          return;
        }

        const schedulePayload = {
          scheduleTypeId: 1,
          name: scheduleData.name,
          age: parseInt(scheduleData.age, 10),
          past: "",
          phoneNumber: scheduleData.phoneNumber,
          email: scheduleData.email,
          date: selectedDate?.toISOString().split("T")[0] || "",
          workerId: workerId,
          petId: petId,
          allergies: "",
          parentInfo: "",
          numberOfWalker: 0,
          lengthOfWalk: 0,
          verified: false,
        };

        const scheduleResponse = await fetch("http://localhost:5290/api/Schedule/AddSchedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedulePayload),
        });

        if (scheduleResponse.ok) {
          alert("Pet and schedule added successfully!");
        } else {
          console.error("Failed to add schedule:", await scheduleResponse.text());
          alert("Failed to add schedule.");
        }
      } else {
        console.error("Failed to add pet:", await petResponse.text());
        alert("Failed to add pet.");
      }
    } catch (error) {
      console.error("Error adding pet and schedule:", error);
      alert("An error occurred while adding the pet and schedule.");
    }
  };

  return (
    <div className="px-40 mt-5 mx-20 space-y-6">
      <h1 className="text-2xl font-bold mb-5">Bring in a pet</h1>
      <p>Thank you for considering a thoughtful future for your beloved pet. We understand that this decision is never easy, but we’re here to help you find the perfect new home for them. Here, you can safely and securely give your furry friend a chance to meet a loving new family.</p>
      <p>Fill the form with your pet's and personal data, and book an appointment to meet us!</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Pet Information</h2>
          <Label htmlFor="petName">Pet Name:</Label>
          <Input
            id="petName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="petAge">Pet Age:</Label>
          <Input
            id="petAge"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div>
  <Label>Pet Size:</Label>
  <Select
    onValueChange={(value) =>
      setFormData({ ...formData, petSizeId: parseInt(value, 10) })
    }
    value={formData.petSizeId.toString()}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Size" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="0">Select Size</SelectItem>
      {petSizes.map((size) => (
        <SelectItem key={size.id} value={size.id.toString()}>
          {size.sizeName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

<div>
  <Label>Pet Type:</Label>
  <Select
    onValueChange={(value) =>
      setFormData({ ...formData, petTypeId: parseInt(value, 10) })
    }
    value={formData.petTypeId.toString()}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="0">Select Type</SelectItem>
      {petTypes.map((type) => (
        <SelectItem key={type.id} value={type.id.toString()}>
          {type.typeName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

<div>
  <Label>Pet Breed:</Label>
  <Select
    onValueChange={(value) =>
      setFormData({ ...formData, petBreedId: parseInt(value, 10) })
    }
    value={formData.petBreedId.toString()}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Breed" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="0">Select Breed</SelectItem>
      {petBreeds.map((breed) => (
        <SelectItem key={breed.id} value={breed.id.toString()}>
          {breed.breedName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="flex items-center space-x-4">
          <Label>Medication:</Label>
          <Switch
            checked={formData.medication}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, medication: checked })
            }
          />
        </div>

        <div className="flex items-center space-x-4">
          <Label>Indoor:</Label>
          <Switch
            checked={formData.indoor}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, indoor: checked })
            }
          />
        </div>

        <div>
          <Label htmlFor="description">Description:</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Owner Information</h2>
          <Label htmlFor="ownerName">Owner Name:</Label>
          <Input
            id="ownerName"
            value={scheduleData.name}
            onChange={(e) => setScheduleData({ ...scheduleData, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="ownerAge">Owner Age:</Label>
          <Input
            id="ownerAge"
            type="number"
            value={scheduleData.age}
            onChange={(e) => setScheduleData({ ...scheduleData, age: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number:</Label>
          <Input
            id="phoneNumber"
            value={scheduleData.phoneNumber}
            onChange={(e) => setScheduleData({ ...scheduleData, phoneNumber: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            value={scheduleData.email}
            onChange={(e) => setScheduleData({ ...scheduleData, email: e.target.value })}
          />
        </div>

        <div>
          <Label>Select a date:</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            disabled={(date) => !isDayEnabled(date)}
          />
        </div>

        <Button type="submit">Add Pet and Schedule</Button>
      </form>
    </div>
  );
}
