import EventsSection from '../components/Home/EventsSection'
import Hero from '../components/Home/Hero'
import ImageCarousel from '../components/Home/ImageCarousel'
import ImageCarousel2 from '../components/Home/ImageCarousel2'
import Numbers from '../components/Home/Numbers'
import Testimonials from '../components/Home/Testimonials'

const Home = () => {
  return (
    <div className=" bg-white overflow-hidden">
      <Hero />
      <Numbers />
      <ImageCarousel />
      <EventsSection />
      <ImageCarousel2 />
      <Testimonials />
      
    </div>
  )
}

export default Home
