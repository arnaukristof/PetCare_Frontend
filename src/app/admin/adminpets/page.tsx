import { Pet, columns } from "./columns"
import { DataTable } from "../../../components/data-table"

async function getData(): Promise<Pet[]> {
  // Fetch data from your API here.
  const res = await fetch(
    'https://localhost:7245/api/pets/getallpetswithadditionaldata', 
    { next: { revalidate: 10 } });
  const data = await res.json();
  return data;
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1>All Pets</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
