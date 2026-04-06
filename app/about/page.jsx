import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import React from 'react'
import MeetOurFounder from './MeetOurFounder'
import OurVision from './OurVision'
import WhatWeDo from './WhatWeDo'
import WhatWeCreate from './WhatWeCreate'
import CTA from '@/components/homepage/CTA'
import about from "@/public/about/about3.jpg"

export default function page() {
  return (
    <div>
       <Breadcrumbs
      title="About"
      breadcrumbs={["Home", "About"]}
      image={about}
    />
      <MeetOurFounder/>
      <OurVision/>
      <WhatWeDo/>
      
      <CTA/>
    </div>
  )
}
