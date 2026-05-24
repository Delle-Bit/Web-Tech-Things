import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-dark-900 text-gray-100 overflow-x-hidden">
      <Navigation />
      <Hero />
      <Stats />
      <Services />
      <Portfolio />
      <Testimonials />
      <Process />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
