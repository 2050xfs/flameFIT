export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      body_stats: {
        Row: {
          body_fat_pct: number | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          user_id: string
          weight: number
        }
        Insert: {
          body_fat_pct?: number | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          user_id: string
          weight: number
        }
        Update: {
          body_fat_pct?: number | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "body_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string | null
          session_id: string
          widget_data: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role?: string | null
          session_id: string
          widget_data?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string | null
          session_id?: string
          widget_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          muscle_groups: string[]
          name: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          muscle_groups: string[]
          name: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          muscle_groups?: string[]
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      food_items: {
        Row: {
          brand: string | null
          calories: number
          carbs: number
          created_at: string | null
          fats: number
          id: string
          name: string
          protein: number
          serving_size: string | null
        }
        Insert: {
          brand?: string | null
          calories: number
          carbs: number
          created_at?: string | null
          fats: number
          id?: string
          name: string
          protein: number
          serving_size?: string | null
        }
        Update: {
          brand?: string | null
          calories?: number
          carbs?: number
          created_at?: string | null
          fats?: number
          id?: string
          name?: string
          protein?: number
          serving_size?: string | null
        }
        Relationships: []
      }
      generated_workouts: {
        Row: {
          cns_intensity: string | null
          created_at: string | null
          description: string | null
          estimated_calories: number | null
          estimated_duration: number | null
          exercises: Json
          generation_prompt: string | null
          id: string
          muscle_groups: string[] | null
          spark_insight: string | null
          tags: string[] | null
          title: string
          total_volume: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cns_intensity?: string | null
          created_at?: string | null
          description?: string | null
          estimated_calories?: number | null
          estimated_duration?: number | null
          exercises?: Json
          generation_prompt?: string | null
          id?: string
          muscle_groups?: string[] | null
          spark_insight?: string | null
          tags?: string[] | null
          title: string
          total_volume?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cns_intensity?: string | null
          created_at?: string | null
          description?: string | null
          estimated_calories?: number | null
          estimated_duration?: number | null
          exercises?: Json
          generation_prompt?: string | null
          id?: string
          muscle_groups?: string[] | null
          spark_insight?: string | null
          tags?: string[] | null
          title?: string
          total_volume?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_bookmarks: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_bookmarks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_content: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      nutrient_log_items: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          nutrient_log_id: string
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          nutrient_log_id: string
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          nutrient_log_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrient_log_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrient_log_items_nutrient_log_id_fkey"
            columns: ["nutrient_log_id"]
            isOneToOne: false
            referencedRelation: "nutrient_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrient_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          meal_type: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fats: number | null
          total_protein: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          meal_type?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          meal_type?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrient_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          goals: string[] | null
          height: number | null
          id: string
          name: string | null
          preferences: Json | null
          role: string | null
          subscription_expires_at: string | null
          subscription_started_at: string | null
          subscription_tier: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          goals?: string[] | null
          height?: number | null
          id: string
          name?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          subscription_tier?: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          name?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          subscription_tier?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      program_subscriptions: {
        Row: {
          completed_chapters: string[] | null
          current_week: number | null
          id: string
          program_id: string
          status: string | null
          subscribed_at: string | null
          user_id: string
        }
        Insert: {
          completed_chapters?: string[] | null
          current_week?: number | null
          id?: string
          program_id: string
          status?: string | null
          subscribed_at?: string | null
          user_id: string
        }
        Update: {
          completed_chapters?: string[] | null
          current_week?: number | null
          id?: string
          program_id?: string
          status?: string | null
          subscribed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_templates: {
        Row: {
          created_at: string | null
          creator: string
          curriculum: Json | null
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator: string
          curriculum?: Json | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator?: string
          curriculum?: Json | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          photo_date: string
          public_url: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          photo_date?: string
          public_url?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          photo_date?: string
          public_url?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      readiness_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          mood: number | null
          notes: string | null
          sleep_hours: number | null
          sleep_quality: number | null
          soreness: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          user_id?: string
        }
        Relationships: []
      }
      set_logs: {
        Row: {
          completed_at: string | null
          exercise_id: string
          id: string
          reps: number | null
          rpe: number | null
          weight: number | null
          workout_session_id: string
        }
        Insert: {
          completed_at?: string | null
          exercise_id: string
          id?: string
          reps?: number | null
          rpe?: number | null
          weight?: number | null
          workout_session_id: string
        }
        Update: {
          completed_at?: string | null
          exercise_id?: string
          id?: string
          reps?: number | null
          rpe?: number | null
          weight?: number | null
          workout_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      water_logs: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string
          id: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          created_at: string | null
          date: string
          duration: number | null
          id: string
          is_pro_template: boolean | null
          name: string | null
          program_author: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          duration?: number | null
          id?: string
          is_pro_template?: boolean | null
          name?: string | null
          program_author?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          duration?: number | null
          id?: string
          is_pro_template?: boolean | null
          name?: string | null
          program_author?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
