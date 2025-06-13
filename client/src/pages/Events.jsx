import ExploreEvents from '../components/Events/ExploreEvents'
import UpcomingEvents from '../components/Events/UpcomingEvents'
import PastEvents from '../components/Events/PastEvents'

const Events = () => {
  return (
    <div className=" bg-white overflow-hidden">
    <ExploreEvents />
    <UpcomingEvents />
    <PastEvents />
    </div>
  )
}

export default Events