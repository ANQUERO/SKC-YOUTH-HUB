import React from 'react'
import Navbar from "@components/Navbar.jsx"
import Hero from './sections/hero.jsx'
import About from './sections/about.jsx'
import Organizations from './sections/organizations.jsx'
import Officials from './sections/officials.jsx'
import Location from './sections/location.jsx'
import Footer from './sections/footer.jsx'
import style from '@styles/landingpage.module.scss'


const LandingPage = () => {
  return (
    <>
      <main className={style.landing_page}>
        <Navbar />
        <Hero />
        <About />
        <Organizations />
        <Officials />
        <Location />
        <Footer />
      </main>

    </>
  )
}

export default LandingPage