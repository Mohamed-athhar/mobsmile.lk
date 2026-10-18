// Client-side error reporting hook.
//
// Errors are logged to the browser console. To forward them to a monitoring
// service (Sentry, LogRocket, etc.), call it from inside this function.
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[error-reporting]", message, { stack, route: window.location.pathname, ...context });
}
