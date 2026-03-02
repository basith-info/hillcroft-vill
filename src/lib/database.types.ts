export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          room_id: string
          description: string
          price_per_night: number
          max_guests: number
          features: Json
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          room_id: string
          description: string
          price_per_night: number
          max_guests?: number
          features?: Json
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          room_id?: string
          description?: string
          price_per_night?: number
          max_guests?: number
          features?: Json
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string | null
          check_in: string
          check_out: string
          number_of_guests: number
          total_amount: number
          number_of_nights: number
          status: string
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone?: string | null
          check_in: string
          check_out: string
          number_of_guests?: number
          total_amount?: number
          number_of_nights?: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string | null
          check_in?: string
          check_out?: string
          number_of_guests?: number
          total_amount?: number
          number_of_nights?: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
