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
        PostgrestVersion: "13.0.5"
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
                    status: string | null
                    title: string | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    status?: string | null
                    title?: string | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    status?: string | null
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
            nutrient_log_items: {
                Row: {
                    created_at: string | null
                    food_item_id: string
                    id: string
                    nutrient_log_id: string
                    quantity: number
                }
                Insert: {
                    created_at?: string | null
                    food_item_id: string
                    id?: string
                    nutrient_log_id: string
                    quantity?: number
                }
                Update: {
                    created_at?: string | null
                    food_item_id?: string
                    id?: string
                    nutrient_log_id?: string
                    quantity?: number
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
                    created_at: string | null
                    email: string | null
                    goals: string[] | null
                    height: number | null
                    id: string
                    name: string | null
                    preferences: Json | null
                    role: string | null
                    updated_at: string | null
                    weight: number | null
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    goals?: string[] | null
                    height?: number | null
                    id: string
                    name?: string | null
                    preferences?: Json | null
                    role?: string | null
                    updated_at?: string | null
                    weight?: number | null
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    goals?: string[] | null
                    height?: number | null
                    id?: string
                    name?: string | null
                    preferences?: Json | null
                    role?: string | null
                    updated_at?: string | null
                    weight?: number | null
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
            workout_sessions: {
                Row: {
                    created_at: string | null
                    date: string
                    duration: number | null
                    id: string
                    name: string | null
                    status: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    date?: string
                    duration?: number | null
                    id?: string
                    name?: string | null
                    status?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    duration?: number | null
                    id?: string
                    name?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never &
        (Database[PublicTableNameOrOptions["schema"]] extends { Views: any }
            ? Database[PublicTableNameOrOptions["schema"]]["Views"]
            : never))
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never &
        (Database[PublicTableNameOrOptions["schema"]] extends { Views: any }
            ? Database[PublicTableNameOrOptions["schema"]]["Views"]
            : never))[TableName] extends {
                Row: infer R
            }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)[TableName] extends {
            Insert: infer I
        }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)[TableName] extends {
            Update: infer U
        }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]] extends { Enums: any }
        ? Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never)
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicEnumNameOrOptions["schema"]] extends { Enums: any }
        ? Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never)[EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof (Database[PublicCompositeTypeNameOrOptions["schema"]] extends {
        CompositeTypes: any
    }
        ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never)
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicCompositeTypeNameOrOptions["schema"]] extends {
        CompositeTypes: any
    }
        ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never)[CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
