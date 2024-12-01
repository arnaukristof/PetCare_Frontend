'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface FormData {
  name: string;
  age: number | '';
  past: string;
  phoneNumber: string;
  email: string;
  workerId: number;
  petId: number;
  allergies: string;
  parentInfo: string;
}

interface Worker {
  id: number;
  name: string;
}

interface Pet {
  id: number;
  name: string;
}

export default function CampPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    past: '',
    phoneNumber: '',
    email: '',
    workerId: 0,
    petId: 0,
    allergies: '',
    parentInfo: '',
  });
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isPDFUploaded, setIsPDFUploaded] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('http://localhost:5290/api/Workers');
        if (response.ok) {
          const data: Worker[] = await response.json();
          setWorkers(data);
        } else {
          console.error('Failed to fetch workers.');
        }
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:5290/api/Pets/GetAllPets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          setPets(data);
        } else {
          console.error('Failed to fetch pets.');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchWorkers();
    fetchPets();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5290/api/Image/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsPDFUploaded(true);
        alert('PDF uploaded succesfully!');
      } else {
        alert('Error during uploading PDF.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error during uploading PDF.');
    }
  };

  const handleScheduleSubmit = async () => {
    if (workers.length === 0 || pets.length === 0) {
      alert('There are no available pets or workers in the database.');
      return;
    }

    const randomPet = pets[Math.floor(Math.random() * pets.length)];
    const randomWorker = workers[Math.floor(Math.random() * workers.length)];

    const payload = {
      scheduleTypeId: 4,
      name: formData.name,
      age: formData.age || 0,
      past: formData.past,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      date: "2025-07-11",
      workerId: randomWorker.id,
      petId: randomPet.id,
      allergies: formData.allergies,
      parentInfo: formData.parentInfo,
      numberOfWalker: 0,
      lengthOfWalk: 0,
      verified: false,
    };
    console.log(payload);
    try {
      const response = await fetch('http://localhost:5290/api/Schedule/AddSchedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Schedule made succesfully!');
        setFormData({
          name: '',
          age: '',
          past: '',
          phoneNumber: '',
          email: '',
          workerId: 0,
          petId: 0,
          allergies: '',
          parentInfo: '',
        });
        setIsDialogOpen(false);
      } else {
        alert('Error during data sending.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error on data sending.');
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/Parental Consent.pdf';
    link.download = 'Parental Consent.pdf';
    link.click();
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Summer Camp 2025</h1>
      <p className="text-lg mb-6">  Are you ready for a heartwarming adventure? 🌟 On July 11, 2025, we’re hosting a free animal camp where kids and animals connect like never before! </p>
      <p className="text-lg mb-6">This unique experience lets children learn the value of responsibility while making a positive impact on the lives of animals. Through interactive activities, kids will help care for animals, play with them, and discover the joys of building meaningful bonds.</p>
      <p className="text-lg mb-6">📍 When? July 11, 2025</p>
      <p className="text-lg mb-6">📍 Where? At the huge backyard of PetCare</p>
      <p className="text-lg mb-6">📍 Cost? Absolutely FREE!</p>
      <p className="text-lg mb-6">🐾 Sign up now and make this summer unforgettable.</p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleDownloadPDF}>
          Download parent approval form
        </Button>
        <Button  onClick={() => setIsDialogOpen(true)}>
          Join camp!
        </Button>
      </div>
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='w-auto'>
          <DialogHeader>
            <DialogTitle>Join camp!</DialogTitle>
          </DialogHeader>
          <form className='flex items-center justify-center'>
            <div className="grid gap-4">
              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Did you have a pet in the past?', name: 'past', type: 'text' },
                { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Do you have any allergies?', name: 'allergies', type: 'text' },
                { label: 'Parent Name', name: 'parentInfo', type: 'text' },
              ].map((field) => (
                <div key={field.name} className="w-full">
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                  />
                </div>
              ))}
            </div>
          </form>
          <DialogFooter>
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="block mb-4 "
              />
            
              <Button
                onClick={handleScheduleSubmit}
                disabled={!isPDFUploaded}
              >
                Schedule
              </Button>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
