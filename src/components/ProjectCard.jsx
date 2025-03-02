import React, {forwardRef} from "react";

const ProjectCard = ({
  href,
  imgSrc,
  title,
  subtitle,
  description,
  tags,
  titleColor,
  borderColor,
  bgColor,
  textColor = "white", // Default to white, override for specific cases
  reverse = false,
}) => (
  <div
  className={`flex flex-col sm:flex-row gap-4 mt-20 sm:gap-[80px] mx-6 items-center sm:mt-20 relative`}
  >
    {/* Horizontal line */}
    <div
      className={`h-[1px] ${
        reverse ? "left-1/2 right-1/4" : "left-1/4 right-1/2"
      } bg-[#1788ae] absolute top-1/2 hidden sm:block`}
    ></div>
    {/* Circle indicator */}
    <div
      className={`w-4 h-4 rounded-full border-[3px] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block`}
      style={{ borderColor: borderColor }} // Inline style for dynamic color
    ></div>
    {/* Image and link */}
    <a
      href={href}
      className={`flex w-full relative justify-center sm:justify-start ${
        reverse ? "order-1 sm:order-2" : ""
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={`flex flex-col items-center relative group sm:hover:scale-105 ease-in-out duration-200 ${
          reverse ? "sm:ml-auto" : "sm:mr-auto"
        }`}
      >
        <img
          className="max-w-[400px] w-full relative z-10 drop-shadow-[0_0px_50px_rgba(59,130,246,0.6)]"
          src={imgSrc}
          alt={`${title} screenshot`}
        />
        <span
          className={`flex group-hover:-top-14 ease-jump duration-200 sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2`}
          style={{ backgroundColor: bgColor, color: textColor }} // Inline styles for bg and text
        >
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-external-link"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </span>
      </div>
    </a>
    {/* Text content */}
    <div className={`w-full ${reverse ? "order-2 sm:order-1" : ""}`}>
      <h3
        className="font-bold text-2xl md:text-4xl"
        style={{ color: titleColor }} // Inline style for dynamic color
      >
        {title}
      </h3>
      <span
        className="text-base md:text-lg"
        style={{ color: titleColor }} // Inline style for dynamic color
      >
        {subtitle}
      </span>
      <p className="text-justify text-sm md:text-base mt-2">{description}</p>
      <ul className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <li
            key={index}
            className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const LatestWorks = forwardRef((props, ref) => {
  const projects = [
    {
      href: "https://github.com/parikshit245/Keeper-s-project",
      imgSrc: "./assets/images/keeper.webp",
      title: "Keeper's project",
      subtitle: "(Quick Notes)",
      description:
        "Keeper is a simple and intuitive note-taking app that helps you quickly jot down, organize, and manage your ideas effortlessly.",
      tags: [
        "#react.js",
        "#express.js",
        "#node.js",
        "#css",
        "#javascript",
        "#material-ui",
      ],
      titleColor: "#f5ba13",
      borderColor: "#f5ba13",
      bgColor: "#f5ba13",
      textColor: "white",
      reverse: false,
    },
    {
      href: "https://github.com/parikshit245/travel-tracker",
      imgSrc: "./assets/images/travel_tracker.webp",
      title: "Travel tracker",
      subtitle: "(Globe Trotter)",
      description:
        "Travel Tracker lets you mark and color the countries you've visited on a world map, creating a visual journey of your adventures.",
      tags: [
        "#ejs",
        "#express.js",
        "#node.js",
        "#pgAdmin",
        "#postgreSQL",
        "#css",
        "#javascript",
      ],
      titleColor: "#008080",
      borderColor: "#008080",
      bgColor: "#008080",
      textColor: "black",
      reverse: true,
    },
    {
      href: "https://github.com/parikshit245/guess-capital",
      imgSrc: "./assets/images/guess_capital.webp",
      title: "Guess Capital",
      subtitle: "(Capital Quest)",
      description:
        "Guess Capital is a fun and interactive game where you test your geography skills by identifying the capitals of random countries.",
      tags: [
        "#ejs",
        "#express.js",
        "#node.js",
        "#pgAdmin",
        "#postgreSQL",
        "#css",
        "#javascript",
      ],
      titleColor: "#e9313d",
      borderColor: "#e9313d",
      bgColor: "#e9313d",
      textColor: "white",
      reverse: false,
    },
    {
      href: "https://github.com/parikshit245/simon_game",
      imgSrc: "./assets/images/simon.webp",
      title: "Simon Game",
      subtitle: "(Memory Maestro)",
      description:
        "Simon Game is a classic memory challenge where you repeat an increasingly complex sequence of lights and sounds to test your recall skills.",
      tags: [
        "#html",
        "#css",
        "#javascript"
      ],
      titleColor: "#008000",
      borderColor: "#008000",
      bgColor: "#008000",
      textColor: "white",
      reverse: true,
    },
    {
      href: "https://github.com/parikshit245/drum-kit",
      imgSrc: "./assets/images/drum_kit.webp",
      title: "Drum Kit",
      subtitle: "(Beat Blast)",
      description:
        "Drum Kit is an interactive virtual drum set that lets you play various beats using keyboard keys for a fun drumming experience.",
      tags: [
        "#html",
        "#css",
        "#javascript"
      ],
      titleColor: "#da0463",
      borderColor: "#da0463",
      bgColor: "#da0463",
      textColor: "white",
      reverse: false,
    },
    
  ];

  return (
    <section 
    ref={ref}
    className="max-w-screen-xl mx-auto relative pb-8 sm:pb-16">
      <h2
        className="text-3xl sm:text-[40px] bg-[#111] relative z-10 font-bold px-4 py-2 w-max mx-auto text-center text-[#1788ae] sm:border-b-2 border-[#1788ae]"
      >
        Projects
      </h2>
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
      <div className="w-[2px] hidden sm:block bg-[#1788ae] absolute top-0 bottom-0 left-1/2 -translate-x-1/2"></div>
    </section>
  );
});

export default LatestWorks;