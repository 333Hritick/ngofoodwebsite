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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'donor' | 'ngo'
          phone: string | null
          address: string | null
          organization_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'donor' | 'ngo'
          phone?: string | null
          address?: string | null
          organization_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'donor' | 'ngo'
          phone?: string | null
          address?: string | null
          organization_name?: string | null
          created_at?: string
        }
      }
      food_donations: {
        Row: {
          id: string
          donor_id: string
          title: string
          description: string
          quantity: string
          food_type: 'cooked' | 'packaged' | 'fresh_produce' | 'baked' | 'other'
          expiry_time: string
          pickup_address: string
          status: 'available' | 'claimed' | 'picked_up' | 'delivered'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          title: string
          description: string
          quantity: string
          food_type: 'cooked' | 'packaged' | 'fresh_produce' | 'baked' | 'other'
          expiry_time: string
          pickup_address: string
          status?: 'available' | 'claimed' | 'picked_up' | 'delivered'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string
          title?: string
          description?: string
          quantity?: string
          food_type?: 'cooked' | 'packaged' | 'fresh_produce' | 'baked' | 'other'
          expiry_time?: string
          pickup_address?: string
          status?: 'available' | 'claimed' | 'picked_up' | 'delivered'
          created_at?: string
          updated_at?: string
        }
      }
      pickups: {
        Row: {
          id: string
          donation_id: string
          ngo_id: string
          claimed_at: string
          picked_up_at: string | null
          delivered_at: string | null
          beneficiary_count: number
          notes: string | null
        }
        Insert: {
          id?: string
          donation_id: string
          ngo_id: string
          claimed_at?: string
          picked_up_at?: string | null
          delivered_at?: string | null
          beneficiary_count?: number
          notes?: string | null
        }
        Update: {
          id?: string
          donation_id?: string
          ngo_id?: string
          claimed_at?: string
          picked_up_at?: string | null
          delivered_at?: string | null
          beneficiary_count?: number
          notes?: string | null
        }
      }
      tracking_updates: {
        Row: {
          id: string
          pickup_id: string
          status: 'claimed' | 'picked_up' | 'in_transit' | 'delivered'
          message: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          pickup_id: string
          status: 'claimed' | 'picked_up' | 'in_transit' | 'delivered'
          message: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          pickup_id?: string
          status?: 'claimed' | 'picked_up' | 'in_transit' | 'delivered'
          message?: string
          created_at?: string
          created_by?: string
        }
      }
    }
  }
}
