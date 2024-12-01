"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Drawer, DrawerContent, DrawerClose, DrawerTitle } from "@/components/ui/drawer";
import Questionnaire from "@/components/custom/Questionnaire"
import { Switch } from "@/components/ui/switch";

interface Pet {
  id: number
  name: string
  age: number

  petSizeId: number
  petSize: { id: number; sizeName: string }

  petTypeId: number
  petType: { id: number; typeName: string }

  petBreedId: number
  petBreed: { id: number; breedName: string }

  medication: boolean
  indoor: boolean
  description: string
  verified: boolean
}

interface PetImage {
  id: number
  name: string
  imageUrl: string
}

interface WorkerPetType {
  workerId: number
  petTypeId: number
}

async function getPets(): Promise<Pet[]> {
  const result = await fetch("http://localhost:5290/api/Pets/GetAllPetsWithAdditionalData")
  return result.json()
}

async function getFirstImageByPetId(petId: number): Promise<PetImage | null> {
  const res = await fetch(`http://localhost:5290/api/Image/GetImagesByPetId/${petId}`)
  if (!res.ok) return null
  const images: PetImage[] = await res.json()
  return images.length > 0 ? images[0] : null
}

async function getPetTypes(): Promise<{ id: number; typeName: string }[]> {
  const result = await fetch("http://localhost:5290/api/PetElements/GetPetTypes");
  return result.json();
}

async function getPetSizes(): Promise<{ id: number; sizeName: string }[]> {
  const result = await fetch("http://localhost:5290/api/PetElements/GetPetSizes");
  return result.json();
}

async function getPetBreeds(): Promise<{ id: number; breedName: string }[]> {
  const result = await fetch("http://localhost:5290/api/PetElements/GetPetBreeds");
  return result.json();
}

export default function Adoption() {
  const [petsWithImages, setPetsWithImages] = useState<(Pet & { imageUrl: string | null })[]>([])
  const [selectedPet, setSelectedPet] = useState<(Pet & { imageUrl: string | null }) | null>(null)
  const [showAdoptForm, setShowAdoptForm] = useState(false)
  const [adopterName, setAdopterName] = useState("")
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    past: "",
    phoneNumber: "",
    email: ""
  })
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    indoor: false,
    medication: false,
    petTypeId: null as number | null,
    petSizeId: null as number | null,
    petBreedId: null as number | null,
  });
  const [findMyOpen, setFindMyOpen] = useState<boolean>(false);
  const [petTypes, setPetTypes] = useState<{ id: number; typeName: string }[]>([]);
  const [petSizes, setPetSizes] = useState<{ id: number; sizeName: string }[]>([]);
  const [petBreeds, setPetBreeds] = useState<{ id: number; breedName: string }[]>([]);


  const applyFilters = () => {
    const filteredPets = petsWithImages.filter((pet) => {
      const matchesIndoor = filters.indoor ? pet.indoor === true : true;
      const matchesMedication = filters.medication ? pet.medication === true : true;
      const matchesPetType = filters.petTypeId ? pet.petTypeId === filters.petTypeId : true;
      const matchesPetSize = filters.petSizeId ? pet.petSizeId === filters.petSizeId : true;
      const matchesPetBreed = filters.petBreedId ? pet.petBreedId === filters.petBreedId : true;
  
      return matchesIndoor && matchesMedication && matchesPetType && matchesPetSize && matchesPetBreed;
    });
    setPetsWithImages(filteredPets);
  };

  const unselectFilters = async () => {
    setFilters(filters);
    try {
      const fetchedPets = await getPets();
      const petsWithImages = await Promise.all(
        fetchedPets.map(async (pet) => {
          const image = await getFirstImageByPetId(pet.id);
          return { ...pet, imageUrl: image?.imageUrl || null };
        })
      );
      setPetsWithImages(petsWithImages);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const getRandomWorkerId = async (petTypeId: number): Promise<number | null> => {
    try {
      const response = await fetch("http://localhost:5290/api/Worker_PetType/GetAllWorker_PetTypes")
      const workers: WorkerPetType[] = await response.json()
      const matchingWorkers = workers.filter((worker) => worker.petTypeId === petTypeId)
      return matchingWorkers.length > 0
        ? matchingWorkers[Math.floor(Math.random() * matchingWorkers.length)].workerId
        : null
    } catch (error) {
      console.error("Error fetching workers:", error)
      return null
    }
  }

  useEffect(() => {
    console.log("Current petsWithImages:", petsWithImages);
    console.log("Applying filters:", filters);
    applyFilters();
  }, [filters]);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const fetchedPetTypes = await getPetTypes();
        setPetTypes(fetchedPetTypes);
      } catch (error) {
        console.error("Error fetching pet types:", error);
      }
    };
    const fetchPetSizes = async () => {
      try {
        const fetchedPetSizes = await getPetSizes();
        setPetSizes(fetchedPetSizes);
      } catch (error) {
        console.error("Error fetching pet sizes:", error);
      }
    };
    const fetchPetBreeds = async () => {
      try {
        const fetchedPetBreeds = await getPetBreeds();
        setPetBreeds(fetchedPetBreeds);
      } catch (error) {
        console.error("Error fetching pet breeds:", error);
      }
    };
  
    fetchPetTypes();
    fetchPetSizes();
    fetchPetBreeds();
  }, []);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      if (!selectedPet) return;
      try {
        const response = await fetch(`http://localhost:5290/api/AvailableDays?petTypeId=${selectedPet.petTypeId}`);
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
  }, [selectedPet]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const fetchedPets = await getPets()

        const verifiedPets = fetchedPets.filter((pet) => pet.verified)

        const petsWithImages = await Promise.all(
          verifiedPets.map(async (pet) => {
            const image = await getFirstImageByPetId(pet.id)
            return { ...pet, imageUrl: image?.imageUrl || null }
          })
        )
        setPetsWithImages(petsWithImages)
      } catch (error) {
        console.error("Error fetching pets:", error)
      }
    }
    loadPets()
  }, [])

  const isDayEnabled = (date: Date) => {
    const dayNumber = date.getDay();
    return availableDays.includes(dayNumber);
  };

  const handleViewPet = (pet: Pet & { imageUrl: string | null }) => {
    setSelectedPet(pet)
  }

  const handleAdopt = () => {
    setShowAdoptForm(true)
  }

  const handleClose = () => {
    setSelectedPet(null)
    setShowAdoptForm(false)
    setAdopterName("")
  }

  const handleScheduleSubmit = async () => {
  if (!selectedPet || !selectedPet.petTypeId || !selectedDate) {
    alert("Please select a pet and date, and fill in all required fields.")
    return
  }

  const workerId = await getRandomWorkerId(selectedPet.petTypeId)
  if (!workerId) {
    alert("No available worker found for this pet type.")
    return
  }

  const scheduleData = {
    scheduleTypeId: 2,
    name: formData.name,
    age: parseInt(formData.age, 10) || 0,
    past: formData.past,
    phoneNumber: formData.phoneNumber,
    email: formData.email,
    date: selectedDate.toISOString().split("T")[0],
    workerId: workerId,
    petId: selectedPet.id,
    allergies: "",
    parentInfo: "",
    numberOfWalker: 0,
    lengthOfWalk: 0,
    verified: false
  }

  try {
    const response = await fetch("http://localhost:5290/api/Schedule/AddSchedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scheduleData)
    })

    if (response.ok) {
      alert("Schedule added successfully!")
      setFormData({
        name: "",
        age: "",
        past: "",
        phoneNumber: "",
        email: "",
      });
      setSelectedDate(undefined);
      handleClose()
    } else {
      console.error("Failed to add schedule:", await response.text())
      alert("Failed to add schedule.")
    }
  } catch (error) {
    console.error("Error adding schedule:", error)
    alert("An error occurred while adding the schedule.")
  }
}

return (
  <main className="items-stretch mt-10 mx-28 mb-10">
    <Button onClick={() => setFilterOpen(true)} className="mb-4">
      Filter
    </Button>
    <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
    <DrawerContent className="p-10 mx-10">
      <DrawerClose onClick={() => setFilterOpen(false)} />
      <DrawerTitle className="mt-5 mx-20">Filter Options</DrawerTitle>
      <div className="space-y-4 mt-4 mx-20">
        <div>
          <label>
            Pet Type:
            <select
              className="mt-1 block w-full p-2 border"
              onChange={(e) => setFilters({ ...filters, petTypeId: Number(e.target.value) })}
              value={filters.petTypeId || ""}
            >
             <option value="">All</option>
              {petTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Pet Size:
            <select
              className="mt-1 block w-full p-2 border"
              onChange={(e) => setFilters({ ...filters, petSizeId: Number(e.target.value) })}
              value={filters.petSizeId || ""}
            >
             <option value="">All</option>
              {petSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.sizeName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Pet Breed:
            <select
              className="mt-1 block w-full p-2 border"
              onChange={(e) => setFilters({ ...filters, petBreedId: Number(e.target.value) })}
              value={filters.petBreedId || ""}
            >
             <option value="">All</option>
              {petBreeds.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.breedName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <Switch
              checked={filters.indoor}
              onCheckedChange={(value) => setFilters({ ...filters, indoor: value })}
            />
            <span>Indoor</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <Switch
              checked={filters.medication}
              onCheckedChange={(value) => setFilters({ ...filters, medication: value })}
            />
            <span>Medications received</span>
          </label>
        </div>
        <div className="mt-5 ">
          <Button
            className="w-auto mx-5"
            onClick={() => {
              setFilterOpen(false);
              applyFilters();
            }}
          >
            Apply Filters
          </Button>
          <Button
            className="w-auto mx-5"
            onClick={() => {
              setFilterOpen(false);
              unselectFilters();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>

  <Button className="ml-2" onClick={() => setFindMyOpen(true)}>
    Find my pet!
  </Button>
  <Drawer open={findMyOpen} onOpenChange={setFindMyOpen}>
    <DrawerContent className="p-10 items-center w-full">
      <DrawerTitle className="mt-5">Find my pet!</DrawerTitle>
      <Questionnaire onClose={() => setFindMyOpen(false)}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />
    </DrawerContent>
  </Drawer>

  <div className="grid grid-cols-2 gap-8">
    {petsWithImages.map((pet) => (
      <Card key={pet.id} className="bg-blue-300/50">
        <CardHeader>
          <CardTitle>{pet.name}</CardTitle>
        </CardHeader>
        <div className="content-around">
        <CardContent className=" items-stretch flex">
          <div className="flex-1">
            {pet.imageUrl ? (
              <Image
                className="rounded-md"
                src={pet.imageUrl}
                width={300}
                height={300}
                alt={`${pet.name} image`}
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
                <p>No Image</p>
              </div>
            )}
          </div>
          <div className="bg-white p-5 rounded-md flex-1">
            <div className="flex-auto flex space-x-10 content-around">
              <div className="font-bold">
                <div>Pet type:</div>
                <div>Pet breed:</div>
                <div>Pet size:</div>
                <div>Age:</div>
                <div>Kept:</div>
                <div>Medication:</div>
                <div>Description:</div>
              </div>
              <div>
                <div>{pet.petType.typeName}</div>
                <div>{pet.petBreed.breedName}</div>
                <div>{pet.petSize.sizeName}</div>
                <div>{pet.age} years old</div>
                <div>{pet.indoor ? "Indoor" : "Outdoor"}</div>
                <div>
                  {pet.medication
                    ? "All medications received"
                    : "Not received all medications"}
                </div>
                  <div>{pet.description}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="static">
            <Button  onClick={() => handleViewPet(pet)}>View pet</Button>
          </CardFooter>
          </div>
        </Card>
      ))}
    </div>

    {selectedPet && (
      <Dialog open={!!selectedPet} onOpenChange={handleClose}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>{selectedPet.name}</DialogTitle>
            <DialogClose onClick={handleClose} />
          </DialogHeader>
          <div className="mx-10">
            {selectedPet.imageUrl ? (
              <Image
                className="rounded-md mb-5"
                src={selectedPet.imageUrl}
                width={400}
                height={400}
                alt={`${selectedPet.name} image`}
              />
            ) : (
              <div className="w-[400px] h-[400px] bg-gray-200 flex items-center justify-center">
                <p>No Image</p>
              </div>
            )}
            <p>Type: {selectedPet.petType.typeName}</p>
            <p>Breed: {selectedPet.petBreed.breedName}</p>
            <p>Size: {selectedPet.petSize.sizeName}</p>
            <p>Age: {selectedPet.age} years</p>
            <p>Kept: {selectedPet.indoor ? "Indoor" : "Outdoor"}</p>
            <p>Medication: {selectedPet.medication ? "Yes" : "No"}</p>
            <p>Description: {selectedPet.description}</p>
            <Button className="mt-4" onClick={handleAdopt}>
              Adopt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )}

    {showAdoptForm && (
      <Dialog open={showAdoptForm} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adopt {selectedPet?.name}</DialogTitle>
          <DialogClose onClick={handleClose} />
        </DialogHeader>
        <div>
          <form>
            <label htmlFor="name">Name:</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
    
            <label htmlFor="age">Age:</label>
            <Input
              id="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
    
            <label htmlFor="past">Did you have a pet in the past?:</label>
            <Input
              id="past"
              value={formData.past}
              onChange={(e) => setFormData({ ...formData, past: e.target.value })}
            />
    
            <label htmlFor="phoneNumber">Phone number:</label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
    
            <label htmlFor="email">Email:</label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="ml-20">
            <label>Select a date:</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              disabled={(date) => !isDayEnabled(date)}
            />
            </div>
            <Button type="button" onClick={handleScheduleSubmit}>
              Schedule
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    )}
  </main>
)
}
