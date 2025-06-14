import WhoWeAre from '../../components/AboutUs/WhoWeAre'
import OurMission from '../../components/AboutUs/OurMission'
import OurValues from '../../components/AboutUs/OurValues'
import FrequentQuestions from '../../components/AboutUs/FrequentQuestions'
import OurTeam from '../../components/AboutUs/OurTeam'

const AboutUs = () => {
  return (
    <div className=" bg-white overflow-hidden">
    <WhoWeAre />
    <OurMission />
    <OurValues />
    <OurTeam />
    <FrequentQuestions />
    </div>
  )
}

export default AboutUs ;