"use client"

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const ScheduleForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [workers, setWorkers] = useState<number[]>([]);
  const [pets, setPets] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    past: "",
    phoneNumber: "",
    email: "",
    numberOfPeople: "",
    length: "30 minutes",
  });

  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        const response = await fetch(`http://localhost:5290/api/AvailableDays?petTypeId=1`);
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
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(`http://localhost:5290/api/Worker_PetType/GetAllWorker_PetTypes`);
        if (response.ok) {
          const data = await response.json();
          const filteredWorkers = data
            .filter((item: { petTypeId: number }) => item.petTypeId === 1)
            .map((item: { workerId: number }) => item.workerId);
          setWorkers(filteredWorkers);
        } else {
          console.error("Failed to fetch workers");
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

   useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5290/api/Pets/GetAllPets`);
        if (response.ok) {
          const data = await response.json();
          const filteredPets = data
            .filter((item: { petTypeId: number }) => item.petTypeId === 1)
            .map((item: { id: number }) => item.id);
          setPets(filteredPets);
        } else {
          console.error("Failed to fetch pets");
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const isDayEnabled = (date: Date) => {
    const dayNumber = date.getDay();
    return availableDays.includes(dayNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    if (workers.length === 0) {
      alert("No workers available for this pet type.");
      return;
    }

    if (pets.length === 0) {
      alert("No pets available for this pet type.");
      return;
    }

    const randomWorkerId = workers[Math.floor(Math.random() * workers.length)];
    const randomPetId = pets[Math.floor(Math.random() * pets.length)];

    const payload = {
      scheduleTypeId: 3,
      name: formData.name,
      age: parseInt(formData.age, 10),
      past: formData.past,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      date: selectedDate.toISOString().split("T")[0],
      workerId: randomWorkerId,
      petId: randomPetId,
      allergies: "",
      parentInfo: "",
      numberOfWalker: parseInt(formData.numberOfPeople, 10),
      lengthOfWalk: formData.length === "30 minutes" ? 30 : formData.length === "60 minutes" ? 60 : 90,
      verified: false,
    };

    try {
      const response = await fetch("http://localhost:5290/api/Schedule/AddSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Schedule successfully created!");
        setFormData({
          name: "",
          age: "",
          past: "",
          phoneNumber: "",
          email: "",
          numberOfPeople: "",
          length: "30 minutes",
        });
        setSelectedDate(undefined);
      } else {
        alert("Failed to create schedule.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the schedule.");
    }
  };

  return (
    <div className="px-40 mt-5 mx-20 space-y-6">
      <h1 className="text-xl font-bold">Schedule Walking</h1>
      <p>Welcome on the walking page where you can book an appointment to walk with a randomly selected dog. By going on a walk you can have a little exercise, while making a pets life happier!</p>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => setSelectedDate(date)}
        disabled={(date) => !isDayEnabled(date)}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Did you have a pet in the past?</label>
          <input
            type="text"
            name="past"
            value={formData.past}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Number of people</label>
          <input
            type="number"
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Length</label>
          <select
            name="length"
            value={formData.length}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="30 minutes">30 minutes</option>
            <option value="60 minutes">60 minutes</option>
            <option value="90 minutes">90 minutes</option>
          </select>
        </div>
        <Button type="submit" >
          Schedule Walking
        </Button>
      </form>
    </div>
  );
};

export default ScheduleForm;
