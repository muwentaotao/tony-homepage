import Hero from '../components/Hero';
import AboutCard from '../components/AboutCard';
import EntryCards from '../components/EntryCards';
import TravelGallery from '../components/TravelGallery';
import ThingsBuilt from '../components/ThingsBuilt';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutCard />
      <EntryCards />
      <TravelGallery />
      <ThingsBuilt />
      <Contact />
      <Footer />
    </>
  );
}
