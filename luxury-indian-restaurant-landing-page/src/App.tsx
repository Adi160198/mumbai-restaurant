import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Smooth scroll utility ───
function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = 64;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ─── Intersection Observer Hook ───
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Floating Particle ───
function Particle({ delay, left, duration, size }: { delay: number; left: string; duration: number; size: number }) {
  return (
    <div
      className="absolute rounded-full hidden sm:block"
      style={{
        left,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(212,168,71,${0.4 + Math.random() * 0.4}), transparent)`,
        animation: `particle-float ${duration}s linear ${delay}s infinite`,
        bottom: '-10px',
      }}
    />
  );
}

// ─── Steam Effect ───
function SteamEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${35 + i * 12}%`,
            bottom: '55%',
            width: '30px',
            height: '60px',
            background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.08), transparent)',
            borderRadius: '50%',
            animation: `steam ${3 + i * 0.5}s ease-in-out ${i * 0.8}s infinite`,
            filter: 'blur(8px)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Navbar ───
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    smoothScrollTo(id);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'glass py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gold-500/60 flex items-center justify-center group-hover:border-gold-400 transition-colors duration-300">
            <span className="font-serif text-gold-500 text-sm sm:text-lg font-bold">Z</span>
          </div>
          <span className="font-serif text-lg sm:text-2xl tracking-[0.15em] sm:tracking-[0.2em] text-ivory font-semibold">
            ZAIKA
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {[
            { label: 'Our Story', target: 'heritage' },
            { label: 'Menu', target: 'dishes' },
            { label: "Chef's Choice", target: 'chef-special' },
            { label: 'Reviews', target: 'testimonials' },
          ].map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="font-sans text-[13px] tracking-[0.18em] uppercase text-cream-200/70 hover:text-gold-400 transition-colors duration-300 relative group whitespace-nowrap"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-ivory p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-px bg-gold-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block h-px bg-gold-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-gold-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden glass absolute top-full left-0 right-0 transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 sm:px-6 py-5 flex flex-col gap-3">
          {[
            { label: 'Our Story', target: 'heritage' },
            { label: 'Menu', target: 'dishes' },
            { label: "Chef's Choice", target: 'chef-special' },
            { label: 'Reviews', target: 'testimonials' },
          ].map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="font-sans text-[13px] tracking-[0.18em] uppercase text-cream-200/70 hover:text-gold-400 transition-colors duration-300 text-left py-2"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ───
function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-maroon-950">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/80 via-maroon-950 to-maroon-950" />
      <div className="absolute inset-0 radial-glow-warm" />

      {/* Particles (hidden on mobile for performance) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 2}
            left={`${5 + (i * 6.5) % 90}%`}
            duration={8 + (i % 5) * 2}
            size={3 + (i % 4) * 2}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20 pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Text Content */}
        <div className={`flex-1 text-center lg:text-left transition-all duration-1500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="ornament-divider mb-4 sm:mb-6 justify-center lg:justify-start">
            <span className="text-gold-500 font-sans text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">Est. 1998 · Mumbai</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ivory leading-[1.05] mb-4 sm:mb-6">
            Where Spice
            <br />
            Meets
            <br />
            <span className="text-gradient-gold italic">Sovereignty</span>
          </h1>

          <p className="font-sans text-cream-300/60 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-10 px-2 sm:px-0">
            A culinary journey through India's royal kitchens, where centuries-old traditions meet modern artistry on every plate.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
            <button
              onClick={() => smoothScrollTo('reservation')}
              className="w-full sm:w-auto btn-glow px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gold-500 to-burnt-orange text-maroon-950 font-semibold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full animate-glow-pulse"
            >
              Reserve Your Experience
            </button>
            <button
              onClick={() => smoothScrollTo('dishes')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-gold-500/30 text-gold-400 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full hover:border-gold-500/60 transition-all duration-300"
            >
              Explore Menu
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className={`flex-1 relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl transition-all duration-1500 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="relative animate-float">
            {/* Radial glow behind image */}
            <div className="absolute inset-0 radial-glow scale-150" />

            {/* Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <img
                src="/images/hero-dish.jpg"
                alt="Signature Royal Biryani"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/60 via-transparent to-transparent" />
            </div>

            {/* Steam effect */}
            <SteamEffect />

            {/* Floating spice accent - hidden on small mobile */}
            <div className="hidden sm:flex absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-gradient-to-br from-gold-500/20 to-burnt-orange/20 blur-sm animate-float-delayed items-center justify-center">
              <span className="text-xl sm:text-3xl">🪷</span>
            </div>
            <div className="hidden sm:flex absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-br from-gold-500/10 to-transparent blur-sm animate-float-slow items-center justify-center">
              <span className="text-lg sm:text-2xl">✦</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.2em] text-cream-300/40 uppercase">Scroll</span>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-gold-500/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </section>
  );
}

// ─── Signature Dishes ───
const dishes = [
  {
    name: 'Murgh Makhani',
    subtitle: 'Butter Chicken',
    description: 'Tandoori chicken simmered in velvety tomato-cream sauce with aromatic fenugreek',
    image: '/images/dish-butter-chicken.jpg',
    tag: 'Signature',
  },
  {
    name: 'Dum Biryani',
    subtitle: 'Hyderabadi Royal',
    description: 'Slow-cooked basmati rice layered with tender lamb and century-old spice blend',
    image: '/images/dish-biryani.jpg',
    tag: 'Heritage',
  },
  {
    name: 'Rogan Josh',
    subtitle: 'Kashmiri Delicacy',
    description: 'Slow-braised lamb in a rich Kashmiri chili and yogurt sauce with saffron threads',
    image: '/images/dish-lamb.jpg',
    tag: "Chef's Pick",
  },
  {
    name: 'Paneer Tikka',
    subtitle: 'Smoked Cottage Cheese',
    description: 'Charred paneer marinated in hung curd and spices, finished with edible gold leaf',
    image: '/images/dish-paneer.jpg',
    tag: 'Vegetarian',
  },
];

function DishCard({ dish, index }: { dish: typeof dishes[0]; index: number }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="card-glow group relative rounded-2xl overflow-hidden bg-maroon-900/50 border border-gold-500/10">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/30 to-transparent" />

          {/* Tag */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full glass text-gold-400 text-[10px] sm:text-xs tracking-wider uppercase font-sans">
            {dish.tag}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 relative">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <div>
              <h3 className="font-serif text-base sm:text-xl text-ivory group-hover:text-gold-300 transition-colors duration-300">
                {dish.name}
              </h3>
              <span className="font-sans text-[10px] sm:text-xs tracking-wider text-gold-500/60 uppercase">
                {dish.subtitle}
              </span>
            </div>
            <span className="text-gold-500/40 text-sm sm:text-lg">✦</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-cream-300/40 leading-relaxed mt-2 sm:mt-3">
            {dish.description}
          </p>
        </div>

        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-2xl border border-gold-500/0 group-hover:border-gold-500/20 transition-all duration-500 pointer-events-none" />
      </div>
    </div>
  );
}

function SignatureDishes() {
  const { ref, visible } = useReveal();

  return (
    <section id="dishes" className="relative py-16 sm:py-20 lg:py-32 bg-maroon-950 scroll-mt-14 sm:scroll-mt-16">
      <div className="absolute inset-0 radial-glow opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal text-center mb-10 sm:mb-16 ${visible ? 'visible' : ''}`}
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-gold-500/60 uppercase">Curated Selection</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mt-3 sm:mt-4 mb-4 sm:mb-6">
            Signature <span className="text-gradient-gold italic">Creations</span>
          </h2>
          <div className="ornament-divider">
            <span className="text-gold-500/40 text-sm">❈</span>
          </div>
          <p className="font-sans text-cream-300/40 max-w-lg mx-auto mt-4 sm:mt-6 text-sm sm:text-base px-2">
            Each dish is a masterpiece, meticulously crafted with rare spices sourced from India's finest markets and prepared with techniques passed down through generations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {dishes.map((dish, i) => (
            <DishCard key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Heritage Section ───
function HeritageSection() {
  const { ref, visible } = useReveal();

  return (
    <section id="heritage" className="relative py-16 sm:py-20 lg:py-32 overflow-hidden scroll-mt-14 sm:scroll-mt-16">
      {/* Cream / parchment background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200" />

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b2525'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal text-center ${visible ? 'visible' : ''}`}
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-burnt-orange/70 uppercase">Our Heritage</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-maroon-900 mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
            A Legacy Woven
            <br />
            in <span className="text-burnt-orange italic">Spice & Soul</span>
          </h2>
          <div className="ornament-divider mb-6 sm:mb-10">
            <span className="text-gold-500/60 text-sm">❈</span>
          </div>
          <p className="font-sans text-maroon-800/60 leading-relaxed mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base px-1">
            Born in the royal kitchens of Lucknow in 1998, Zaika was founded on a singular belief: that Indian cuisine, when treated with reverence and artistry, transcends the ordinary to become something truly extraordinary.
          </p>
          <p className="font-sans text-maroon-800/60 leading-relaxed mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-1">
            Our master chefs source saffron from Kashmir, cardamom from the Western Ghats, and black pepper from Kerala's ancient plantations. Each spice tells a story of the land it came from, and every dish is a love letter to India's boundless culinary heritage.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-6 sm:gap-8 lg:gap-16">
            {[
              { number: '26', label: 'Years of Legacy' },
              { number: '50+', label: 'Spice Blends' },
              { number: '12', label: 'Royal Recipes' },
              { number: '3', label: 'Michelin Stars' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-burnt-orange block">{stat.number}</span>
                <span className="block font-sans text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.15em] text-maroon-800/40 uppercase mt-1.5 sm:mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Chef Special Section ───
function ChefSpecial() {
  const { ref, visible } = useReveal();

  return (
    <section id="chef-special" className="relative py-16 sm:py-20 lg:py-32 bg-maroon-950 overflow-hidden scroll-mt-14 sm:scroll-mt-16">
      {/* Dramatic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-950 via-maroon-900/50 to-maroon-950" />
      <div className="absolute inset-0 radial-glow-warm opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal text-center mb-10 sm:mb-16 ${visible ? 'visible' : ''}`}
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-gold-500/60 uppercase">Exclusive</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mt-3 sm:mt-4 mb-3 sm:mb-4">
            Chef's <span className="text-gradient-gold italic">Masterpiece</span>
          </h2>
          <div className="ornament-divider">
            <span className="text-gold-500/40 text-sm">❈</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          {/* Chef Image with spotlight */}
          <div className="w-full lg:flex-1 relative max-w-md lg:max-w-none mx-auto">
            <div className="relative">
              {/* Spotlight effect */}
              <div className="absolute -inset-10 bg-gradient-radial from-gold-500/10 via-transparent to-transparent rounded-full blur-2xl" />

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                <img
                  src="/images/chef-special.jpg"
                  alt="Chef's Special Dish"
                  className="w-full aspect-[4/3] sm:aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-950/20 to-transparent" />

                {/* Overlay text on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-gold-400/70 uppercase">This Season</span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory mt-1.5 sm:mt-2">Dal Maharani</h3>
                  <p className="font-sans text-xs sm:text-sm text-cream-300/50 mt-1.5 sm:mt-2">
                    Black lentils slow-cooked for 24 hours with tomato makhani gravy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:flex-1 space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory mb-3 sm:mb-4">
                A Symphony of <span className="text-gold-400">Flavors</span>
              </h3>
              <p className="font-sans text-cream-300/50 leading-relaxed text-sm sm:text-base">
                Our Executive Chef Priya Mehta's seasonal masterpiece features the finest black lentils, slow-cooked overnight in copper pots, finished with a tempering of aged ghee and hand-picked fenugreek leaves from the foothills of the Himalayas.
              </p>
            </div>

            {/* Ingredients list */}
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: 'Kashmiri Saffron', origin: 'Srinagar Valley' },
                { name: 'Aged Desi Ghee', origin: 'Punjab Grasslands' },
                { name: 'Black Lentils', origin: 'Madhya Pradesh' },
                { name: 'Himalayan Fenugreek', origin: 'Uttarakhand' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gold-500/10 group">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold-500/40 group-hover:bg-gold-500 transition-colors duration-300" />
                    <span className="font-serif text-sm sm:text-base text-ivory/80">{item.name}</span>
                  </div>
                  <span className="font-sans text-[10px] sm:text-xs tracking-wider text-cream-300/30 uppercase">{item.origin}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => smoothScrollTo('reservation')}
              className="w-full sm:w-auto btn-glow px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gold-500 to-burnt-orange text-maroon-950 font-semibold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full"
            >
              Experience This Dish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───
const testimonials = [
  {
    name: 'Arjun Kapoor',
    title: 'Food Critic, The Times',
    text: 'Zaika is not merely a restaurant — it is a pilgrimage. Every bite carries the weight of centuries, every spice speaks a language older than words. A truly transcendent experience.',
    rating: 5,
  },
  {
    name: 'Isabella Moretti',
    title: 'Michelin Guide Inspector',
    text: 'In twenty years of evaluating restaurants across four continents, I have never encountered Indian cuisine elevated to such heights. The Dum Biryani alone justifies a journey to Mumbai.',
    rating: 5,
  },
  {
    name: 'Vikram Singh Rathore',
    title: 'Maharaja of Jodhpur',
    text: 'My family has hosted banquets for centuries, yet Zaika manages to surprise us with every visit. They understand that royal cuisine is not about excess — it is about refinement.',
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="card-glow h-full p-5 sm:p-8 rounded-2xl glass-light text-center">
        <span className="font-serif text-4xl sm:text-5xl text-gold-500/20 leading-none block mb-3 sm:mb-4">"</span>
        <p className="font-sans text-xs sm:text-sm text-cream-300/60 leading-relaxed mb-5 sm:mb-8 italic">
          {testimonial.text}
        </p>
        <div className="flex justify-center gap-1 mb-3 sm:mb-4">
          {[...Array(testimonial.rating)].map((_, j) => (
            <span key={j} className="text-gold-500 text-xs sm:text-sm">★</span>
          ))}
        </div>
        <div className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto mb-3 sm:mb-4" />
        <h4 className="font-serif text-base sm:text-lg text-ivory">{testimonial.name}</h4>
        <span className="font-sans text-[10px] sm:text-xs tracking-wider text-gold-500/50 uppercase">{testimonial.title}</span>
      </div>
    </div>
  );
}

function Testimonials() {
  const { ref, visible } = useReveal();

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 lg:py-32 overflow-hidden scroll-mt-14 sm:scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-950 via-maroon-900/40 to-maroon-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal text-center mb-10 sm:mb-16 ${visible ? 'visible' : ''}`}
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-gold-500/60 uppercase">Testimonials</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mt-3 sm:mt-4 mb-3 sm:mb-4">
            Voices of <span className="text-gradient-gold italic">Admiration</span>
          </h2>
          <div className="ornament-divider">
            <span className="text-gold-500/40 text-sm">❈</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reservation CTA ───
function ReservationCTA() {
  const { ref, visible } = useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="reservation" className="relative py-16 sm:py-20 lg:py-32 overflow-hidden scroll-mt-14 sm:scroll-mt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/restaurant-interior.jpg"
          alt="Restaurant Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/95 via-maroon-950/85 to-maroon-950/95" />
      </div>

      <div
        ref={ref}
        className={`reveal relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center ${visible ? 'visible' : ''}`}
      >
        <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-gold-500/60 uppercase">Begin Your Journey</span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight">
          Reserve Your
          <br />
          <span className="text-gradient-gold italic">Royal Feast</span>
        </h2>
        <div className="ornament-divider mb-6 sm:mb-8">
          <span className="text-gold-500/40 text-sm">❈</span>
        </div>
        <p className="font-sans text-cream-300/50 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-12 text-sm sm:text-base px-2">
          Let us craft an unforgettable evening of culinary excellence. Whether an intimate dinner for two or a grand celebration, every moment at Zaika is designed to be extraordinary.
        </p>

        {/* Success message */}
        <div className={`glass rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto transition-all duration-500 ${submitted ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute pointer-events-none'}`} style={{ left: 0, right: 0 }}>
          <span className="text-4xl sm:text-5xl block mb-4">✦</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-gold-400 mb-3">Reservation Confirmed</h3>
          <p className="font-sans text-sm sm:text-base text-cream-300/60 leading-relaxed">
            Thank you for choosing Zaika. Our concierge will reach out shortly to finalize the details of your royal dining experience.
          </p>
        </div>

        <div className={`glass rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto transition-all duration-500 ${submitted ? 'opacity-0 scale-95 absolute pointer-events-none' : 'opacity-100 scale-100'}`} style={{ left: 0, right: 0 }}>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3.5 sm:px-4 py-3 rounded-xl bg-maroon-950/60 border border-gold-500/15 text-ivory font-sans text-sm placeholder:text-cream-300/30 focus:outline-none focus:border-gold-500/40 transition-colors duration-300"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-3.5 sm:px-4 py-3 rounded-xl bg-maroon-950/60 border border-gold-500/15 text-ivory font-sans text-sm placeholder:text-cream-300/30 focus:outline-none focus:border-gold-500/40 transition-colors duration-300"
            />
            <input
              type="date"
              className="w-full px-3.5 sm:px-4 py-3 rounded-xl bg-maroon-950/60 border border-gold-500/15 text-ivory font-sans text-sm focus:outline-none focus:border-gold-500/40 transition-colors duration-300"
            />
            <select className="w-full px-3.5 sm:px-4 py-3 rounded-xl bg-maroon-950/60 border border-gold-500/15 text-ivory font-sans text-sm focus:outline-none focus:border-gold-500/40 transition-colors duration-300">
              <option value="" className="bg-maroon-950">Number of Guests</option>
              {[1,2,3,4,5,6,7,8,10,12].map(n => (
                <option key={n} value={n} className="bg-maroon-950">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
            <textarea
              placeholder="Special Requests"
              rows={3}
              className="sm:col-span-2 w-full px-3.5 sm:px-4 py-3 rounded-xl bg-maroon-950/60 border border-gold-500/15 text-ivory font-sans text-sm placeholder:text-cream-300/30 focus:outline-none focus:border-gold-500/40 transition-colors duration-300 resize-none"
            />
            <button
              type="submit"
              className="sm:col-span-2 btn-glow px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gold-500 to-burnt-orange text-maroon-950 font-semibold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full animate-glow-pulse"
            >
              Confirm Reservation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="relative bg-maroon-950 pt-12 sm:pt-20 pb-8 sm:pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 to-maroon-900/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gold-500/40 flex items-center justify-center">
                <span className="font-serif text-gold-500 text-sm sm:text-lg font-bold">Z</span>
              </div>
              <span className="font-serif text-xl sm:text-2xl tracking-[0.15em] sm:tracking-[0.2em] text-ivory font-semibold">ZAIKA</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-cream-300/40 leading-relaxed">
              Where spice meets sovereignty. A luxury Indian dining experience since 1998.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-gold-500/60 uppercase mb-3 sm:mb-4">Navigate</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { label: 'Our Story', target: 'heritage' },
                { label: 'Menu', target: 'dishes' },
                { label: "Chef's Choice", target: 'chef-special' },
                { label: 'Reviews', target: 'testimonials' },
                { label: 'Reservations', target: 'reservation' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => smoothScrollTo(item.target)}
                    className="font-sans text-xs sm:text-sm text-cream-300/40 hover:text-gold-400 transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-gold-500/60 uppercase mb-3 sm:mb-4">Hours</h4>
            <ul className="space-y-1.5 sm:space-y-2 font-sans text-xs sm:text-sm text-cream-300/40">
              <li className="flex justify-between gap-2">
                <span>Lunch</span>
                <span className="text-cream-300/30">12:00 – 15:00</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Dinner</span>
                <span className="text-cream-300/30">19:00 – 23:30</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Bar</span>
                <span className="text-cream-300/30">18:00 – 00:00</span>
              </li>
              <li className="mt-2 sm:mt-3 text-cream-300/30 text-[10px] sm:text-xs">
                Closed on Mondays
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-serif text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-gold-500/60 uppercase mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-1.5 sm:space-y-2 font-sans text-xs sm:text-sm text-cream-300/40">
              <li>+91 22 2345 6789</li>
              <li>reservations@zaika.in</li>
              <li className="pt-1.5 sm:pt-2">
                Club Aquaria, Devidas Lane<br />
                Shanti Ashram Rd, Borivali West<br />
                Mumbai, Maharashtra 400103<br />
                India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-6 sm:mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="font-sans text-[10px] sm:text-xs text-cream-300/30">
            © 2024 Zaika Luxury Indian Dining. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
              <span
                key={social}
                role="button"
                tabIndex={0}
                className="font-sans text-[10px] sm:text-xs text-cream-300/30 hover:text-gold-400 transition-colors duration-300 cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ───
export default function App() {
  return (
    <div className="min-h-screen bg-maroon-950 text-ivory font-sans antialiased">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      <Navbar />
      <HeroSection />
      <SignatureDishes />
      <HeritageSection />
      <ChefSpecial />
      <Testimonials />
      <ReservationCTA />
      <Footer />
    </div>
  );
}
