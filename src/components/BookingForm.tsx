import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Home, Mail, User, Phone } from 'lucide-react';
import FileUpload from './FileUpload';
import { supabase } from '../lib/supabase';

interface Room {
  id: string;
  name: string;
  pricePerNight: number;
}

interface BookingFormProps {
  rooms: Room[];
  selectedRoomId: string;
  onRoomChange: (roomId: string) => void;
}

export default function BookingForm({ rooms, selectedRoomId, onRoomChange }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find(r => r.id === selectedRoomId) || rooms[0],
    [selectedRoomId, rooms]
  );

  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkIn, checkOut]);

  const totalAmount = useMemo(() => {
    return numberOfNights * selectedRoom.pricePerNight;
  }, [numberOfNights, selectedRoom]);

  const handleDocumentUpload = (url: string, fileName: string) => {
    setUploadedDocuments(prev => [...prev, url]);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut || numberOfNights <= 0) {
      setError('Please select valid check-in and check-out dates');
      return;
    }

    if (!guestName || !guestEmail) {
      setError('Please provide your name and email');
      return;
    }

    setIsSubmitting(true);

    try {
      const room = await supabase
        .from('rooms')
        .select('id')
        .eq('room_id', selectedRoomId)
        .maybeSingle();

      if (!room.data) {
        throw new Error('Room not found');
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          room_id: room.data.id,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone || null,
          check_in: checkIn,
          check_out: checkOut,
          number_of_guests: guests,
          total_amount: totalAmount,
          number_of_nights: numberOfNights,
          special_requests: specialRequests || null,
          status: 'pending'
        });

      if (bookingError) throw bookingError;

      setIsBookingConfirmed(true);

      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setSpecialRequests('');
      setUploadedDocuments([]);

      setTimeout(() => setIsBookingConfirmed(false), 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-8 md:p-12"
    >
      <form onSubmit={handleBooking}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-end mb-8">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Calendar size={14} /> Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Calendar size={14} /> Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Users size={14} /> Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Home size={14} /> Accommodation
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => onRoomChange(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 flex items-center gap-2">
              <Phone size={14} /> Phone (Optional)
            </label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              placeholder="+94 76 123 4567"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60">
              Special Requests (Optional)
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-transparent border-b border-hill-green/20 py-2 focus:outline-none focus:border-hill-green text-hill-green"
              placeholder="Early check-in, dietary requirements..."
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="text-xs uppercase tracking-widest font-semibold text-hill-green/60 mb-4 block">
            Supporting Documents (Optional)
          </label>
          <FileUpload
            bucket="guest-documents"
            folder={guestEmail || 'temp'}
            onUploadComplete={handleDocumentUpload}
            label="Upload ID or Other Documents"
          />
          {uploadedDocuments.length > 0 && (
            <p className="text-xs text-hill-green/60 mt-2">
              {uploadedDocuments.length} document{uploadedDocuments.length > 1 ? 's' : ''} uploaded
            </p>
          )}
        </div>

        <div className="pt-8 border-t border-hill-green/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-12 text-center md:text-left">
            <div>
              <p className="text-xs uppercase tracking-widest text-hill-green/60 mb-1">Price per night</p>
              <p className="text-2xl font-serif text-hill-green">${selectedRoom.pricePerNight}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-hill-green/60 mb-1">Nights</p>
              <p className="text-2xl font-serif text-hill-green">{numberOfNights}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-hill-green/60 mb-1">Total</p>
              <p className="text-2xl font-serif text-muted-gold font-bold">${totalAmount}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 text-red-800 rounded-xl text-center border border-red-100"
          >
            {error}
          </motion.div>
        )}

        {isBookingConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center border border-emerald-100"
          >
            Thank you! Your booking request for {selectedRoom.name} has been sent. We will contact you shortly.
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
