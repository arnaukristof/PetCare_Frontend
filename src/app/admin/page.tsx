"use client"

import React from 'react'
import ProtectedRoute from '@/components/custom/ProtectedRoute'

const Admin = () => {
  return (
    <>
      <ProtectedRoute>
        <div className="container mx-auto py-10">
          <h1 className='font-bold my-10 '>Welcome to Admin Page!</h1>
          <p>In this page the authorized users can administrate worker, pet, and schedule data.</p>
        </div>
      </ProtectedRoute>
    </>
  )
}
export default Admin