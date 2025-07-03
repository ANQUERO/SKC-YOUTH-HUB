import React from 'react'
import Navbar from "@components/Navbar.jsx"
import Hero from './sections/hero.jsx'


const LandingPage = () => {
  return (
    <>
      <main className='background_color'>
        <Navbar />
        <Hero />

      </main>

    </>
  )
}

export default LandingPage