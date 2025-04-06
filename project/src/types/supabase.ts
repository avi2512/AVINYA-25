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
          user_id: string
          major: string | null
          gpa: number | null
          academic_year: string | null
          nationality: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          major?: string | null
          gpa?: number | null
          academic_year?: string | null
          nationality?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          major?: string | null
          gpa?: number | null
          academic_year?: string | null
          nationality?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scholarships: {
        Row: {
          id: string
          title: string
          provider: string
          amount: number
          deadline: string
          description: string
          requirements: string[]
          category: string
          fields: string[]
          gpa_requirement: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          provider: string
          amount: number
          deadline: string
          description: string
          requirements?: string[]
          category: string
          fields?: string[]
          gpa_requirement?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          provider?: string
          amount?: number
          deadline?: string
          description?: string
          requirements?: string[]
          category?: string
          fields?: string[]
          gpa_requirement?: number | null
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          scholarship_id: string
          status: string
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scholarship_id: string
          status?: string
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scholarship_id?: string
          status?: string
          submitted_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}