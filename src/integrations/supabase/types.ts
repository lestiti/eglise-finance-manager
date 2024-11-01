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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_metadata: {
        Row: {
          backup_date: string | null
          backup_size: number | null
          backup_type: string
          created_at: string | null
          encryption_key_hash: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          backup_date?: string | null
          backup_size?: number | null
          backup_type: string
          created_at?: string | null
          encryption_key_hash?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          backup_date?: string | null
          backup_size?: number | null
          backup_type?: string
          created_at?: string | null
          encryption_key_hash?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backup_metadata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      charitable_activities: {
        Row: {
          budget_alloue: number
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          depenses_actuelles: number | null
          description: string | null
          id: string
          nom: string
          nombre_beneficiaires: number | null
          objectif_beneficiaires: number | null
        }
        Insert: {
          budget_alloue: number
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depenses_actuelles?: number | null
          description?: string | null
          id?: string
          nom: string
          nombre_beneficiaires?: number | null
          objectif_beneficiaires?: number | null
        }
        Update: {
          budget_alloue?: number
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depenses_actuelles?: number | null
          description?: string | null
          id?: string
          nom?: string
          nombre_beneficiaires?: number | null
          objectif_beneficiaires?: number | null
        }
        Relationships: []
      }
      department_budgets: {
        Row: {
          annee: number
          budget_annuel: number
          budget_mensuel: number
          created_at: string | null
          id: string
          mois: number | null
          nom: string
        }
        Insert: {
          annee: number
          budget_annuel: number
          budget_mensuel: number
          created_at?: string | null
          id?: string
          mois?: number | null
          nom: string
        }
        Update: {
          annee?: number
          budget_annuel?: number
          budget_mensuel?: number
          created_at?: string | null
          id?: string
          mois?: number | null
          nom?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          activite: string | null
          created_at: string | null
          date_don: string | null
          id: string
          montant: number
          source: string
          type: string
          user_id: string | null
        }
        Insert: {
          activite?: string | null
          created_at?: string | null
          date_don?: string | null
          id?: string
          montant: number
          source: string
          type: string
          user_id?: string | null
        }
        Update: {
          activite?: string | null
          created_at?: string | null
          date_don?: string | null
          id?: string
          montant?: number
          source?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statements: {
        Row: {
          annee: number
          created_at: string | null
          data: Json
          id: string
          mois: number | null
          periode: string
          trimestre: number | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annee: number
          created_at?: string | null
          data: Json
          id?: string
          mois?: number | null
          periode: string
          trimestre?: number | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annee?: number
          created_at?: string | null
          data?: Json
          id?: string
          mois?: number | null
          periode?: string
          trimestre?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_statements_user_id_fkey"
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
          id: string
          nom: string | null
          prenom: string | null
          role: string | null
          telephone: string | null
        }
        Insert: {
          created_at?: string
          id: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_total: number
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          depenses_actuelles: number | null
          description: string | null
          id: string
          nom: string
          statut: string | null
        }
        Insert: {
          budget_total: number
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depenses_actuelles?: number | null
          description?: string | null
          id?: string
          nom: string
          statut?: string | null
        }
        Update: {
          budget_total?: number
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depenses_actuelles?: number | null
          description?: string | null
          id?: string
          nom?: string
          statut?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          date_transaction: string | null
          description: string | null
          id: string
          methode_paiement: string
          montant: number
          numero_facture: string | null
          statut: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_transaction?: string | null
          description?: string | null
          id?: string
          methode_paiement: string
          montant: number
          numero_facture?: string | null
          statut?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_transaction?: string | null
          description?: string | null
          id?: string
          methode_paiement?: string
          montant?: number
          numero_facture?: string | null
          statut?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      treasury_movements: {
        Row: {
          categorie: string
          created_at: string | null
          date_mouvement: string | null
          description: string | null
          id: string
          montant: number
          solde_apres: number
          type: string
        }
        Insert: {
          categorie: string
          created_at?: string | null
          date_mouvement?: string | null
          description?: string | null
          id?: string
          montant: number
          solde_apres: number
          type: string
        }
        Update: {
          categorie?: string
          created_at?: string | null
          date_mouvement?: string | null
          description?: string | null
          id?: string
          montant?: number
          solde_apres?: number
          type?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
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
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
