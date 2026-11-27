// Admin: a role on the normal account (Supabase app_metadata.role = "admin"), never a separate login.
// The role only grants anything because Supabase functions and the backend check it on the server;
// the UI uses it to decide what to show. See backend/supabase/admin.sql and backend/app/api/routes/admin.py.
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import type { CommunityPost } from "@/lib/types/community";

export const isAdmin = (user: User | null | undefined) => user?.app_metadata?.role === "admin";

export interface Overview {
  users: number;
  new_7d: number;
  active_7d: number;
  suspended: number;
  admins: number;
  open_reports: number;
}
export interface BoardStats {
  posts: number;
  posts_7d: number;
  replies: number;
  learners: number;
  active_learners_7d: number;
}
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  suspended: boolean;
}
export interface Report {
  id: string;
  reporter_id: string;
  target_type: "post" | "comment";
  target_id: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  created_at: string;
}
export interface ReportedContent {
  exists: boolean;
  kind?: "post" | "comment";
  post_id?: string;
  content?: string;
  created_at?: string;
  author?: { id: string; full_name: string };
}
export interface AuditEntry {
  id: number;
  admin_email: string | null;
  action: string;
  target: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const unwrap = <T>({ data, error }: { data: T | null; error: { message: string } | null }): T => {
  if (error) throw new Error(error.message);
  return data as T;
};

export const adminApi = {
  overview: async () => unwrap<Overview>(await supabase.rpc("admin_overview")),
  boardStats: () => apiClient.get("/admin/stats") as Promise<BoardStats>,
  users: async (q = "", offset = 0) => unwrap<AdminUser[]>(await supabase.rpc("admin_list_users", { q, lim: 50, off: offset })),
  setSuspended: async (id: string, suspend: boolean) => unwrap(await supabase.rpc("admin_set_suspended", { target: id, suspend })),

  reports: async (status: Report["status"] = "open") =>
    unwrap<Report[]>(await supabase.from("content_reports").select("*").eq("status", status).order("created_at", { ascending: false }).limit(100)),
  content: (kind: "post" | "comment", id: string) => apiClient.get(`/admin/content/${kind}/${encodeURIComponent(id)}`) as Promise<ReportedContent>,
  /** Close every open report on the same item at once. */
  closeReports: async (target: Pick<Report, "target_type" | "target_id">, status: "resolved" | "dismissed", by: string) =>
    unwrap(
      await supabase
        .from("content_reports")
        .update({ status, resolved_by: by, resolved_at: new Date().toISOString() })
        .eq("target_type", target.target_type)
        .eq("target_id", target.target_id)
        .eq("status", "open")
    ),

  posts: (q = "", offset = 0) => apiClient.get(`/admin/posts?q=${encodeURIComponent(q)}&limit=25&offset=${offset}`) as Promise<CommunityPost[]>,
  deletePost: (id: string) => apiClient.delete(`/admin/posts/${encodeURIComponent(id)}`),
  deleteComment: (id: string) => apiClient.delete(`/admin/comments/${encodeURIComponent(id)}`),

  audit: async () => unwrap<AuditEntry[]>(await supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(100)),
  log: async (adminId: string, action: string, target: string, details: Record<string, unknown> = {}) =>
    unwrap(await supabase.from("admin_audit_log").insert({ admin_id: adminId, action, target, details })),
};

/** Any signed-in learner can report a post or reply once; admins see it in /admin. */
export async function reportContent(targetType: "post" | "comment", targetId: string, reason: string) {
  const { error } = await supabase.from("content_reports").insert({ target_type: targetType, target_id: targetId, reason: reason.trim().slice(0, 500) });
  if (error && error.code !== "23505") throw new Error(error.message); // 23505: already reported, which is fine
}
