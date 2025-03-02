import React, { useRef } from "react";
import Achivements from './components/Achivements/Achivements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import LatestWorks from './components/ProjectCard'
import "./App.css"

function App() {
  const projectsRef = useRef(null);
  const achievementsRef = useRef(null);
  const scrollToProjects = () => {
    projectsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAchievements = () => {
    achievementsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="bg-[#111] text-white font-['Nunito']">
      <HeroSection 
      scrollToProjects={scrollToProjects}
      scrollToAchievements = {scrollToAchievements}
      />
      <LatestWorks ref={projectsRef}/>
      <Achivements ref={achievementsRef}/>
      <Contact/>
      <Footer/>
    </div>

  )
}

export default App


