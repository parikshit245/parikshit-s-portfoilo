import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import MatterWrap from "matter-wrap";

const HeroSection = ({ scrollToProjects, scrollToAchievements }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const canvasRef = useRef(null);
  const matterInstance = useRef(null);

  // Debounce function
  const debounce = (func, wait, immediate) => {
    let timeout;
    return (...args) => {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  useEffect(() => {
    // Register plugins
    Matter.use(MatterAttractors);
    Matter.use(MatterWrap);

    // Module aliases
    const {
      Engine,
      Events,
      Runner,
      Render,
      World,
      Body,
      Mouse,
      Common,
      Bodies,
    } = Matter;

    // Create engine
    const engine = Engine.create();
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.1;

    // Dimensions
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        showVelocity: false,
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: "transparent",
      },
    });

    // Prevent scrolling by setting bounds
    render.bounds.max.x = dimensions.width;
    render.bounds.max.y = dimensions.height;
    render.bounds.min.x = 0;
    render.bounds.min.y = 0;

    // Create runner
    const runner = Runner.create();

    // Create demo scene
    const world = engine.world;
    world.gravity.scale = 0;

    // Create attractor body (increased size)
    const attractiveBody = Bodies.circle(
      render.options.width / 2,
      render.options.height / 2,
      Math.max(dimensions.width / 22, dimensions.height / 22) / 2, // Increased from /25 to /15 for a larger circle
      {
        render: {
          fillStyle: `#000`,
          strokeStyle: `#000`,
          lineWidth: 0,
        },
        isStatic: true,
        plugin: {
          attractors: [
            (bodyA, bodyB) => ({
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            }),
          ],
        },
      }
    );

    World.add(world, attractiveBody);

    // Add attracted bodies
    for (let i = 0; i < 60; i += 1) {
      const x = Common.random(0, render.options.width);
      const y = Common.random(0, render.options.height);
      const s =
        Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
      const polygonNumber = Common.random(3, 6);

      const polygon = Bodies.polygon(x, y, polygonNumber, s, {
        mass: s / 20,
        friction: 0,
        frictionAir: 0.02,
        angle: Math.round(Math.random() * 360),
        render: {
          fillStyle: "#222222",
          strokeStyle: `#000000`,
          lineWidth: 2,
        },
      });

      World.add(world, polygon);

      const r = Common.random(0, 1);
      const circle1 = Bodies.circle(x, y, Common.random(2, 8), {
        mass: 0.1,
        friction: 0,
        frictionAir: 0.01,
        render: {
          fillStyle: r > 0.3 ? `#27292d` : `#444444`,
          strokeStyle: `#000000`,
          lineWidth: 2,
        },
      });

      World.add(world, circle1);

      const circle2 = Bodies.circle(x, y, Common.random(2, 20), {
        mass: 6,
        friction: 0,
        frictionAir: 0,
        render: {
          fillStyle: r > 0.3 ? `#334443` : `#222222`,
          strokeStyle: `#111111`,
          lineWidth: 4,
        },
      });

      World.add(world, circle2);

      const circle3 = Bodies.circle(x, y, Common.random(2, 30), {
        mass: 0.2,
        friction: 0.6,
        frictionAir: 0.8,
        render: {
          fillStyle: `#191919`,
          strokeStyle: `#111111`,
          lineWidth: 3,
        },
      });

      World.add(world, circle3);
    }

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    Events.on(engine, "afterUpdate", () => {
      if (!mouse.position.x) return;
      Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.12,
        y: (mouse.position.y - attractiveBody.position.y) * 0.12,
      });
    });

    // Start the engine and renderer
    Runner.run(runner, engine);
    Render.run(render);

    // Store Matter instance for resizing
    matterInstance.current = {
      engine,
      runner,
      render,
      canvas: render.canvas,
    };

    // Handle window resize
    const setWindowSize = () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      render.canvas.width = newDimensions.width;
      render.canvas.height = newDimensions.height;
      render.options.width = newDimensions.width;
      render.options.height = newDimensions.height;
      render.bounds.max.x = newDimensions.width;
      render.bounds.max.y = newDimensions.height;
      render.bounds.min.x = 0;
      render.bounds.min.y = 0;
      Matter.Render.setSize(render, newDimensions.width, newDimensions.height);
      Body.setPosition(attractiveBody, {
        x: newDimensions.width / 2,
        y: newDimensions.height / 2,
      });
    };

    const debouncedSetWindowSize = debounce(setWindowSize, 250);
    window.addEventListener("resize", debouncedSetWindowSize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", debouncedSetWindowSize);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return (
    <section className="flex flex-col justify-between h-screen overflow-hidden">
      <header className="z-10 pointer-events-none flex items-center justify-between w-full px-4 mt-4 max-w-screen-xl mx-auto">
        <img
          src="./assets/images/name_white.png"
          className="h-[70px] w-[70px] object-contain"
          alt=""
        />
        <div className="hidden sm:flex gap-6 pointer-events-auto items-center">
          <span
            className="nav-link text-lg  hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200 cursor-pointer"
            onClick={scrollToProjects}
          >
            Projects
          </span>
          <span
            className="nav-link text-lg  hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200 cursor-pointer"
            onClick={scrollToAchievements}
          >
            Achievements
          </span>
        </div>

        {/* Mobile Hamburger Icon */}
        {/* Mobile Hamburger Icon */}
        <div className="sm:hidden pointer-events-auto">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed top-0 right-0 w-full h-48 bg-[#111] text-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 sm:hidden pointer-events-auto`}
        style={{ backgroundColor: "rgba(17, 17, 17, 0.9)" }} // Inline fix for transparency
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-x"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-6 mt-16">
          <span
            className="nav-link text-lg text-[#b0b2c3] hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200 cursor-pointer"
            onClick={() => {
              scrollToProjects();
              toggleMenu();
            }}
          >
            Projects
          </span>
          <span
            className="nav-link text-lg text-[#b0b2c3] hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200 cursor-pointer"
            onClick={() => {
              scrollToAchievements();
              toggleMenu();
            }}
          >
            Achievements
          </span>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="absolute inset-0 hidden md:block overflow-hidden"
        id="wrapper-canvas"
      />

      <div className="flex -mt-10 relative">
        <div className="w-full px-4 max-w-screen-xl mx-auto">
          <div className="relative">
            <img
              src="./assets/images/name_blue.png"
              alt="My custom image"
              className="object-contain pointer-events-none absolute top-0 left-1/2 -translate-y-[20px] sm:-translate-y-[170px] -translate-x-1/2 w-[250px] sm:w-[380px] md:w-[650px] h-[280px] sm:h-[363px] md:h-[580px]"
            />
          </div>
          <div className="relative ml-12">
            <h1 className="pointer-events-none text-[35px] md:text-[60px] font-['Spartan'] mr-12">
              Parikshit Rajpurohit
            </h1>
            <p className="pointer-events-none font-['Merriweather'] italic mb-5 md:mb-8 text-[13px] md:text-[17px] mr-12">
              3rd year Computer Science student at PCCoE, Pune.
            </p>
            <button
              className="bg-[#4595eb] py-2 px-5 rounded font-extrabold bg-gradient-to-l from-[#1595b6] to-[#1f2667] relative hover:scale-110 ease-in-out duration-100 group cursor-pointer"
              onClick={toggleModal}
            >
              About me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="44"
                height="44"
                viewBox="0 0 100 100"
                className="hidden sm:block absolute top-1/2 -translate-y-1/2 -right-7 group-hover:-right-8 ease-in-out duration-100"
              >
                <g transform="translate(0,-952.36218)">
                  <path
                    d="m 88.999835,1002.3621 c 0,-0.4628 -0.2799,-1.0773 -0.5639,-1.3755 l -15.9997,-17.00026 c -0.747,-0.7723 -1.9572,-0.8618 -2.8281,-0.078 -0.7786,0.7007 -0.798,2.0673 -0.078,2.8282 l 12.8435,13.62516 -69.37347,0 c -1.1046,0 -2,0.8954 -2,2 0,1.1046 0.8954,2.0001 2,2.0001 l 69.37347,0 -12.8435,13.6252 c -0.7199,0.7608 -0.6688,2.0938 0.078,2.8281 0.7885,0.7752 2.0925,0.7062 2.8281,-0.078 l 15.9997,-17.0002 c 0.4701,-0.4611 0.556,-0.9052 0.5639,-1.3748 z"
                    fill="#fff"
                    fillOpacity="1"
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal */}
        {/* Modal */}
        {isModalOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black z-40"
              onClick={toggleModal}
            ></div>
            {/* Modal Box */}
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[85vw] md:w-[77vw] h-[90vh] sm:h-[95vh] z-50 rounded-lg shadow-lg bg-[#111] flex md:flex-row flex-col"
              style={{ backgroundColor: "rgba(17, 17, 17, 0.8)" }}
            >
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 focus:outline-none z-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-x text-white cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {/* Left: Text */}
              <div className=" md:w-1/2 w-full flex flex-col items-center md:items-start pt-8 sm:pt-14 pb-4 md:pl-24 md:pr-24 overflow-auto">
                <h2 className="text-lg sm:text-xl md:text-[23px] font-bold mb-4 text-[#1595b6]">
                  ABOUT ME
                </h2>
                <p className="text-sm sm:text-base md:text-base text-white pt-2  text-justify md:text-left px-4 sm:px-0">
                  I'm a 3rd-year Computer Science student with a passion for
                  full-stack development and problem-solving. I enjoy building
                  dynamic web applications, exploring new technologies, and
                  improving my skills in algorithms and databases to create
                  efficient solutions.
                </p>
                <ul className="flex flex-wrap justify-center md:justify-start gap-1 sm:gap-2 mt-2 sm:mt-4 px-4 sm:px-0">
                  {[
                    "#HTML",
                    "#CSS",
                    "#Javascript",
                    "#TailwindCSS",
                    "#EJS",
                    "#Node.js",
                    "#Express.js",
                    "#React.js",
                    "#MongoDB",
                    "#MySQL",
                    "#PostgreSQL",
                    "#Git",
                    "#GitHub",
                    "#C++",
                    "#Python",
                    "#MatplotLib",
                    "#Pandas",
                    "#Numpy",
                  ].map((tag, index) => (
                    <li
                      key={index}
                      className="border rounded-[50px] border-[#7b7b7b] px-2 sm:px-[10px] py-1 sm:py-[5px] text-xs sm:text-sm md:text-[13px] text-white"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <h2 className="text-lg sm:text-xl md:text-[23px] font-bold mb-4 text-[#1595b6] pt-8 sm:pt-14">
                  MERN STACK
                </h2>
                {/* MERN Toolkit */}
                <div className="flex justify-between items-center w-[200px] sm:w-[250px] md:w-[300px] pt-6 sm:pt-10 mx-auto md:mx-0">
                  {/* MongoDB */}
                  <div className="flex flex-col items-center gap-2 sm:gap-5 text-lg sm:text-[1.5rem] font-bold cursor-default relative group">
                    <img
                      src="/assets/images/mongo.svg"
                      alt="mongodb"
                      className="relative z-10 h-8 sm:h-10 md:h-[50px] w-10 md:w-[50px] object-contain"
                    />
                    <span className="text-[#47a248]">M</span>
                    <div className="absolute top-2 sm:top-4 text-xs sm:text-[17px] text-white bg-[#47a248] rounded-3xl px-2 sm:px-6 py-1 sm:py-2 opacity-0 group-hover:top-[-32px] sm:group-hover:top-[-48px] group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] after:content-[''] after:absolute after:h-2 after:w-2 sm:after:h-3 sm:after:w-3 after:bg-inherit after:bottom-[-4px] sm:after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:rotate-45">
                      <span className="relative z-10">mongoDB</span>
                    </div>
                  </div>
                  {/* Express */}
                  <div className="flex flex-col items-center gap-2 sm:gap-5 text-lg sm:text-[1.5rem] font-bold cursor-default relative group">
                    <img
                      src="/assets/images/express.svg"
                      alt="express"
                      className="relative z-10 h-8 sm:h-10 md:h-[50px] w-10 md:w-[50px] object-contain"
                    />
                    <span>E</span>
                    <div className="absolute top-2 sm:top-4 text-xs sm:text-[17px] text-black bg-white rounded-3xl px-2 sm:px-6 py-1 sm:py-2 opacity-0 group-hover:top-[-32px] sm:group-hover:top-[-48px] group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] after:content-[''] after:absolute after:h-2 after:w-2 sm:after:h-3 sm:after:w-3 after:bg-inherit after:bottom-[-4px] sm:after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:rotate-45">
                      <span className="relative z-10">Express.js</span>
                    </div>
                  </div>
                  {/* React */}
                  <div className="flex flex-col items-center gap-2 sm:gap-5 text-lg sm:text-[1.5rem] font-bold cursor-default relative group">
                    <img
                      src="/assets/images/react.svg"
                      alt="react"
                      className="relative z-10 h-8 sm:h-10 md:h-[50px] w-10 md:w-[50px] object-contain"
                    />
                    <span className="text-[#61dafb]">R</span>
                    <div className="absolute top-2 sm:top-4 text-xs sm:text-[17px] text-black bg-[#61dafb] rounded-3xl px-2 sm:px-6 py-1 sm:py-2 opacity-0 group-hover:top-[-32px] sm:group-hover:top-[-48px] group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] after:content-[''] after:absolute after:h-2 after:w-2 sm:after:h-3 sm:after:w-3 after:bg-inherit after:bottom-[-4px] sm:after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:rotate-45">
                      <span className="relative z-10">React.js</span>
                    </div>
                  </div>
                  {/* Node */}
                  <div className="flex flex-col items-center gap-2 sm:gap-5 text-lg sm:text-[1.5rem] font-bold cursor-default relative group">
                    <img
                      src="/assets/images/node.svg"
                      alt="node"
                      className="relative z-10 h-8 sm:h-10 md:h-[50px] w-8 sm:w-10 md:w-[50px] object-contain"
                    />
                    <span className="text-[#8cc84b]">N</span>
                    <div className="absolute top-2 sm:top-4 text-xs sm:text-[17px] text-black bg-[#8cc84b] rounded-3xl px-2 sm:px-6 py-1 sm:py-2 opacity-0 group-hover:top-[-32px] sm:group-hover:top-[-48px] group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] after:content-[''] after:absolute after:h-2 after:w-2 sm:after:h-3 sm:after:w-3 after:bg-inherit after:bottom-[-4px] sm:after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:rotate-45">
                      <span className="relative z-10">Node.js</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Image */}
              <div className="md:w-1/2 w-0 md:p-6 p-0 flex items-center justify-center">
                <img
                  src="/assets/images/coder.svg"
                  alt="About Me"
                  className="md:block hidden max-w-full max-h-full object-cover rounded-lg"
                />
              </div>
              
            </div>
          </>
        )}

        <ul className="ml-auto space-y-6 text-[#b0b2c3] absolute right-8">
          {[
            {
              href: "https://www.linkedin.com/in/parikshit-rajpurohit/",
              viewBox: "0 0 448 512",
              path: "M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z",
            },
            {
              href: "https://x.com/ParikshitR24",
              viewBox: "0 0 512 512",
              path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
            },
            {
              href: "https://www.instagram.com/parikshitrajpurohit56/",
              viewBox: "0 0 448 512",
              path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
            },
            {
              href: "mailto:parikshitrajpurohit56@gmail.com",
              viewBox: "0 0 512 512",
              path: "M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z",
            },
            {
              href: "https://github.com/parikshit245",
              viewBox: "0 0 496 512",
              path: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z",
            },
          ].map((social, index) => (
            <li key={index}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                <svg
                  className="w-5 sm:w-7 hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={social.viewBox}
                >
                  <path fill="currentColor" d={social.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="bg-[#4595eb] py-2 px-5 rounded font-extrabold bg-gradient-to-l from-[#1595b6] to-[#1f2667] relative hover:scale-110 ease-in-out duration-100 group self-center mb-20 cursor-pointer"
        onClick={scrollToProjects}
      >
        Projects
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="44"
          height="44"
          viewBox="0 0 100 100"
          className="absolute rotate-90 left-1/2 -translate-x-1/2 top-11 group-hover:top-12 ease-in-out duration-100"
        >
          <g transform="translate(0,-952.36218)">
            <path
              d="m 88.999835,1002.3621 c 0,-0.4628 -0.2799,-1.0773 -0.5639,-1.3755 l -15.9997,-17.00026 c -0.747,-0.7723 -1.9572,-0.8618 -2.8281,-0.078 -0.7786,0.7007 -0.798,2.0673 -0.078,2.8282 l 12.8435,13.62516 -69.37347,0 c -1.1046,0 -2,0.8954 -2,2 0,1.1046 0.8954,2.0001 2,2.0001 l 69.37347,0 -12.8435,13.6252 c -0.7199,0.7608 -0.6688,2.0938 0.078,2.8281 0.7885,0.7752 2.0925,0.7062 2.8281,-0.078 l 15.9997,-17.0002 c 0.4701,-0.4611 0.556,-0.9052 0.5639,-1.3748 z"
              fill="#fff"
              fillOpacity="1"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;

