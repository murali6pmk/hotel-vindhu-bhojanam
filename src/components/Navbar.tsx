import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, ShieldCheck } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'menu', label: 'Menu' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
];

interface NavbarProps {
  activeSection: string;
  setActiveSection: (s: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-glass py-2' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white text-lg font-bold shadow-lg">
            🍛
          </div>
          <div>
            <div className="font-yatra text-gold text-sm leading-tight tracking-wide">Hotel Vindhu</div>
            <div className="font-telugu text-saffron text-xs leading-tight">విందు భోజనం</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-saffron text-white shadow-lg'
                  : 'text-cream hover:text-gold hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:08143668888"
            className="flex items-center gap-2 px-4 py-2 border border-gold/50 rounded-full text-gold text-sm hover:bg-gold hover:text-deep-brown transition-all duration-300"
          >
            <Phone size={14} />
            <span>Call Now</span>
          </a>
          <button
            onClick={() => scrollTo('about')}
            className="flex items-center gap-2 px-4 py-2 bg-saffron rounded-full text-white text-sm hover:bg-gold transition-all duration-300 pulse-glow"
          >
            <MapPin size={14} />
            <span>Directions</span>
          </button>
          <a
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #2c1a0e, #1a0f06)',
              border: '1px solid rgba(212,160,23,0.5)',
              color: '#d4a017',
              boxShadow: '0 0 15px rgba(212,160,23,0.15)',
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin Portal</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden nav-glass mt-2 mx-4 rounded-2xl p-4 border border-gold/20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-4 py-3 text-cream hover:text-gold hover:bg-white/5 rounded-xl transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
          <div className="mt-3 pt-3 border-t border-gold/20 flex gap-3">
            <a href="tel:08143668888" className="flex-1 text-center py-2 border border-gold/50 rounded-full text-gold text-sm">
              📞 Call
            </a>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-saffron rounded-full text-white text-sm">
              📍 Map
            </a>
          </div>
          <a
            href="/admin"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #2c1a0e, #1a0f06)',
              border: '1px solid rgba(212,160,23,0.5)',
              color: '#d4a017',
            }}
          >
            <ShieldCheck size={14} />
            Admin Portal
          </a>
        </div>
      )}
    </nav>
  );
}
