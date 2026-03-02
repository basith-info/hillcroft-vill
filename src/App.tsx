import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Users,
  Home,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle2,
  ShieldCheck,
  Utensils,
  BedDouble,
  Bath,
  ChevronRight,
  Menu,
  X,
  Star
} from 'lucide-react';
import { ROOMS, FACILITIES, THINGS_TO_DO, VILLA_RULES, SAFETY_INFO, KITCHEN_GUIDELINES } from './constants';
import BookingForm from './components/BookingForm';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('full-villa');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-hill-green/90 backdrop-blur-md text-warm-beige py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/10">
        <div className="text-2xl font-serif tracking-widest cursor-pointer" onClick={() => scrollToSection('hero')}>
          HILLCROFT
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium">
          {['About', 'Rooms', 'Facilities', 'Location'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
              className="hover:text-muted-gold transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <button className="hidden md:block btn-primary py-2 px-6 text-sm" onClick={() => scrollToSection('booking')}>
          Book Now
        </button>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-hill-green flex flex-col items-center justify-center gap-8 text-warm-beige text-xl uppercase tracking-widest font-serif"
          >
            {['About', 'Rooms', 'Facilities', 'Location'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}>
                {item}
              </button>
            ))}
            <button className="btn-primary" onClick={() => scrollToSection('booking')}>
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* 1. Hero Section */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://ysepxdqcmwcplwwstdrs.supabase.co/storage/v1/object/public/room-images/WEbiste-cover.JPG"
              alt="Hillcroft Villa Exterior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-hill-green/50" />
          </div>
          
          <div className="relative z-10 text-center text-warm-beige px-6 max-w-4xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-gold uppercase tracking-[0.3em] font-medium mb-4"
            >
              Calm | Heal | Connect
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-serif mb-6"
            >
              Hillcroft Villa
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl font-light mb-10 tracking-wide opacity-90"
            >
              A Quiet Escape in the Heart of Nuwara Eliya
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button onClick={() => scrollToSection('booking')} className="btn-primary bg-muted-gold hover:bg-muted-gold/90 text-hill-green">
                Book Now
              </button>
              <button onClick={() => scrollToSection('rooms')} className="btn-secondary border-warm-beige text-warm-beige hover:bg-warm-beige hover:text-hill-green">
                View Rooms
              </button>
            </motion.div>
          </div>
        </section>

        {/* 2. Booking Engine Section */}
        <section id="booking" className="py-20 bg-hill-green px-6">
          <div className="max-w-6xl mx-auto">
            <BookingForm
              rooms={ROOMS}
              selectedRoomId={selectedRoomId}
              onRoomChange={setSelectedRoomId}
            />
          </div>
        </section>

        {/* 3. About The Villa */}
        <section id="about" className="py-24 px-6 bg-warm-beige">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">The Retreat</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-hill-green mb-8 leading-tight">About Hillcroft Villa</h3>
              <p className="text-lg text-hill-green/80 leading-relaxed mb-8">
                Nestled in the cool climate of Nuwara Eliya, Hillcroft Villa is a private retreat designed for comfort and calm. Surrounded by greenery and fresh mountain air, it is the perfect place to unwind away from busy city life.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <ShieldCheck className="text-muted-gold" />, text: 'Private & Peaceful' },
                  { icon: <BedDouble className="text-muted-gold" />, text: 'Comfortable Rooms' },
                  { icon: <Home className="text-muted-gold" />, text: 'Spacious Living' },
                  { icon: <MapPin className="text-muted-gold" />, text: 'Scenic Surroundings' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-hill-green font-medium">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://ysepxdqcmwcplwwstdrs.supabase.co/storage/v1/object/public/room-images/about%20hill%20croft%20villa.JPG"
                alt="Villa Interior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-hill-green text-warm-beige p-8 rounded-2xl hidden lg:block">
                <p className="text-4xl font-serif mb-1">100%</p>
                <p className="text-xs uppercase tracking-widest opacity-70">Privacy Guaranteed</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. Accommodation Selection */}
        <section id="rooms" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">Your Sanctuary</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-hill-green">Choose Your Stay</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ROOMS.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group overflow-hidden rounded-3xl border border-hill-green/5 bg-warm-beige/30 transition-all hover:shadow-xl ${room.id === 'full-villa' ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-hill-green font-semibold text-sm">
                      LKR {room.pricePerNight.toLocaleString()} / Night
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-serif text-hill-green mb-1">{room.name}</h4>
                        <p className="text-hill-green/60 text-sm">{room.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-gold">
                        <Users size={16} />
                        <span className="text-sm font-semibold">Max {room.maxGuests}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {room.features.map(f => (
                        <span key={f} className="text-[10px] uppercase tracking-wider bg-hill-green/5 text-hill-green/70 px-3 py-1 rounded-full border border-hill-green/10">
                          {f}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        scrollToSection('booking');
                      }}
                      className="w-full btn-secondary group-hover:bg-hill-green group-hover:text-warm-beige flex items-center justify-center gap-2"
                    >
                      Select This Stay <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Facilities Section */}
        <section id="facilities" className="py-24 px-6 bg-hill-green text-warm-beige">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">Amenities</h2>
              <h3 className="text-4xl md:text-5xl font-serif">Villa Facilities</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { title: 'Bedrooms', icon: <BedDouble />, items: FACILITIES.bedrooms },
                { title: 'Bathrooms', icon: <Bath />, items: FACILITIES.bathrooms },
                { title: 'Kitchen', icon: <Utensils />, items: FACILITIES.kitchen },
                { title: 'Safety', icon: <ShieldCheck />, items: FACILITIES.safety }
              ].map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
                >
                  <div className="text-muted-gold mb-6">{cat.icon}</div>
                  <h4 className="text-xl font-serif mb-6 border-b border-white/10 pb-4">{cat.title}</h4>
                  <ul className="space-y-3">
                    {cat.items.map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm opacity-80">
                        <CheckCircle2 size={14} className="text-muted-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl"
              >
                <h4 className="text-xl font-serif mb-6 text-muted-gold">Kitchen Guidelines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {KITCHEN_GUIDELINES.map(rule => (
                    <div key={rule} className="flex items-center gap-3 text-sm opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-gold" />
                      {rule}
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl"
              >
                <h4 className="text-xl font-serif mb-6 text-muted-gold">Safety Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SAFETY_INFO.map(info => (
                    <div key={info.label} className="text-sm opacity-80">
                      <p className="font-bold text-muted-gold">{info.label}</p>
                      <p>{info.location || info.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. Things To Do */}
        <section id="things-to-do" className="py-24 px-6 bg-warm-beige">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">Explore</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-hill-green">Things To Do in Nuwara Eliya</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {THINGS_TO_DO.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-[450px] overflow-hidden rounded-3xl"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hill-green via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-warm-beige">
                    <p className="text-xs uppercase tracking-widest text-muted-gold font-bold mb-2">{item.distance}</p>
                    <h4 className="text-2xl font-serif mb-3">{item.title}</h4>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Villa Rules Section */}
        <section id="rules" className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto bg-warm-beige rounded-[3rem] p-12 md:p-20 text-center border border-hill-green/5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-6">Guest Policy</h2>
            <h3 className="text-4xl font-serif text-hill-green mb-12">Villa Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
              {VILLA_RULES.map((rule, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-hill-green/5"
                >
                  <div className="w-2 h-2 rounded-full bg-muted-gold shrink-0" />
                  <p className="text-hill-green font-medium">{rule}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-12 text-sm text-hill-green/60 italic">
              We kindly ask our guests to respect these rules to ensure a peaceful stay for everyone.
            </p>
          </div>
        </section>

        {/* 8. Location Section */}
        <section id="location" className="py-24 px-6 bg-warm-beige">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">Find Us</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-hill-green mb-8">Location</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-muted-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif text-xl mb-2">Address</h4>
                    <p className="text-hill-green/70">
                      426/5, Kodigahakelle<br />
                      Nuwara Eliya 22200<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-xl mb-4">Nearby Attractions</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Nuwara Eliya Town', time: '5 min' },
                      { name: 'Gregory Lake', time: '10 min' },
                      { name: 'Victoria Park', time: '10 min' },
                      { name: 'Hakgala Garden', time: '20 min' },
                      { name: 'Horton Plains', time: '1 hour' }
                    ].map(place => (
                      <li key={place.name} className="flex justify-between items-center p-3 bg-white rounded-xl border border-hill-green/5">
                        <span className="text-sm font-medium">{place.name}</span>
                        <span className="text-xs text-muted-gold font-bold">{place.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
            >
              {/* Google Maps Embed Placeholder */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9!2d80.7!3d6.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnMDAuMCJOIDgwwrA0MicwMC4wIkU!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Hillcroft Villa Location"
              ></iframe>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-hill-green text-warm-beige pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h4 className="text-3xl font-serif tracking-widest">HILLCROFT</h4>
              <p className="text-muted-gold uppercase tracking-[0.3em] text-xs font-bold">Calm | Heal | Connect</p>
              <p className="text-sm opacity-70 leading-relaxed">
                Experience the finest luxury boutique stay in the heart of Nuwara Eliya's misty mountains.
              </p>
            </div>

            <div>
              <h5 className="font-serif text-xl mb-6">Contact</h5>
              <ul className="space-y-4 text-sm opacity-80">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-muted-gold" /> +94 76 680 0980
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-gold" /> info@hillcroft.lk
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-muted-gold" /> Nuwara Eliya, Sri Lanka
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-serif text-xl mb-6">Quick Links</h5>
              <ul className="space-y-4 text-sm opacity-80">
                {['About', 'Rooms', 'Facilities', 'Location'].map(link => (
                  <li key={link}>
                    <button onClick={() => scrollToSection(link.toLowerCase())} className="hover:text-muted-gold transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-serif text-xl mb-6">Follow Us</h5>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/hillcroft_villa/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-muted-gold hover:text-hill-green transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/hillcroftvilla" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-muted-gold hover:text-hill-green transition-all">
                  <Facebook size={20} />
                </a>
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-muted-gold fill-muted-gold" />
                  <Star size={14} className="text-muted-gold fill-muted-gold" />
                  <Star size={14} className="text-muted-gold fill-muted-gold" />
                  <Star size={14} className="text-muted-gold fill-muted-gold" />
                  <Star size={14} className="text-muted-gold fill-muted-gold" />
                </div>
                <p className="text-xs font-medium">Don't Forget to Review Us on Google</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <p>© {new Date().getFullYear()} Hillcroft Villa. All rights reserved.</p>
            <p>www.hillcroft.lk</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
