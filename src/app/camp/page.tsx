'use client'

import React, { useState } from "react"

export default function Camp() {
  const [file, setFile] = useState<File>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('http://localhost:5290/api/Image/upload', {
        method: 'POST',
        body: data
      })
      if(!res.ok) throw Error(await res.text())
    } catch (e: unknown) {
      console.error(e)
  }
  }

  return (
    <main>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input type='submit'/>
      </form>
    </main>
  )
}