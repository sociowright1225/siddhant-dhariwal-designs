import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import React from 'react'
import Projects from './Projects'

export default function page() {
  return (
    <div>
        <Breadcrumbs
      title="Projects"
      breadcrumbs={["Home", "Projects"]}
    />
    <Projects/>
    </div>
  )
}
