import useReveal from './hooks/useReveal';
import Atmosphere from './components/Atmosphere';
import ScrollSpores from './components/ScrollSpores';
import RootLine from './components/RootLine';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandMarquee from './components/BrandMarquee';
import Audience from './components/Audience';
import Services from './components/Services';
import Projects from './components/Projects';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useReveal();

  return (
    <>
      <Atmosphere />
      <ScrollSpores />
      <RootLine />
      <Header />
      <main>
        <Hero />
        <BrandMarquee />
        <Audience />
        <Services />
        <Projects />
        <Process />
        <WhyUs />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
