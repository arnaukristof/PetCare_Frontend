//import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Main Client Page is here</h1>
      <Link href={"/adoption"}>Adoption</Link>
      <Link href={"/bringin"}>Bring in</Link>
      <Link href={"/walk"}>Walk</Link>
      <Link href={"/camp"}>Camp</Link>
    </main>
  )
}
