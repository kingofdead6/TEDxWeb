import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from "framer-motion";
import image1 from "../../assets/carousel/image1.jpg"; 
import image2 from "../../assets/carousel/image2.jpg";
import image3 from "../../assets/carousel/image3.jpg";
import image4 from "../../assets/carousel/image4.jpg";
import image5 from "../../assets/carousel/image5.jpg"; 
import image6 from "../../assets/carousel/image6.jpg";
import image7 from "../../assets/carousel/image7.jpg";
import image8 from "../../assets/carousel/image8.jpg";
import image9 from "../../assets/carousel/image9.jpg"; 
import image10 from "../../assets/carousel/image10.jpg";
import image11 from "../../assets/carousel/image11.jpg";


const ImageCarousel = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11];

  return (
    <section className="relative pt-2 ">
      <div className="relative max-w-full mx-auto z-10">
        <Slider ref={sliderRef} {...settings}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="px-1"
              initial={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <div className="mx-auto max-w-full relative">
                <div className="rounded-xl">
                  <img
                    src={image}
                    alt={`Carousel image ${index + 1}`}
                    className="w-full h-60 sm:h-64 md:h-100 object-cover rounded-lg"
                  />
                </div>
                {/* Overlap Effect */}
                <div className="absolute -right-2 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/20 z-10" />
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ImageCarousel;