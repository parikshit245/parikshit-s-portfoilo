import React, {forwardRef} from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper modules
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow"; // Import coverflow effect styles
// Import custom styles
import "./Achivements.css";

const Achievements = forwardRef((props, ref) => {
  const testimonials = [
    {
      text: "Selected and working as Jr. Webmaster for the Association for Computing Machinery (ACM) at PCCOE. Responsible for managing and maintaining the ACM chapter’s website, ensuring seamless functionality, and promoting technical events and initiatives to enhance student engagement and learning.",
      title: "ACM Jr. Webmaster",
      subtitle: "PCCOE",
    },
    {
      text: "Participated in the Smart India Hackathon (SIH) 2024 and successfully cleared the college round with my team at PCCOE. Collaborated to develop an innovative solution to a real-world problem, advancing to the next stage of this prestigious national competition organized by the Ministry of Education.",
      title: "SIH 2024",
      subtitle: "PCCOE",
    },
    {
      text: "Secured 3rd prize in the E-Paradox coding event at Spectrum 2024, organized by Pimpri Chinchwad College of Engineering (PCCOE). Demonstrated strong problem-solving skills and coding expertise in a competitive environment, tackling complex challenges under time constraints.",
      title: "E-Paradox 3rd Prize",
      subtitle: "Spectrum 2024",
    },
    {
      text: "Successfully completed 'The Complete 2024 Web Development Bootcamp' by Dr. Angela Yu on Udemy, mastering full-stack web development. Gained expertise in HTML, CSS, JavaScript, Node.js, React, MongoDB, and more through hands-on projects, building a strong foundation for creating dynamic web applications.",
      title: "Full Stack Web Dev Certified",
      subtitle: "Udemy 2024",
    },
  ];

  const titleColor = "#1788ae"; // Single color for all slides

  return (
    <section 
    ref = {ref}
    className="max-w-screen-xl mx-auto px-4 pb-14">
      <h2 className="text-3xl sm:text-[40px] bg-[#111] sm:w-max relative z-10 font-bold px-4 py-2 mx-auto text-center text-[#1788ae] sm:border-2 border-[#1788ae] rounded-md">
        Achievements & Certifications
      </h2>

      {/* Swiper Component with tilt (coverflow) effect */}
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        loop={true} // Infinite looping
        effect="coverflow" // Tilt transition effect
        grabCursor={true} // Show grab cursor for better UX
        centeredSlides={true} // Center the active slide
        slidesPerView="auto" // Adjusts based on slide width
        coverflowEffect={{
          rotate: 50, // Degree of tilt
          stretch: 0, // Space between slides
          depth: 100, // Depth of the tilt (3D effect)
          modifier: 1, // Effect intensity
          slideShadows: true, // Add shadows for depth
        }}
        className="mySwiper !py-12 -mx-4"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="px-4 swiper-slide-tilt">
            <div className="flex flex-col w-full md:max-w-[800px] rounded-lg p-9 mt-9 shadow-[0_0_40px_rgba(59,130,246,0.6)] cursor-grab bg-[#111] text-white">
              {/* Text at the top */}
              <p className="text-[13px] text-left md:text-base md:text-justify mb-4">
                {item.text}
              </p>
              {/* Title and Subtitle at bottom right */}
              <div className="flex flex-col items-end">
                <h3
                  className="font-bold text-lg md:text-xl"
                  style={{ color: titleColor }}
                >
                  {item.title}
                </h3>
                <span
                  className="text-sm md:text-base"
                  style={{ color: titleColor }}
                >
                  {item.subtitle}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next px-4"></div>
        <div className="swiper-button-prev px-4"></div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </section>
  );
});

export default Achievements;