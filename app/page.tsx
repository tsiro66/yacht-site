import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FleetSection from "./components/FleetSection";
import CruisesSection from "./components/CruisesSection";
import ContactForm from "./components/ContactForm";
import Preloader from "./components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <Hero />
      <FleetSection />
      <CruisesSection />
      <ContactForm />
    </>
  );
}
