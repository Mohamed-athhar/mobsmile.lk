/**
 * Client for the `ai-gateway` Supabase Edge Function.
 *
 * Browser code NEVER holds an AI provider key. The Edge Function owns the
 * keys for up to three configured AI services (slots 1–3), authenticates the
 * signed-in user, rate-limits, and talks to the provider. See the backend
 * package's README for how the three slots are configured.
 *
 *   const { reply } = await askAi([{ role: "user", content: "Best phone under 150k?" }]);
 */
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AiRole = "user" | "assistant";

export interface AiMessage {
  role: AiRole;
  content: string;
}

/** Server-defined tasks (each has its own fixed system prompt). */
export type AiTask = "shop_assistant";

/** Which configured service to use. Omit to let the gateway try 1 → 2 → 3. */
export type AiSlot = 1 | 2 | 3;

export interface AiReply {
  reply: string;
  /** Slot that produced the reply. */
  provider: AiSlot;
  /** Human-readable label of that slot (e.g. "Claude"). */
  label: string;
}

export class AiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "AiError";
    this.status = status;
    this.code = code;
  }
}

interface GatewayErrorBody {
  error?: { code?: string; message?: string };
}

export async function askAi(
  messages: AiMessage[],
  options: { task?: AiTask; provider?: AiSlot } = {},
): Promise<AiReply> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new AiError("Please sign in to use the assistant.", 401, "auth_required");
  }

  const body: Record<string, unknown> = {
    task: options.task ?? "shop_assistant",
    messages,
  };
  if (options.provider !== undefined) body["provider"] = options.provider;

  const { data, error } = await supabase.functions.invoke<AiReply>("ai-gateway", { body });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = (await error.context.json().catch(() => null)) as GatewayErrorBody | null;
      throw new AiError(
        payload?.error?.message ?? "The assistant is unavailable right now.",
        error.context.status,
        payload?.error?.code,
      );
    }
    throw new AiError("Could not reach the assistant. Check your connection and try again.");
  }
  if (!data?.reply) throw new AiError("The assistant returned an empty reply.");
  return data;
}
