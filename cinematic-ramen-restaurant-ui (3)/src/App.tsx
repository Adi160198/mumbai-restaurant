import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ============ SECTION WRAPPER WITH SCROLL ANIMATION ============
function AnimatedSection({ children, className = '', id = '', style }: { children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
}

// ============ FLOATING INGREDIENT SVGs ============
function FloatingIngredients() {
  const ingredients = [
    { emoji: '🥚', x: '8%', y: '15%', delay: 0, size: 28, duration: 7 },
    { emoji: '🎋', x: '85%', y: '20%', delay: 1.2, size: 24, duration: 8 },
    { emoji: '🌿', x: '12%', y: '65%', delay: 2.5, size: 22, duration: 6 },
    { emoji: '🧄', x: '90%', y: '55%', delay: 0.8, size: 20, duration: 9 },
    { emoji: '🍜', x: '5%', y: '40%', delay: 1.8, size: 26, duration: 7.5 },
    { emoji: '🫚', x: '92%', y: '75%', delay: 3, size: 18, duration: 8.5 },
    { emoji: '🧅', x: '15%', y: '80%', delay: 0.5, size: 22, duration: 6.5 },
    { emoji: '🌶️', x: '88%', y: '38%', delay: 2, size: 20, duration: 7.2 },
  ];

  return (
    <>
      {ingredients.map((ing, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none hidden sm:block"
          style={{ left: ing.x, top: ing.y, fontSize: ing.size, opacity: 0.5 }}
          animate={{
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: ing.duration,
            repeat: Infinity,
            delay: ing.delay,
            ease: 'easeInOut',
          }}
        >
          {ing.emoji}
        </motion.div>
      ))}
    </>
  );
}

// ============ STEAM EFFECT ============
function SteamEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`steam-particle steam-${i + 1}`}
          style={{
            left: `${25 + Math.random() * 50}%`,
            bottom: '0',
          }}
        />
      ))}
    </div>
  );
}

// ============ PARTICLES ============
function Particles() {
  const [vh, setVh] = useState(1000);
  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 8 : 18;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    size: isMobile ? 2 + Math.random() * 2 : 2 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.3,
    drift: (Math.random() - 0.5) * 80,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -vh * 1.2],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

// ============ NAVBAR ============
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileOpen(false);
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Find first input inside the form to focus and highlight it beautifully
      setTimeout(() => {
        const nameInput = reservationSection.querySelector('input[type="text"]') as HTMLInputElement;
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
          // Visual indicator by temporarily adding outline glow class
          nameInput.classList.add('ring-4', 'ring-[var(--color-ramen-red)]/50');
          setTimeout(() => {
            nameInput.classList.remove('ring-4', 'ring-[var(--color-ramen-red)]/50');
          }, 1200);
        }
      }, 800);
    }
  };

  const links = [
    { label: 'Home', href: '#hero' },
    { label: 'Menu', href: '#menu' },
    { label: 'Our Craft', href: '#craft' },
    { label: "Chef's Special", href: '#chef' },
    { label: 'Reserve', href: '#reservation' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`fixed top-3 md:top-4 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:right-auto z-50 px-4 sm:px-6 py-3 rounded-2xl md:rounded-full transition-all duration-500 max-w-5xl md:max-w-none ${
          scrolled || mobileOpen
            ? 'navbar-scrolled'
            : 'bg-black/20 backdrop-blur-md border border-white/10'
        }`}
      >
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <a href="#hero" className="font-[family-name:var(--font-family-jp)] text-white text-lg sm:text-xl font-bold tracking-wider shrink-0">
            麺匠
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/70 hover:text-[var(--color-gold)] text-sm tracking-wider uppercase transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <motion.a
            href="#reservation"
            onClick={handleBookClick}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(122, 13, 13, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="hidden lg:inline-flex items-center justify-center bg-gradient-to-r from-[var(--color-ramen-red)] to-[var(--color-ramen-dark)] text-white border border-[var(--color-gold)]/50 px-6 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-semibold shadow-[0_4px_15px_rgba(122,13,13,0.3)] relative overflow-hidden group"
          >
            {/* Background shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Text with gold accent bullet */}
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
              Book a Table
            </span>
          </motion.a>

          {/* Mobile / Tablet menu button */}
          <button
            className="lg:hidden text-white p-1 shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4"
            >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-white/70 hover:text-[var(--color-gold)] text-base tracking-wider uppercase transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#reservation"
                onClick={handleBookClick}
                className="block mt-3 bg-gradient-to-r from-[var(--color-ramen-red)] to-[var(--color-ramen-dark)] text-white border border-[var(--color-gold)]/40 px-5 py-3 rounded-full text-sm tracking-wider uppercase font-medium text-center shadow-[0_4px_15px_rgba(122,13,13,0.3)] active:scale-[0.97] transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                  Book a Table
                </span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(135deg, #1a0505 0%, #2d0808 30%, #4a0d0d 50%, #2d0808 70%, #0a0505 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[800px] aspect-square rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(122, 13, 13, 0.3) 0%, rgba(122, 13, 13, 0.1) 40%, transparent 70%)',
            animation: 'ambientGlow 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] sm:w-[400px] aspect-square rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 83, 0.1) 0%, transparent 60%)',
            animation: 'ambientGlow 8s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <Particles />
      </div>

      {/* Floating ingredients */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIngredients />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center pt-20 sm:pt-24 pb-8"
      >
        {/* Left - Text */}
        <div className="text-center lg:text-left order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-[var(--color-gold)] text-[10px] sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-light">
              東京の味 — Taste of Tokyo
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="font-[family-name:var(--font-family-display)] text-[2.8rem] sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-4 sm:mb-6"
          >
            The Art
            <br />
            of <span className="text-shimmer">Ramen</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-white/60 text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed font-light px-2 sm:px-0"
          >
            36-hour simmered tonkotsu broth, hand-pulled noodles, and a tradition 
            that spans generations. Experience ramen as it was meant to be.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <a
              href="#menu"
              className="btn-primary bg-[var(--color-ramen-red)] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium inline-block text-center"
              style={{ boxShadow: '0 0 30px rgba(122, 13, 13, 0.4)' }}
            >
              Explore Menu
            </a>
            <a
              href="#reservation"
              className="border border-[var(--color-gold)]/40 text-[var(--color-gold)] px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium hover:bg-[var(--color-gold)]/10 transition-all duration-300 inline-block text-center"
            >
              Reserve a Table
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.4 }}
            className="mt-8 sm:mt-12 flex gap-6 sm:gap-8 justify-center lg:justify-start"
          >
            {[
              { num: '36', label: 'Hour Broth' },
              { num: '12', label: 'Years of Craft' },
              { num: '98', label: 'Perfect Reviews' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[var(--color-gold)] font-[family-name:var(--font-family-display)] text-xl sm:text-2xl md:text-3xl font-bold">{stat.num}</div>
                <div className="text-white/40 text-[10px] sm:text-xs tracking-wider uppercase mt-0.5 sm:mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right - Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex justify-center lg:justify-end order-2"
        >
          {/* Glow behind bowl */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(196, 116, 46, 0.25) 0%, rgba(122, 13, 13, 0.15) 40%, transparent 70%)',
              filter: 'blur(30px) sm:blur(40px)',
              animation: 'ambientGlow 5s ease-in-out infinite',
            }}
          />

          {/* Main bowl image */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[550px]">
            <img
              src="/images/hero-ramen.jpg"
              alt="Premium Tonkotsu Ramen"
              className="w-full h-auto rounded-2xl sm:rounded-3xl object-cover"
              style={{
                filter: 'brightness(1.05) contrast(1.1) saturate(1.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(122, 13, 13, 0.2)',
              }}
            />
            {/* Steam on top of bowl */}
            <SteamEffect className="top-0 left-0 w-full h-[120px] sm:h-[200px]" />
          </div>

          {/* Chopsticks overlay */}
          <motion.div
            initial={{ x: -200, rotate: -15, opacity: 0 }}
            animate={{ x: 0, rotate: -8, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-[10%] left-[-5%] sm:left-[-10%] pointer-events-none"
          >
            <svg width="120" height="20" viewBox="0 0 200 20" className="opacity-70 sm:w-[200px]">
              <defs>
                <linearGradient id="chopstick1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B6914" />
                  <stop offset="50%" stopColor="#A0782C" />
                  <stop offset="100%" stopColor="#6B4F0A" />
                </linearGradient>
              </defs>
              <rect x="0" y="4" width="200" height="5" rx="2.5" fill="url(#chopstick1)" />
              <rect x="0" y="12" width="200" height="5" rx="2.5" fill="url(#chopstick1)" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============ SIGNATURE DISHES SECTION ============
function SignatureDishes() {
  const dishes = [
    {
      name: 'Tonkotsu',
      japanese: '豚骨',
      desc: 'Rich pork bone broth, 36-hour simmer',
      price: '¥1,480',
      img: '/images/tonkotsu-ramen.jpg',
    },
    {
      name: 'Miso',
      japanese: '味噌',
      desc: 'Fermented soybean, Hokkaido style',
      price: '¥1,380',
      img: '/images/miso-ramen.jpg',
    },
    {
      name: 'Shoyu',
      japanese: '醤油',
      desc: 'Classic soy sauce, Tokyo tradition',
      price: '¥1,280',
      img: '/images/shoyu-ramen.jpg',
    },
  ];

  return (
    <AnimatedSection
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0505 0%, var(--color-cream) 3%, var(--color-cream) 97%, #0a0505 100%)' }}
      id="signature"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <p className="text-[var(--color-ramen-red)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
            — Signature Collection —
          </p>
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-ramen-dark)]">
            Our Masterpieces
          </h2>
          <div className="mt-3 sm:mt-4 divider-kanji text-[var(--color-ramen-red)] font-[family-name:var(--font-family-jp)] text-base sm:text-lg">
            看板
          </div>
        </div>

        {/* Dish circles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-8">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="dish-circle relative group cursor-pointer mb-4 sm:mb-6">
                {/* Glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 50px rgba(122, 13, 13, 0.3), 0 0 100px rgba(122, 13, 13, 0.15)' }}
                />
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-[var(--color-ramen-red)]/20 group-hover:border-[var(--color-ramen-red)]/50 transition-colors duration-500"
                  style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.12)' }}
                >
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="dish-circle-img w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="font-[family-name:var(--font-family-display)] text-xl sm:text-2xl font-bold text-[var(--color-ramen-dark)] mb-1">
                {dish.name}
              </h3>
              <p className="font-[family-name:var(--font-family-jp)] text-[var(--color-gold)] text-xs sm:text-sm mb-1.5 sm:mb-2">
                {dish.japanese}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm text-center max-w-[220px] mb-2 sm:mb-3 font-light">
                {dish.desc}
              </p>
              <p className="text-[var(--color-ramen-red)] font-[family-name:var(--font-family-display)] text-lg sm:text-xl font-bold">
                {dish.price}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ============ FULL MENU SECTION ============
function MenuSection() {
  const categories = ['All', 'Ramen', 'Sides', 'Drinks'];
  const [active, setActive] = useState('All');

  const menuItems = [
    { name: 'Tonkotsu Ramen', japanese: '豚骨ラーメン', price: '¥1,480', category: 'Ramen', desc: 'Rich pork bone broth, chashu, egg, nori', img: '/images/tonkotsu-ramen.jpg' },
    { name: 'Miso Ramen', japanese: '味噌ラーメン', price: '¥1,380', category: 'Ramen', desc: 'Hokkaido miso, corn, butter, ground pork', img: '/images/miso-ramen.jpg' },
    { name: 'Shoyu Ramen', japanese: '醤油ラーメン', price: '¥1,280', category: 'Ramen', desc: 'Clear soy broth, menma, naruto, chashu', img: '/images/shoyu-ramen.jpg' },
    { name: 'Spicy Tantanmen', japanese: '担々麺', price: '¥1,580', category: 'Ramen', desc: 'Sesame chili broth, minced pork, bok choy', img: '/images/spicy-ramen.jpg' },
    { name: 'Black Garlic Ramen', japanese: '黒にんにく', price: '¥1,680', category: 'Ramen', desc: 'Garlic oil, truffle, premium chashu', img: '/images/chef-special.jpg' },
    { name: 'Gyoza (6pc)', japanese: '餃子', price: '¥680', category: 'Sides', desc: 'Pan-fried pork dumplings, crispy bottom', img: 'https://images.pexels.com/photos/36360462/pexels-photo-36360462.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Chashu Rice Bowl', japanese: 'チャーシュー丼', price: '¥780', category: 'Sides', desc: 'Braised pork belly over steamed rice', img: '/images/chashu-rice-bowl.jpg' },
    { name: 'Matcha Latte', japanese: '抹茶ラテ', price: '¥480', category: 'Drinks', desc: 'Ceremonial grade Uji matcha', img: '/images/matcha-latte.jpg' },
    { name: 'Craft Beer', japanese: 'クラフトビール', price: '¥680', category: 'Drinks', desc: 'Hitachino Nest White Ale', img: 'https://images.pexels.com/photos/5538254/pexels-photo-5538254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  ];

  const filtered = active === 'All' ? menuItems : menuItems.filter((item) => item.category === active);

  return (
    <AnimatedSection
      id="menu"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0505 0%, #1a0808 10%, #1a0808 90%, #0a0505 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[var(--color-gold)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
            — Our Menu —
          </p>
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
            Full Menu
          </h2>
          <div className="mt-3 sm:mt-4 divider-kanji text-[var(--color-gold)]/60 font-[family-name:var(--font-family-jp)] text-base sm:text-lg">
            メニュー
          </div>
        </div>

        {/* Category filters */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 ${
                active === cat
                  ? 'bg-[var(--color-ramen-red)] text-white shadow-lg shadow-[var(--color-ramen-red)]/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="menu-card bg-white/5 rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[var(--color-ramen-red)] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wider">
                    {item.category}
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="min-w-0 mr-2">
                      <h3 className="text-white font-[family-name:var(--font-family-display)] text-base sm:text-lg font-bold truncate">{item.name}</h3>
                      <p className="font-[family-name:var(--font-family-jp)] text-[var(--color-gold)]/60 text-[10px] sm:text-xs mt-0.5">{item.japanese}</p>
                    </div>
                    <span className="text-[var(--color-gold)] font-[family-name:var(--font-family-display)] text-base sm:text-lg font-bold shrink-0">{item.price}</span>
                  </div>
                  <p className="text-white/40 text-xs sm:text-sm font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// ============ OUR CRAFT SECTION ============
function CraftSection() {
  const crafts = [
    {
      icon: '🔥',
      title: '36-Hour Broth',
      japanese: '長時間煮込み',
      desc: 'Our tonkotsu broth simmers for 36 hours, extracting deep collagen-rich flavors that create our signature creamy texture.',
    },
    {
      icon: '🍜',
      title: 'Hand-Pulled Noodles',
      japanese: '手作り麺',
      desc: 'Every strand is crafted daily using premium Japanese wheat flour, achieving the perfect balance of chewiness and slip.',
    },
    {
      icon: '🥩',
      title: 'Premium Chashu',
      japanese: 'チャーシュー',
      desc: 'Slow-braised Kurobuta pork belly, marinated in our secret soy blend for 24 hours until meltingly tender.',
    },
    {
      icon: '🥚',
      title: 'Ajitama Egg',
      japanese: '味玉',
      desc: 'Precisely cooked at 63.5°C for exactly 6 minutes and 30 seconds, then marinated in our house-made tare.',
    },
  ];

  return (
    <AnimatedSection
      id="craft"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden japanese-pattern"
      style={{ background: 'linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <img
                src="/images/ingredients.jpg"
                alt="Premium Ingredients"
                className="w-full h-[280px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ramen-dark)]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <p className="font-[family-name:var(--font-family-jp)] text-white/60 text-xs sm:text-sm">匠の技</p>
                <p className="text-white font-[family-name:var(--font-family-display)] text-lg sm:text-2xl font-bold mt-1">The Art of Craftsmanship</p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 rounded-full border-2 border-[var(--color-ramen-red)]/20" />
            <div className="absolute -top-4 -left-4 w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-[var(--color-gold)]/20" />
          </motion.div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <p className="text-[var(--color-ramen-red)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
              — Our Philosophy —
            </p>
            <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-ramen-dark)] mb-3 sm:mb-4">
              Crafted with<br />
              <span className="text-[var(--color-ramen-red)]">Devotion</span>
            </h2>
            <div className="divider-kanji text-[var(--color-ramen-red)]/50 font-[family-name:var(--font-family-jp)] text-sm sm:text-base mb-6 sm:mb-8 text-left">
              職人気質
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base font-light">
              Every bowl of ramen at Men-shō is a meditation on patience, precision, and passion. 
              We believe that extraordinary ramen begins with extraordinary ingredients and an unwavering 
              commitment to traditional techniques passed down through generations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {crafts.map((craft, i) => (
                <motion.div
                  key={craft.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group"
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{craft.icon}</div>
                  <h3 className="font-[family-name:var(--font-family-display)] text-sm sm:text-base font-bold text-[var(--color-ramen-dark)] mb-1">
                    {craft.title}
                  </h3>
                  <p className="font-[family-name:var(--font-family-jp)] text-[var(--color-gold)] text-[10px] sm:text-xs mb-1.5 sm:mb-2">{craft.japanese}</p>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">{craft.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ============ CHEF SPECIAL SECTION ============
function ChefSpecial() {
  return (
    <AnimatedSection
      id="chef"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0505 0%, #1a0808 30%, #2d0a0a 50%, #1a0808 70%, #0a0505 100%)',
      }}
    >
      {/* Radial light */}
      <div className="absolute inset-0 radial-light" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-center">
          {/* Left content - 2 cols */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[var(--color-gold)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
                — Chef's Selection —
              </p>
              <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-1 sm:mb-2">
                Black Garlic
                <br />
                <span className="text-shimmer">Truffle Ramen</span>
              </h2>
              <p className="font-[family-name:var(--font-family-jp)] text-[var(--color-gold)]/50 text-base sm:text-lg mb-4 sm:mb-6">
                黒にんにくトリュフ
              </p>
              <div className="w-12 sm:w-16 h-0.5 bg-[var(--color-ramen-red)] mb-4 sm:mb-6" />
              <p className="text-white/50 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base font-light">
                Our chef's masterpiece — a bold fusion of traditional tonkotsu and modern luxury. 
                Charred black garlic oil meets aromatic truffle, crowned with 48-hour braised 
                Kurobuta pork belly and a delicate gold leaf garnish.
              </p>

              {/* Ingredients list */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {['Black Garlic Mayu', 'Truffle Oil Infusion', 'Kurobuta Chashu', 'Gold Leaf Finish', '63.5° Ajitama'].map((ing) => (
                  <div key={ing} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0" />
                    <span className="text-white/60 text-xs sm:text-sm font-light">{ing}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
                <span className="text-[var(--color-gold)] font-[family-name:var(--font-family-display)] text-2xl sm:text-3xl font-bold">¥1,980</span>
                <span className="text-white/30 text-xs sm:text-sm line-through mb-1">¥2,480</span>
                <span className="bg-[var(--color-ramen-red)] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full mb-1">Chef's Pick</span>
              </div>

              <a
                href="#reservation"
                className="btn-primary inline-block bg-[var(--color-ramen-red)] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium"
                style={{ boxShadow: '0 0 30px rgba(122, 13, 13, 0.4)' }}
              >
                Reserve to Try
              </a>
            </motion.div>
          </div>

          {/* Right image - 3 cols */}
          <div className="lg:col-span-3 relative order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Dramatic spotlight */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] sm:w-[300px] aspect-square rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 168, 83, 0.15) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(122, 13, 13, 0.2)' }}>
                <img
                  src="/images/chef-special.jpg"
                  alt="Chef's Special Black Garlic Truffle Ramen"
                  className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[520px] object-cover"
                  style={{ filter: 'brightness(0.95) contrast(1.1) saturate(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating garnish */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 sm:top-8 right-4 sm:right-8 text-2xl sm:text-4xl opacity-60 pointer-events-none"
              >
                🍃
              </motion.div>
              <motion.div
                animate={{ y: [-8, 12, -8], rotate: [5, -5, 5] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 text-xl sm:text-3xl opacity-50 pointer-events-none"
              >
                ✨
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ============ TESTIMONIALS SECTION ============
function Testimonials() {
  const testimonials = [
    {
      name: 'Yuki Tanaka',
      role: 'Food Critic, Tokyo',
      text: "Men-shō has redefined what ramen can be. The 36-hour tonkotsu is a revelation — each spoonful carries the weight of tradition and the spark of innovation.",
      rating: 5,
    },
    {
      name: 'Sarah Chen',
      role: 'Michelin Guide Reviewer',
      text: "In all my years reviewing restaurants, I've never encountered such devotion to a single craft. The black garlic truffle ramen is nothing short of extraordinary.",
      rating: 5,
    },
    {
      name: 'Kenji Matsuda',
      role: 'Master Ramen Chef',
      text: "As a fellow ramen craftsman, I am humbled by the precision and soul poured into every bowl at Men-shō. This is ramen at its absolute finest.",
      rating: 5,
    },
  ];

  return (
    <AnimatedSection
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-cream-dark) 0%, var(--color-cream) 50%, var(--color-cream-dark) 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[var(--color-ramen-red)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
            — Voices —
          </p>
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-ramen-dark)]">
            What They Say
          </h2>
          <div className="mt-3 sm:mt-4 divider-kanji text-[var(--color-ramen-red)]/50 font-[family-name:var(--font-family-jp)] text-base sm:text-lg">
            お声
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 relative group hover:shadow-xl transition-shadow duration-500"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              {/* Quote mark */}
              <div className="absolute top-3 sm:top-4 right-4 sm:right-6 font-[family-name:var(--font-family-display)] text-4xl sm:text-6xl text-[var(--color-ramen-red)]/10 leading-none">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <span key={si} className="text-[var(--color-gold)] text-sm sm:text-base">★</span>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-5 sm:mb-6 font-light text-xs sm:text-sm">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-ramen-red)]/10 flex items-center justify-center shrink-0">
                  <span className="text-[var(--color-ramen-red)] font-bold text-xs sm:text-sm">{t.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[var(--color-ramen-dark)] text-xs sm:text-sm truncate">{t.name}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ============ RESERVATION SECTION ============
function ReservationSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <AnimatedSection
      id="reservation"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a0808 0%, #2d0a0a 40%, #1a0808 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] aspect-square rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(122, 13, 13, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[var(--color-gold)] text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium">
            — Reserve Your Experience —
          </p>
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
            Book a Table
          </h2>
          <div className="mt-3 sm:mt-4 divider-kanji text-[var(--color-gold)]/50 font-[family-name:var(--font-family-jp)] text-base sm:text-lg">
            ご予約
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Locations */}
            <div className="space-y-5 sm:space-y-8 mb-8 sm:mb-10">
              {[
                {
                  name: 'Men-shō Ginza',
                  address: '4-5-6 Ginza, Chuo-ku, Tokyo',
                  hours: 'Mon-Sun: 11:00 - 23:00',
                  phone: '+81 3-1234-5678',
                },
                {
                  name: 'Men-shō Shibuya',
                  address: '1-2-3 Shibuya, Shibuya-ku, Tokyo',
                  hours: 'Mon-Sun: 11:00 - 24:00',
                  phone: '+81 3-9876-5432',
                },
                {
                  name: 'Men-shō Shinjuku',
                  address: '2-8-9 Shinjuku, Shinjuku-ku, Tokyo',
                  hours: 'Mon-Sun: 11:00 - 23:30',
                  phone: '+81 3-5555-1234',
                },
              ].map((loc) => (
                <div key={loc.name} className="border-l-2 border-[var(--color-ramen-red)]/40 pl-4 sm:pl-5">
                  <h3 className="text-white font-[family-name:var(--font-family-display)] text-base sm:text-lg font-bold mb-1">{loc.name}</h3>
                  <p className="text-white/40 text-xs sm:text-sm font-light">{loc.address}</p>
                  <p className="text-white/40 text-xs sm:text-sm font-light">{loc.hours}</p>
                  <p className="text-[var(--color-gold)]/60 text-xs sm:text-sm">{loc.phone}</p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative rounded-2xl overflow-hidden h-[160px] sm:h-[200px] bg-[var(--color-ramen-dark)]/30 border border-white/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-2">📍</div>
                  <p className="text-white/30 text-xs sm:text-sm">Tokyo, Japan</p>
                  <p className="text-white/20 text-[10px] sm:text-xs mt-1">Ginza • Shibuya • Shinjuku</p>
                </div>
              </div>
              {/* Stylized map grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-4 h-full">
                  {[...Array(32)].map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-white/10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-10 sm:py-12"
                  >
                    <div className="text-4xl sm:text-5xl mb-4">🍜</div>
                    <h3 className="text-white font-[family-name:var(--font-family-display)] text-xl sm:text-2xl font-bold mb-2">
                      ありがとうございます
                    </h3>
                    <p className="text-white/50 font-light text-sm sm:text-base">Your reservation has been received. We'll confirm shortly.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm placeholder-white/20"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm placeholder-white/20"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                      <div>
                        <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm [color-scheme:dark]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Time</label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm [color-scheme:dark]"
                          required
                        >
                          <option value="" className="bg-[#1a0808]">Select</option>
                          {['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
                            <option key={t} value={t} className="bg-[#1a0808]">{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Guests</label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm [color-scheme:dark]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n} className="bg-[#1a0808]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/50 text-[10px] sm:text-xs tracking-wider uppercase block mb-1.5 sm:mb-2">Special Requests</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="form-input w-full bg-white/5 text-white rounded-xl px-3 sm:px-4 py-3 text-sm placeholder-white/20 h-20 sm:h-24 resize-none"
                        placeholder="Allergies, celebrations, seating preferences..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full bg-[var(--color-ramen-red)] text-white py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium"
                      style={{ boxShadow: '0 0 30px rgba(122, 13, 13, 0.3)' }}
                    >
                      Confirm Reservation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer
      className="relative py-12 sm:py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0505 0%, #050202 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-[family-name:var(--font-family-jp)] text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">麺匠</h3>
            <p className="text-[var(--color-gold)]/60 text-xs sm:text-sm tracking-wider mb-3 sm:mb-4">Men-shō Ramen</p>
            <p className="text-white/30 text-xs sm:text-sm font-light leading-relaxed">
              Where tradition meets innovation. Every bowl tells a story of patience, precision, and passion.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">Navigate</h4>
            <div className="space-y-1.5 sm:space-y-2">
              {[
                { label: 'Home', href: '#hero' },
                { label: 'Menu', href: '#menu' },
                { label: 'Our Craft', href: '#craft' },
                { label: "Chef's Special", href: '#chef' },
                { label: 'Reserve', href: '#reservation' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-white/40 text-xs sm:text-sm hover:text-[var(--color-gold)] transition-colors duration-300 font-light"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">Hours</h4>
            <div className="space-y-1.5 sm:space-y-2 text-white/40 text-xs sm:text-sm font-light">
              <p>Lunch: 11:00 - 15:00</p>
              <p>Dinner: 17:00 - 23:00</p>
              <p>Weekend: 11:00 - 24:00</p>
              <p className="text-[var(--color-gold)]/60 mt-2 sm:mt-3">Open all holidays</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">Connect</h4>
            <div className="space-y-1.5 sm:space-y-2">
              {['Instagram', 'Twitter / X', 'Facebook', 'TikTok'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="block text-white/40 text-xs sm:text-sm hover:text-[var(--color-gold)] transition-colors duration-300 font-light"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/20 text-[10px] sm:text-xs font-light text-center sm:text-left">
            © 2024 Men-shō Ramen. All rights reserved. 麺匠ラーメン
          </p>
          <p className="text-white/10 text-[10px] sm:text-xs font-light">
            Crafted with 🍜 and devotion
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SignatureDishes />
      <MenuSection />
      <CraftSection />
      <ChefSpecial />
      <Testimonials />
      <ReservationSection />
      <Footer />
    </div>
  );
}
