import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * One-time bootstrap: the first signed-in person to claim the shop becomes
 * its admin. Once an admin exists, this always refuses — further staff are
 * added from the admin area by an existing admin.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw new Error(countError.message);
    if ((count ?? 0) > 0) {
      return { ok: false as const, reason: "An owner has already been set up for this shop." };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin-only: grant or revoke a role for another account, found by email. */
export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; role: "admin" | "staff"; grant: boolean }) => {
    if (!input.email?.includes("@")) throw new Error("A valid email address is required.");
    if (input.role !== "admin" && input.role !== "staff") throw new Error("Unknown access level.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Only an owner can change team access.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listError) throw new Error(listError.message);
    const target = list.users.find(
      (u) => u.email?.toLowerCase() === data.email.trim().toLowerCase(),
    );
    if (!target) throw new Error("No account found with that email. Ask them to sign up first.");
    if (target.id === context.userId && !data.grant) {
      throw new Error("You cannot remove your own access.");
    }

    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: target.id, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", target.id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const, email: target.email ?? data.email };
  });

/** Staff list with emails (emails live in auth, so this needs elevated access). */
export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isStaff, error: roleError } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (roleError) throw new Error(roleError.message);
    if (!isStaff) throw new Error("Staff access required.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "staff"]);
    if (error) throw new Error(error.message);

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emailById = new Map((list?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    return (roles ?? []).map((r) => ({
      userId: r.user_id,
      role: r.role as "admin" | "staff",
      email: emailById.get(r.user_id) ?? "",
    }));
  });
