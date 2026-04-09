import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Overview from './components/Overview';
import MenuSection from './components/MenuSection';
import Reviews from './components/Reviews';
import Gallery from './components/Gallery';
import About from './components/About';
import Footer from './components/Footer';
import FloatingLeaves from './components/FloatingLeaves';
import AdminApp from './admin/AdminApp';
import DownloadPage from './admin/DownloadPage';

function MainSite() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-bg overflow-x-hidden">
      <FloatingLeaves />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />
      <Overview />
      <MenuSection />
      <Reviews />
      <Gallery />
      <About />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
