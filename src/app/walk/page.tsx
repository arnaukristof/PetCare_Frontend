"use client"

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar"; // Feltételezve, hogy van ilyen útvonal
// import { addDays, setDay, startOfWeek } from "date-fns";

const AvailableDaysCalendar = ({ petTypeId }: { petTypeId: number }) => {
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  // API hívás az elérhető napok lekérdezésére
  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        const response = await fetch(
          `http://localhost:5290/api/AvailableDays?petTypeId=3`
        );
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
  }, [petTypeId]);

  // Ellenőrzés, hogy az adott nap engedélyezett-e
  const isDayEnabled = (date: Date) => {
    const dayNumber = date.getDay();
    return availableDays.includes(dayNumber);
  };

  return (
    <Calendar
      mode="single"
      // Csak az elérhető napok aktívak
      disabled={(date) => !isDayEnabled(date)}
    />
  );
};

export default AvailableDaysCalendar;
