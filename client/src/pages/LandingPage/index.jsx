import React from 'react'
import Navbar from "@components/Navbar.jsx"
import Hero from './sections/hero.jsx'
import About from './sections/about.jsx'
import Officials from './sections/officials.jsx'
import Footer from './sections/footer.jsx'


const LandingPage = () => {
  return (
    <>
      <main className='background_color'>
        <Navbar />
        <Hero />
        <About />
        <Officials />
        <Footer />

      </main>

    </>
  )
}

export default LandingPage