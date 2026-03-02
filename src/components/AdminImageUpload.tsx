import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { supabase } from '../lib/supabase';

interface Room {
  id: string;
  room_id: string;
  name: string;
  image_url: string | null;
}

export default function AdminImageUpload() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, room_id, name, image_url')
        .order('name');

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (url: string) => {
    if (!selectedRoom) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ image_url: url, updated_at: new Date().toISOString() })
        .eq('id', selectedRoom);

      if (error) throw error;

      await fetchRooms();
      setSelectedRoom(null);
    } catch (err) {
      console.error('Error updating room image:', err);
    }
  };

  const deleteImage = async (roomId: string, imageUrl: string | null) => {
    if (!imageUrl) return;

    try {
      const path = imageUrl.split('/').slice(-2).join('/');

      await supabase.storage
        .from('room-images')
        .remove([path]);

      const { error } = await supabase
        .from('rooms')
        .update({ image_url: null, updated_at: new Date().toISOString() })
        .eq('id', roomId);

      if (error) throw error;

      await fetchRooms();
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-hill-green/30 border-t-hill-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-sm uppercase tracking-[0.3em] text-muted-gold font-semibold mb-4">
          Admin Panel
        </h2>
        <h3 className="text-4xl md:text-5xl font-serif text-hill-green">
          Manage Room Images
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warm-beige rounded-3xl p-6 border border-hill-green/10"
          >
            <h4 className="text-xl font-serif text-hill-green mb-4">{room.name}</h4>

            {room.image_url ? (
              <div className="relative">
                <img
                  src={room.image_url}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
                <button
                  onClick={() => deleteImage(room.id, room.image_url)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="h-48 bg-hill-green/5 rounded-2xl flex items-center justify-center mb-4">
                <ImageIcon size={48} className="text-hill-green/30" />
              </div>
            )}

            {selectedRoom === room.id ? (
              <div>
                <ImageUpload
                  bucket="room-images"
                  folder={room.room_id}
                  onUploadComplete={handleImageUpload}
                  label={`Upload image for ${room.name}`}
                />
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="mt-4 w-full btn-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectedRoom(room.id)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {room.image_url ? 'Replace Image' : 'Add Image'}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
