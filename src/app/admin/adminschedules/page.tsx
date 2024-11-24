import { Schedule, columns } from "./columns"
import { DataTable } from "../../../components/data-table"

async function getData(): Promise<Schedule[]> {
  // Fetch data from your API here.
  const res = await fetch(
    'https://localhost:7245/api/Schedule/GetAllSchedulesWithAdditionalData', 
    { next: { revalidate: 10 } });
  const data = await res.json();
  return data;
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1>All Schedules</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
