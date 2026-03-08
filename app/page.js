import About from '@/components/homepage/About'
import CTA from '@/components/homepage/CTA'
import Hero from '@/components/homepage/Hero'
import Products from '@/components/homepage/Products'
import Projects from '@/components/homepage/Projects'
import ServicesStackSection from '@/components/homepage/Services'
import React from 'react'

export default function page() {
  return (
    <div>
      <Hero/>
      <About/>
      <Projects/>
      <Products/>
      {/* <ServicesStackSection/> */}
      <CTA/>
    </div>
  )
}