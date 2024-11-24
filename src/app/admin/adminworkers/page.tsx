import { Worker, columns } from "./columns"
import { DataTable } from "../../../components/data-table"

async function getData(): Promise<Worker[]> {
  // Fetch data from your API here.
  const res = await fetch(
    'http://localhost:5290/api/Workers/GetWorkersWithAdditionalData', 
    { next: { revalidate: 10 } });
  const data = await res.json();
  return data;
}

export default async function Workers() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1>All Workers</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
