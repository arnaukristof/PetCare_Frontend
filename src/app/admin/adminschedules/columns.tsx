"use client"

import { ColumnDef } from "@tanstack/react-table"
import {  ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActionsCell } from "./ActionsCell"

export type Pet = {
  id: number;
  name: string;
};

export type Worker = {
  id: number;
  name: string;
};

export type Schedule = {
  id: number;
  scheduleTypeId: number;
  scheduleType: { id: number, scheduleTypeName: string }
  name: string;
  age: number;
  past: string
  phoneNumber: string;
  email: string;
  date: Date | null;
  workerId: number;
  worker: { id: number, name: string }
  petId: number;
  pet: { id: number, name: string }
  allergies: string;
  parentInfo: string;
  numberOfWalker: number;
  lengthOfWalk: number;
  verified: boolean;
}

export const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "scheduleType.scheduleTypeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Schedule Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({row}) => {
      return row.getValue('age') + " years"
    }
  },
  {
    accessorKey: "past",
    header: "Past",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "worker.name",
    header: "Worker",
  },
  {
    accessorKey: "pet.name",
    header: "Pet",
  },
  {
    accessorKey: "allergies",
    header: "Allergies",
  },
  {
    accessorKey: "parentInfo",
    header: "Parent Information",
  },
  {
    accessorKey: "numberOfWalker",
    header: "Number of walker",
  },
  {
    accessorKey: "lengthOfWalk",
    header: "Length of walk",
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({row}) => {
      if (row.getValue('verified') == true) {return <div>Verified</div>} else{
        return <div>Not verified</div>
      }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell schedule={row.original} />
  }
]
