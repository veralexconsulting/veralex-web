// Generated from 202610090001_workspace_schema.sql by scripts/generate-workspace-types.mjs.
// Regenerate after migration edits. Live Supabase types should replace this schema-derived file after deployment.
export interface WorkspaceDatabase {
  public: {
    Tables: {
    profiles: {
      Row: {
      id: string;
      email: string;
      full_name: string;
      role: string;
      active: boolean;
      must_change_password: boolean;
      created_by: string | null;
      created_at: string;
      updated_at: string;
      };
    };
    clients: {
      Row: {
      id: string;
      name: string;
      email: string;
      phone: string;
      created_by: string | null;
      updated_by: string | null;
      created_at: string;
      updated_at: string;
      };
    };
    workspace_services: {
      Row: {
      slug: string;
      name: string;
      active: boolean;
      created_at: string;
      };
    };
    workflow_templates: {
      Row: {
      id: string;
      service_slug: string;
      version: number;
      status: string;
      legal_review_required: boolean;
      created_by: string | null;
      created_at: string;
      published_at: string | null;
      };
    };
    workflow_template_steps: {
      Row: {
      id: string;
      template_id: string;
      position: number;
      title: string;
      description: string;
      client_label: string;
      client_visible: boolean;
      waiting_kind: string;
      completion_criteria: string;
      };
    };
    workflow_template_tasks: {
      Row: {
      id: string;
      step_id: string;
      position: number;
      title: string;
      conditional: boolean;
      };
    };
    projects: {
      Row: {
      id: string;
      reference: string;
      client_id: string;
      service_slug: string;
      workflow_template_id: string;
      workflow_version: number;
      title: string;
      status: string;
      pic_user_id: string;
      created_by: string;
      updated_by: string;
      start_at: string | null;
      follow_up_at: string | null;
      internal_notes: string;
      created_at: string;
      updated_at: string;
      };
    };
    project_supporting_admins: {
      Row: {
      project_id: string;
      admin_user_id: string;
      };
    };
    project_steps: {
      Row: {
      id: string;
      project_id: string;
      source_template_step_id: string | null;
      position: number;
      title: string;
      description: string;
      client_label: string;
      client_visible: boolean;
      waiting_kind: string;
      completion_criteria: string;
      created_at: string;
      };
    };
    project_tasks: {
      Row: {
      id: string;
      step_id: string;
      position: number;
      title: string;
      conditional: boolean;
      status: string;
      note: string;
      due_at: string | null;
      updated_by: string | null;
      updated_at: string;
      };
    };
    project_access_links: {
      Row: {
      id: string;
      project_id: string;
      token_hash: string;
      status: string;
      expires_at: string;
      created_by: string;
      claimed_by: string | null;
      claimed_at: string | null;
      revoked_at: string | null;
      created_at: string;
      };
    };
    client_project_access: {
      Row: {
      id: string;
      project_id: string;
      client_user_id: string;
      granted_at: string;
      revoked_at: string | null;
      revoked_by: string | null;
      };
    };
    project_updates: {
      Row: {
      id: string;
      project_id: string;
      actor_user_id: string;
      message: string;
      client_visible: boolean;
      created_at: string;
      };
    };
    audit_logs: {
      Row: {
      id: string;
      actor_user_id: string | null;
      project_id: string | null;
      event_type: string;
      message: string;
      created_at: string;
      };
    };
    priority_offerings: {
      Row: {
      id: string;
      singleton: boolean;
      enabled: boolean;
      service_slugs: string[];
      stage_keys: string[];
      title: string;
      description: string;
      commitment: string;
      limitations: string;
      terms: string;
      price_idr: number;
      updated_by: string | null;
      updated_at: string;
      };
    };
    priority_requests: {
      Row: {
      id: string;
      project_id: string;
      client_user_id: string;
      status: string;
      quoted_price_idr: number;
      reviewed_by: string | null;
      reviewed_at: string | null;
      created_at: string;
      updated_at: string;
      };
    };
    workspace_payments: {
      Row: {
      id: string;
      priority_request_id: string;
      provider: string;
      provider_reference: string;
      amount_idr: number;
      status: string;
      confirmed_at: string | null;
      created_at: string;
      };
    };
    payment_webhook_events: {
      Row: {
      id: string;
      provider: string;
      provider_event_id: string;
      payment_id: string;
      processed_at: string;
      };
    };
    notifications: {
      Row: {
      id: string;
      recipient_user_id: string;
      project_id: string | null;
      event_type: string;
      title: string;
      message: string;
      target_path: string;
      dedupe_key: string | null;
      read_at: string | null;
      created_at: string;
      };
    };
    notification_outbox: {
      Row: {
      id: string;
      notification_id: string;
      channel: string;
      status: string;
      attempts: number;
      next_attempt_at: string;
      last_error: string | null;
      created_at: string;
      };
    };
    workspace_rate_limits: {
      Row: {
      key_hash: string;
      action: string;
      window_start: string;
      attempts: number;
      };
    };
    };
  };
}
