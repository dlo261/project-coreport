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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          key_hash: string
          label: string | null
          revoked_at: string | null
          scopes: string[]
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          key_hash: string
          label?: string | null
          revoked_at?: string | null
          scopes?: string[]
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          key_hash?: string
          label?: string | null
          revoked_at?: string | null
          scopes?: string[]
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_admin_id: string | null
          created_at: string
          id: string
          metadata: Json
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_admin_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_admin_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      availability_mode_config: {
        Row: {
          description: string
          id: string
          label: string
          mode: Database["public"]["Enums"]["availability_mode"]
          rate_multiplier: number
          utilization_high: number | null
          utilization_low: number | null
        }
        Insert: {
          description: string
          id?: string
          label: string
          mode: Database["public"]["Enums"]["availability_mode"]
          rate_multiplier?: number
          utilization_high?: number | null
          utilization_low?: number | null
        }
        Update: {
          description?: string
          id?: string
          label?: string
          mode?: Database["public"]["Enums"]["availability_mode"]
          rate_multiplier?: number
          utilization_high?: number | null
          utilization_low?: number | null
        }
        Relationships: []
      }
      benchmarks: {
        Row: {
          created_at: string
          id: string
          node_id: string
          normalized_scores: Json
          raw_measurements: Json
          suite_version: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          node_id: string
          normalized_scores?: Json
          raw_measurements?: Json
          suite_version?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          node_id?: string
          normalized_scores?: Json
          raw_measurements?: Json
          suite_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benchmarks_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      build_milestones: {
        Row: {
          detail: string | null
          id: string
          sort_order: number
          state: string
          title: string
        }
        Insert: {
          detail?: string | null
          id?: string
          sort_order?: number
          state?: string
          title: string
        }
        Update: {
          detail?: string | null
          id?: string
          sort_order?: number
          state?: string
          title?: string
        }
        Relationships: []
      }
      competitor_prices: {
        Row: {
          competitor: string
          date_checked: string
          figure: string
          id: string
          item: string
          product: Database["public"]["Enums"]["product_type"]
          source_url: string | null
        }
        Insert: {
          competitor: string
          date_checked: string
          figure: string
          id?: string
          item: string
          product: Database["public"]["Enums"]["product_type"]
          source_url?: string | null
        }
        Update: {
          competitor?: string
          date_checked?: string
          figure?: string
          id?: string
          item?: string
          product?: Database["public"]["Enums"]["product_type"]
          source_url?: string | null
        }
        Relationships: []
      }
      customer_wallet_settings: {
        Row: {
          auto_stop_buffer_cents: number
          auto_stop_enabled: boolean
          budget_cap_cents: number | null
          customer_id: string
        }
        Insert: {
          auto_stop_buffer_cents?: number
          auto_stop_enabled?: boolean
          budget_cap_cents?: number | null
          customer_id: string
        }
        Update: {
          auto_stop_buffer_cents?: number
          auto_stop_enabled?: boolean
          budget_cap_cents?: number | null
          customer_id?: string
        }
        Relationships: []
      }
      deployments: {
        Row: {
          assigned_node_id: string | null
          created_at: string
          customer_id: string
          endpoint: string | null
          id: string
          listing_id: string | null
          region: string | null
          reliability: Database["public"]["Enums"]["reliability_class"]
          resource_spec: Json
          started_at: string | null
          status: Database["public"]["Enums"]["deployment_status"]
          stopped_at: string | null
        }
        Insert: {
          assigned_node_id?: string | null
          created_at?: string
          customer_id: string
          endpoint?: string | null
          id?: string
          listing_id?: string | null
          region?: string | null
          reliability?: Database["public"]["Enums"]["reliability_class"]
          resource_spec?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["deployment_status"]
          stopped_at?: string | null
        }
        Update: {
          assigned_node_id?: string | null
          created_at?: string
          customer_id?: string
          endpoint?: string | null
          id?: string
          listing_id?: string | null
          region?: string | null
          reliability?: Database["public"]["Enums"]["reliability_class"]
          resource_spec?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["deployment_status"]
          stopped_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployments_assigned_node_id_fkey"
            columns: ["assigned_node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "service_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          expires_at: string | null
          id: string
          key: string
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          expires_at?: string | null
          id?: string
          key: string
        }
        Update: {
          description?: string | null
          enabled?: boolean
          expires_at?: string | null
          id?: string
          key?: string
        }
        Relationships: []
      }
      kyc_records: {
        Row: {
          id: string
          notes: string | null
          provider_id: string
          reviewed_at: string | null
          reviewed_by_admin_id: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string
        }
        Insert: {
          id?: string
          notes?: string | null
          provider_id: string
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
        }
        Update: {
          id?: string
          notes?: string | null
          provider_id?: string
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          actor_id: string | null
          actor_type: Database["public"]["Enums"]["ledger_actor_type"]
          amount_cents: number
          created_at: string
          entry_type: Database["public"]["Enums"]["ledger_entry_type"]
          id: string
          note: string | null
          related_deployment_id: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_type: Database["public"]["Enums"]["ledger_actor_type"]
          amount_cents: number
          created_at?: string
          entry_type: Database["public"]["Enums"]["ledger_entry_type"]
          id?: string
          note?: string | null
          related_deployment_id?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["ledger_actor_type"]
          amount_cents?: number
          created_at?: string
          entry_type?: Database["public"]["Enums"]["ledger_entry_type"]
          id?: string
          note?: string | null
          related_deployment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_related_deployment_id_fkey"
            columns: ["related_deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_pages: {
        Row: {
          body: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      nodes: {
        Row: {
          cpu_score: number | null
          cpu_tier: string | null
          created_at: string
          gpu_score: number | null
          gpu_tier: string | null
          hardware_snapshot: Json
          id: string
          is_coreport_operated: boolean
          label: string
          last_heartbeat_at: string | null
          network_score: number | null
          network_tier: string | null
          provider_id: string | null
          reliability_score: number | null
          status: Database["public"]["Enums"]["node_status"]
          storage_score: number | null
          storage_tier: string | null
        }
        Insert: {
          cpu_score?: number | null
          cpu_tier?: string | null
          created_at?: string
          gpu_score?: number | null
          gpu_tier?: string | null
          hardware_snapshot?: Json
          id?: string
          is_coreport_operated?: boolean
          label: string
          last_heartbeat_at?: string | null
          network_score?: number | null
          network_tier?: string | null
          provider_id?: string | null
          reliability_score?: number | null
          status?: Database["public"]["Enums"]["node_status"]
          storage_score?: number | null
          storage_tier?: string | null
        }
        Update: {
          cpu_score?: number | null
          cpu_tier?: string | null
          created_at?: string
          gpu_score?: number | null
          gpu_tier?: string | null
          hardware_snapshot?: Json
          id?: string
          is_coreport_operated?: boolean
          label?: string
          last_heartbeat_at?: string | null
          network_score?: number | null
          network_tier?: string | null
          provider_id?: string | null
          reliability_score?: number | null
          status?: Database["public"]["Enums"]["node_status"]
          storage_score?: number | null
          storage_tier?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          paid_at: string | null
          provider_id: string
          status: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id: string | null
          threshold_met_at: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          paid_at?: string | null
          provider_id: string
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id?: string | null
          threshold_met_at?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          provider_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_transfer_id?: string | null
          threshold_met_at?: string | null
        }
        Relationships: []
      }
      price_quotes: {
        Row: {
          accepted: boolean
          deployment_id: string
          id: string
          quoted_at: string
          quoted_price_cents: number
        }
        Insert: {
          accepted?: boolean
          deployment_id: string
          id?: string
          quoted_at?: string
          quoted_price_cents: number
        }
        Update: {
          accepted?: boolean
          deployment_id?: string
          id?: string
          quoted_at?: string
          quoted_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_quotes_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_config: {
        Row: {
          effective_from: string
          host_pool_pct: number
          id: string
          platform_take_pct: number
          product_type: Database["public"]["Enums"]["product_type"]
        }
        Insert: {
          effective_from?: string
          host_pool_pct: number
          id?: string
          platform_take_pct: number
          product_type: Database["public"]["Enums"]["product_type"]
        }
        Update: {
          effective_from?: string
          host_pool_pct?: number
          id?: string
          platform_take_pct?: number
          product_type?: Database["public"]["Enums"]["product_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          availability_mode: Database["public"]["Enums"]["availability_mode"]
          created_at: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          minimum_payout_floor_cents: number
          payout_threshold_cents: number
          quiet_hours: Json
          resource_caps: Json
          stripe_connect_account_id: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          availability_mode?: Database["public"]["Enums"]["availability_mode"]
          created_at?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          minimum_payout_floor_cents?: number
          payout_threshold_cents?: number
          quiet_hours?: Json
          resource_caps?: Json
          stripe_connect_account_id?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          availability_mode?: Database["public"]["Enums"]["availability_mode"]
          created_at?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          minimum_payout_floor_cents?: number
          payout_threshold_cents?: number
          quiet_hours?: Json
          resource_caps?: Json
          stripe_connect_account_id?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      recovery_events: {
        Row: {
          deployment_id: string | null
          detected_at: string
          event_type: Database["public"]["Enums"]["recovery_event_type"]
          id: string
          node_id: string | null
          recovered_at: string | null
          recovery_ms: number | null
        }
        Insert: {
          deployment_id?: string | null
          detected_at?: string
          event_type: Database["public"]["Enums"]["recovery_event_type"]
          id?: string
          node_id?: string | null
          recovered_at?: string | null
          recovery_ms?: number | null
        }
        Update: {
          deployment_id?: string | null
          detected_at?: string
          event_type?: Database["public"]["Enums"]["recovery_event_type"]
          id?: string
          node_id?: string | null
          recovered_at?: string | null
          recovery_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recovery_events_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recovery_events_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      service_listings: {
        Row: {
          active: boolean
          availability: Database["public"]["Enums"]["availability_state"]
          cpu_tier: string | null
          created_at: string
          gpu_model: string | null
          gpu_tier: string | null
          hosting_operator: Database["public"]["Enums"]["hosting_operator"]
          hourly_usd: number
          id: string
          memory_gb: number | null
          network_tier: string | null
          node_id: string | null
          product_type: Database["public"]["Enums"]["product_type"]
          region: string
          reliability: Database["public"]["Enums"]["reliability_class"]
          storage_gb: number | null
          storage_tier: string | null
          title: string
          vcpu: number | null
          vram_gb: number | null
        }
        Insert: {
          active?: boolean
          availability?: Database["public"]["Enums"]["availability_state"]
          cpu_tier?: string | null
          created_at?: string
          gpu_model?: string | null
          gpu_tier?: string | null
          hosting_operator?: Database["public"]["Enums"]["hosting_operator"]
          hourly_usd: number
          id?: string
          memory_gb?: number | null
          network_tier?: string | null
          node_id?: string | null
          product_type: Database["public"]["Enums"]["product_type"]
          region: string
          reliability?: Database["public"]["Enums"]["reliability_class"]
          storage_gb?: number | null
          storage_tier?: string | null
          title: string
          vcpu?: number | null
          vram_gb?: number | null
        }
        Update: {
          active?: boolean
          availability?: Database["public"]["Enums"]["availability_state"]
          cpu_tier?: string | null
          created_at?: string
          gpu_model?: string | null
          gpu_tier?: string | null
          hosting_operator?: Database["public"]["Enums"]["hosting_operator"]
          hourly_usd?: number
          id?: string
          memory_gb?: number | null
          network_tier?: string | null
          node_id?: string | null
          product_type?: Database["public"]["Enums"]["product_type"]
          region?: string
          reliability?: Database["public"]["Enums"]["reliability_class"]
          storage_gb?: number | null
          storage_tier?: string | null
          title?: string
          vcpu?: number | null
          vram_gb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_listings_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      service_rates: {
        Row: {
          host_pool_rate_usd: number
          id: string
          label: string
          product: Database["public"]["Enums"]["product_type"]
          service_key: string
        }
        Insert: {
          host_pool_rate_usd: number
          id?: string
          label: string
          product: Database["public"]["Enums"]["product_type"]
          service_key: string
        }
        Update: {
          host_pool_rate_usd?: number
          id?: string
          label?: string
          product?: Database["public"]["Enums"]["product_type"]
          service_key?: string
        }
        Relationships: []
      }
      status_components: {
        Row: {
          description: string | null
          id: string
          name: string
          sort_order: number
          state: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          state?: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          state?: string
        }
        Relationships: []
      }
      status_incidents: {
        Row: {
          body: string | null
          id: string
          resolved_at: string | null
          severity: string
          started_at: string
          state: string
          title: string
        }
        Insert: {
          body?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string
          started_at?: string
          state?: string
          title: string
        }
        Update: {
          body?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string
          started_at?: string
          state?: string
          title?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_admin_id: string | null
          body: string | null
          created_at: string
          id: string
          priority: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          assigned_admin_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          assigned_admin_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      tier_config: {
        Row: {
          category: Database["public"]["Enums"]["tier_category"]
          id: string
          qualification: Json
          tier_code: string
          updated_at: string
          updated_by_admin_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["tier_category"]
          id?: string
          qualification?: Json
          tier_code: string
          updated_at?: string
          updated_by_admin_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["tier_category"]
          id?: string
          qualification?: Json
          tier_code?: string
          updated_at?: string
          updated_by_admin_id?: string | null
        }
        Relationships: []
      }
      usage_samples: {
        Row: {
          cpu_pct: number | null
          deployment_id: string
          id: string
          mem_mb: number | null
          metered_seconds: number
          sampled_at: string
        }
        Insert: {
          cpu_pct?: number | null
          deployment_id: string
          id?: string
          mem_mb?: number | null
          metered_seconds?: number
          sampled_at?: string
        }
        Update: {
          cpu_pct?: number | null
          deployment_id?: string
          id?: string
          mem_mb?: number | null
          metered_seconds?: number
          sampled_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_samples_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      customer_wallet_balances: {
        Row: {
          balance_cents: number | null
          customer_id: string | null
        }
        Relationships: []
      }
      provider_earnings_totals: {
        Row: {
          accrued_cents: number | null
          available_cents: number | null
          held_cents: number | null
          provider_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "provider" | "admin"
      availability_mode: "background" | "idle" | "reserved" | "verified"
      availability_state: "Available" | "Limited" | "Unavailable"
      deployment_status:
        | "draft"
        | "pending"
        | "queued"
        | "deploying"
        | "running"
        | "degraded"
        | "stopping"
        | "stopped"
        | "failed"
      hosting_operator: "peer" | "coreport"
      kyc_status: "unsubmitted" | "pending" | "approved" | "rejected"
      ledger_actor_type: "customer" | "provider" | "platform"
      ledger_entry_type: "debit" | "credit" | "fee"
      node_status: "online" | "offline" | "draining"
      payout_status: "pending" | "held" | "paid" | "failed"
      product_type: "cpu_compute" | "gpu_compute" | "storage" | "game_server"
      recovery_event_type:
        | "failure_detected"
        | "recovery_started"
        | "recovered"
        | "escalated"
      reliability_class: "Standard" | "High" | "Verified" | "Certified"
      tier_category: "cpu" | "gpu" | "storage" | "network"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "provider", "admin"],
      availability_mode: ["background", "idle", "reserved", "verified"],
      availability_state: ["Available", "Limited", "Unavailable"],
      deployment_status: [
        "draft",
        "pending",
        "queued",
        "deploying",
        "running",
        "degraded",
        "stopping",
        "stopped",
        "failed",
      ],
      hosting_operator: ["peer", "coreport"],
      kyc_status: ["unsubmitted", "pending", "approved", "rejected"],
      ledger_actor_type: ["customer", "provider", "platform"],
      ledger_entry_type: ["debit", "credit", "fee"],
      node_status: ["online", "offline", "draining"],
      payout_status: ["pending", "held", "paid", "failed"],
      product_type: ["cpu_compute", "gpu_compute", "storage", "game_server"],
      recovery_event_type: [
        "failure_detected",
        "recovery_started",
        "recovered",
        "escalated",
      ],
      reliability_class: ["Standard", "High", "Verified", "Certified"],
      tier_category: ["cpu", "gpu", "storage", "network"],
    },
  },
} as const
