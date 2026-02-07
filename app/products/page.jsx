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
    />
      <Products/>
      <CTA/>
    </div>
  )
}
