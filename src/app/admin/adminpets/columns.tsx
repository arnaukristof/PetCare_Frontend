"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Pet = {
  id: number;
  name: string;
  age: number;

  petSizeId: number;
  petSize: { id: number, sizeName: string }

  petTypeId: number;
  petType: { id: number, typeName: string }

  petBreedId: number;
  petBreed: { id: number, breedName: string }

  medication: boolean;
  indoor: boolean;
  description: string;
  verified: boolean;
}

export const columns: ColumnDef<Pet>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({row}) => {
      return row.getValue('age') + " years"
    }
  },
  {
    accessorKey: "petSize.sizeName",
    header: "Pet Size",
  },
  {
    accessorKey: "petType.typeName",
    header: "Pet Type",
  },
  {
    accessorKey: "petBreed.breedName",
    header: "Pet Breed",
  },
  {
    accessorKey: "medication",
    header: "Medication",
    cell: ({row}) => {
      if (row.getValue('medication') == true) {return <div>All medication received</div>} else{
        return <div>Not medicated</div>
      }
    }
  },
  {
    accessorKey: "indoor",
    header: "Indoor",
    cell: ({row}) => {
      if (row.getValue('indoor') == true) {return <div>Indoor</div>} else{
        return <div>Outdoor</div>
      }
    }
  },
  {
    accessorKey: "description",
    header: "Description",
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
    cell: ({ row }) => {
      const pet = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
