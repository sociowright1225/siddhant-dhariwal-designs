import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import React from 'react'
import Projects from './Projects'

export default function page() {
  return (
    <div>
       <Breadcrumbs
      title="Projects"
      breadcrumbs={["Home", "Projects"]}
      image="https://res.cloudinary.com/dwdmczhsn/image/upload/q_auto/f_auto/v1775186243/project_banner_2.jpg_nudbro.jpg"
    />
    <Projects/>
    </div>
  )
}
