type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  
  // Log error to console for debugging
  console.error("Error reported:", {
    error,
    context: {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    options: {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  });

  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  console.error("Error details:", {
    message,
    ...(stack !== undefined && { stack }),
    filename: window.location.pathname,
  });
}
