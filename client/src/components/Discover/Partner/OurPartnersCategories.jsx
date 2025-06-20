import { motion } from 'framer-motion';
import brain from '/icons/brain.png';
import bag from '/icons/bag.png';
import camera from '/icons/camera.png';
import world from '/icons/world.png';

const OurPartnersCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'Strategic Partners',
      description: 'Key organizations helping shape our events\' vision and expansion',
      icon: brain,
    },
    {
      id: 2,
      title: 'Venue & Logistics Partners',
      description: 'Institutions and businesses providing event spaces, catering, and operational support',
      icon: bag,
    },
    {
      id: 3,
      title: 'Media Partners',
      description: 'Leading media outlets covering our events and amplifying our message',
      icon: camera,
    },
    {
      id: 4,
      title: 'Community & Outreach Partners',
      description: 'Nonprofits and educational organizations engaged in spreading ideas and impact',
      icon: world,
    },
  ];

  return (
    <section className="relativepy-20 overflow-y-visible mt-20">
      {/* Heading */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
        className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-black text-center mb-16"
      >
        Our Partner Categories
      </motion.h1>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="bg-gray-200 text-black p-6 py-10 rounded-lg shadow-md flex items-center space-x-4 hover:bg-red-600 hover:text-white transition-colors duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: category.id * 0.1 }}
          >
            <div className="rounded-full bg-transparent flex items-center justify-center group-hover:bg-white transition-colors duration-300 mr-4">
              <img
                src={category.icon}
                alt={category.title}
                className="w-32 h-16 rounded-full md:w-20"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="text-md">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurPartnersCategories;