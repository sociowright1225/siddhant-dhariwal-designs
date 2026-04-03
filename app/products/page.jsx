import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import React from 'react'
import Products from './Products'
import CTA from '@/components/homepage/CTA'

export default function page() {
  return (
    <div>
       <Breadcrumbs
      title="Products"
      breadcrumbs={["Home", "Products"]}
      image="https://res.cloudinary.com/dwdmczhsn/image/upload/q_auto/f_auto/v1775186056/projects_banner.jpg_rpzw3m.jpg"
    />
      <Products/>
      <CTA/>
    </div>
  )
}
