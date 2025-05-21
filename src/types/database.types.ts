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
      patients: {
        Row: {
          id: string
          created_at: string
          full_name: string
          birth_date: string | null
          sex: string | null
          contact_phone: string | null
          contact_email: string | null
          address: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          birth_date?: string | null
          sex?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          address?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          birth_date?: string | null
          sex?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          address?: string | null
          manager_id?: string | null
        }
      }
      interview: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          chapter: string | null
          question: string | null
          question_to_ask: string | null
          answer: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          chapter?: string | null
          question?: string | null
          question_to_ask?: string | null
          answer?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          chapter?: string | null
          question?: string | null
          question_to_ask?: string | null
          answer?: string | null
          manager_id?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string | null
          task_name: string | null
          start_date: string | null
          due_date: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status?: string | null
          task_name?: string | null
          start_date?: string | null
          due_date?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string | null
          task_name?: string | null
          start_date?: string | null
          due_date?: string | null
          manager_id?: string | null
        }
      }
      journal: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string | null
          event_time: string | null
          event_date: string | null
          mode: string | null
          name: string | null
          agenda: string | null
          outcomes: string | null
          additional_info: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status?: string | null
          event_time?: string | null
          event_date?: string | null
          mode?: string | null
          name?: string | null
          agenda?: string | null
          outcomes?: string | null
          additional_info?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string | null
          event_time?: string | null
          event_date?: string | null
          mode?: string | null
          name?: string | null
          agenda?: string | null
          outcomes?: string | null
          additional_info?: string | null
          manager_id?: string | null
        }
      }
      drugs: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string | null
          mode: string | null
          name: string | null
          dose: number | null
          unit: string | null
          quantities: number | null
          dosage_form: string | null
          periodicity: string | null
          week_days: string | null
          interval: string | null
          course_break: string | null
          time_start: string | null
          date_start: string | null
          date_end: string | null
          administration_method: string | null
          note: string | null
          note_for_manager: string | null
          drug_link: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status?: string | null
          mode?: string | null
          name?: string | null
          dose?: number | null
          unit?: string | null
          quantities?: number | null
          dosage_form?: string | null
          periodicity?: string | null
          week_days?: string | null
          interval?: string | null
          course_break?: string | null
          time_start?: string | null
          date_start?: string | null
          date_end?: string | null
          administration_method?: string | null
          note?: string | null
          note_for_manager?: string | null
          drug_link?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string | null
          mode?: string | null
          name?: string | null
          dose?: number | null
          unit?: string | null
          quantities?: number | null
          dosage_form?: string | null
          periodicity?: string | null
          week_days?: string | null
          interval?: string | null
          course_break?: string | null
          time_start?: string | null
          date_start?: string | null
          date_end?: string | null
          administration_method?: string | null
          note?: string | null
          note_for_manager?: string | null
          drug_link?: string | null
          manager_id?: string | null
        }
      }
      medical_data: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string | null
          examination: string | null
          examination_details: string | null
          exam_time: string | null
          exam_date: string | null
          doctor: string | null
          clinic_name: string | null
          clinic_address: string | null
          clinic_contact: string | null
          price: number | null
          currency: string | null
          payment_method: string | null
          guide: string | null
          results: string | null
          conclusion: string | null
          recommendations: string | null
          notes: string | null
          pdf_file: string | null
          link: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status?: string | null
          examination?: string | null
          examination_details?: string | null
          exam_time?: string | null
          exam_date?: string | null
          doctor?: string | null
          clinic_name?: string | null
          clinic_address?: string | null
          clinic_contact?: string | null
          price?: number | null
          currency?: string | null
          payment_method?: string | null
          guide?: string | null
          results?: string | null
          conclusion?: string | null
          recommendations?: string | null
          notes?: string | null
          pdf_file?: string | null
          link?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string | null
          examination?: string | null
          examination_details?: string | null
          exam_time?: string | null
          exam_date?: string | null
          doctor?: string | null
          clinic_name?: string | null
          clinic_address?: string | null
          clinic_contact?: string | null
          price?: number | null
          currency?: string | null
          payment_method?: string | null
          guide?: string | null
          results?: string | null
          conclusion?: string | null
          recommendations?: string | null
          notes?: string | null
          pdf_file?: string | null
          link?: string | null
          manager_id?: string | null
        }
      }
      store: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          name: string | null
          dose: number | null
          unit: string | null
          dosage_form: string | null
          location: string | null
          exp_date: string | null
          conditions: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          name?: string | null
          dose?: number | null
          unit?: string | null
          dosage_form?: string | null
          location?: string | null
          exp_date?: string | null
          conditions?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          name?: string | null
          dose?: number | null
          unit?: string | null
          dosage_form?: string | null
          location?: string | null
          exp_date?: string | null
          conditions?: string | null
          manager_id?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string | null
          recipient: string | null
          subject: string | null
          name: string | null
          schedule_from_source: string | null
          periodicity: string | null
          message_schedule: string | null
          info: string | null
          text_constructor: string | null
          text: string | null
          next_notify_time: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status?: string | null
          recipient?: string | null
          subject?: string | null
          name?: string | null
          schedule_from_source?: string | null
          periodicity?: string | null
          message_schedule?: string | null
          info?: string | null
          text_constructor?: string | null
          text?: string | null
          next_notify_time?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string | null
          recipient?: string | null
          subject?: string | null
          name?: string | null
          schedule_from_source?: string | null
          periodicity?: string | null
          message_schedule?: string | null
          info?: string | null
          text_constructor?: string | null
          text?: string | null
          next_notify_time?: string | null
          manager_id?: string | null
        }
      }
      reference_lists: {
        Row: {
          id: string
          created_at: string
          category: string
          value: string
        }
        Insert: {
          id?: string
          created_at?: string
          category: string
          value: string
        }
        Update: {
          id?: string
          created_at?: string
          category?: string
          value?: string
        }
      }
      managers: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          email: string
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string
          role?: string
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          name: string
          file_path: string
          file_type: string
          upload_date: string
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          name: string
          file_path: string
          file_type: string
          upload_date?: string
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          name?: string
          file_path?: string
          file_type?: string
          upload_date?: string
          manager_id?: string | null
        }
      }
    }
  }
}