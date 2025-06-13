import EventsSection from '../components/Home/EventsSection'
import Hero from '../components/Home/Hero'
import Numbers from '../components/Home/Numbers'
import Testimonials from '../components/Home/Testimonials'

const Home = () => {
  return (
    <div className=" bg-white overflow-hidden">
      <Hero />
      <Numbers />
      <EventsSection />
      <Testimonials />
      
    </div>
  )
}

export default Home
