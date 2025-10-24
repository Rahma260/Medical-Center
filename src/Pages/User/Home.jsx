import BenefitsSection from "../../Components/home/BenefitsSection";
import CareAbout from "../../Components/home/CareAbout";
import Departments from "../../Components/home/Departments";
import HeroSection from "../../Components/home/HeroSection";
import NewsSection from "../../Components/home/NewsSection";
import TestimonialsSection from "../../Components/home/TestimonialsSection";
import TopSpecialists from "../../Components/home/TopSpecialists";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CareAbout />
      <Departments />
      <TopSpecialists />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsSection />
    </>
  )
}