import React from 'react'
import Navbar from "@components/Navbar.jsx"
import Hero from './sections/hero.jsx'
import About from './sections/about.jsx'


const LandingPage = () => {
  return (
    <>
      <main className='background_color'>
        <Navbar />
        <Hero />
        <About />

      </main>

    </>
  )
}

export default LandingPage