import React from 'react'
import OurPartners from '../../components/Discover/Partner/OurPartners'
import ValuedPartners from '../../components/Discover/Partner/ValuedPartners'
import OurPartnersCategories from '../../components/Discover/Partner/OurPartnersCategories'
import BecomePartner from '../../components/Discover/Partner/BecomePartner'

const Partners = () => {
  return (
    <div>
        <OurPartners />
        <ValuedPartners />
        <OurPartnersCategories />
        <BecomePartner />
    </div>
  )
}

export default Partners