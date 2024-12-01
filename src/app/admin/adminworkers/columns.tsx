"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Worker = {
  id: number;
  name: string;
  petTypes: number[];
  daysOfWeek: number[];
}
import { ActionsCell } from "./ActionsCell";

export const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Worker Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "petTypes",
    header: "Pet Types",
    cell: ({row}) => row.original.petTypes.join(", "),
  },
  {
    accessorKey: "daysOfWeek",
    header: "Days of Week",
    cell: ({row}) => row.original.daysOfWeek.join(", "),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell worker={row.original}/>
  }
]
