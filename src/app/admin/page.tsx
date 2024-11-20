import React from 'react'
import Link from 'next/link'


const Admin = () => {
  return (
    <main>
      <div className="bg-gray-500 p-5 flex items-center">
        <h1>logo</h1>
        <Link className='mr-5 ml-5 hover:text-cyan-400' href="/admin/adminworkes">Workers</Link>
        <Link className='mr-5 ml-5 hover:text-cyan-400' href="/admin/adminpets">Pets</Link>
        <Link className='mr-5 ml-5 hover:text-cyan-400' href="/admin/adminschedules">Schedules</Link>
      </div>
    </main>
  )
}

export default Admin