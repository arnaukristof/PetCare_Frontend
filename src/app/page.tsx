import bluelogo from "../pictures/bluelogo.png"
import Image from "next/image"

export default async function Home() {


  return (
    <div className="container mt-10 mx-auto py-10">
      <div className="flex content-center justify-center mb-10">
        <Image
                  src={bluelogo}
                  width={300}
                  height={300}
                  alt="PetCare Logo"
                />
      </div>
      <h1 className="font-bold my-5 text-lg">Welcome to the PetCare Application!</h1>
      <p>PetCare is your ultimate companion for all things pet-related, whether it’s adoption, walking, camping, or bringing in animals. Our platform is designed to make pet care and related services simple and convenient for everyone.</p>
      <h1 className="font-bold my-5">Why choose PetCare?</h1>
      <ul className="list-disc ml-5 ">
        <li className="mb-2">Easily browse adoptable animals and connect directly with adoption centers.</li>
        <li className="mb-2">Effortlessly arrange pet walking services or plan an exciting camp for your kid with a new furry friend.</li>
        <li className="mb-2">Personal connection matters: every booking leads to an on-site meeting where you can discuss all the details to ensure your pet receives the best possible care.</li>
      </ul>
      <p className="my-5">PetCare is more than just an app—it’s a community dedicated to the well-being of pets and the comfort of their owners. Explore the possibilities and see how simple and enjoyable pet care can be!</p>
    </div>
  )
}