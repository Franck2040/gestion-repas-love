export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dish_ingredients: {
        Row: {
          dish_id: string | null
          id: string
          ingredient_id: string | null
          quantity: number
          unit: string
        }
        Insert: {
          dish_id?: string | null
          id?: string
          ingredient_id?: string | null
          quantity: number
          unit: string
        }
        Update: {
          dish_id?: string | null
          id?: string
          ingredient_id?: string | null
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          author_id: string | null
          cooking_time: number | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          nutrition_info: Json | null
          photo_url: string | null
          rating: number | null
          recipe_content: string | null
          recipe_file_url: string | null
          servings: number | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          cooking_time?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          nutrition_info?: Json | null
          photo_url?: string | null
          rating?: number | null
          recipe_content?: string | null
          recipe_file_url?: string | null
          servings?: number | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          cooking_time?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          nutrition_info?: Json | null
          photo_url?: string | null
          rating?: number | null
          recipe_content?: string | null
          recipe_file_url?: string | null
          servings?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          allergies: string[] | null
          birth_date: string | null
          created_at: string
          dietary_restrictions: string[] | null
          email: string | null
          gender: string | null
          height: number | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          allergies?: string[] | null
          birth_date?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          email?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          allergies?: string[] | null
          birth_date?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          email?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          dish_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dish_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dish_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          photo_url: string | null
          price_per_unit: number | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          photo_url?: string | null
          price_per_unit?: number | null
          unit?: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          price_per_unit?: number | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "ingredient_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          created_at: string | null
          expiration_date: string | null
          id: string
          ingredient_id: string | null
          location: string | null
          low_stock_threshold: number | null
          quantity: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          ingredient_id?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          ingredient_id?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          created_at: string | null
          description: string | null
          freshness_status: string | null
          id: string
          ingredient_id: string | null
          is_available: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          price_per_unit: number
          quantity: number
          seller_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          freshness_status?: string | null
          id?: string
          ingredient_id?: string | null
          is_available?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          price_per_unit: number
          quantity: number
          seller_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          freshness_status?: string | null
          id?: string
          ingredient_id?: string | null
          is_available?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          price_per_unit?: number
          quantity?: number
          seller_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          dish_id: string | null
          id: string
          meal_type: string | null
          planned_date: string
          servings: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dish_id?: string | null
          id?: string
          meal_type?: string | null
          planned_date: string
          servings?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dish_id?: string | null
          id?: string
          meal_type?: string | null
          planned_date?: string
          servings?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_confirmed: boolean | null
          buyer_id: string
          created_at: string
          delivery_address: string
          delivery_date: string | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_time: string | null
          id: string
          marketplace_item_id: string | null
          quantity: number
          seller_confirmed: boolean | null
          seller_id: string | null
          status: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          buyer_confirmed?: boolean | null
          buyer_id: string
          created_at?: string
          delivery_address: string
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_time?: string | null
          id?: string
          marketplace_item_id?: string | null
          quantity: number
          seller_confirmed?: boolean | null
          seller_id?: string | null
          status?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          buyer_confirmed?: boolean | null
          buyer_id?: string
          created_at?: string
          delivery_address?: string
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_time?: string | null
          id?: string
          marketplace_item_id?: string | null
          quantity?: number
          seller_confirmed?: boolean | null
          seller_id?: string | null
          status?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_marketplace_item_id_fkey"
            columns: ["marketplace_item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          added_by: string | null
          created_at: string | null
          id: string
          ingredient_id: string | null
          is_checked: boolean | null
          quantity: number
          shopping_list_id: string | null
          unit: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          quantity: number
          shopping_list_id?: string | null
          unit: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          quantity?: number
          shopping_list_id?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: string
          is_shared: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          address: string
          created_at: string
          id: string
          is_default: boolean | null
          latitude: number
          longitude: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          latitude: number
          longitude: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notifications_enabled: boolean | null
          share_location_realtime: boolean | null
          updated_at: string
          user_id: string
          voice_notifications: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          share_location_realtime?: boolean | null
          updated_at?: string
          user_id: string
          voice_notifications?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          share_location_realtime?: boolean | null
          updated_at?: string
          user_id?: string
          voice_notifications?: boolean | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
