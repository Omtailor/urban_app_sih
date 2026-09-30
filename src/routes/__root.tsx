import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { AppProvider } from "@/context/app-context";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
function NotFoundComponent() { return <div className="grid min-h-screen place-items-center bg-background p-6 text-center"><div><p className="text-7xl font-black text-primary">404</p><h1 className="mt-3 text-xl font-bold">Page not found</h1><p className="mt-2 text-sm text-muted-foreground">This operations page does not exist.</p><Button asChild className="mt-5"><Link to="/dashboard">Return to dashboard</Link></Button></div></div>; }
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) { const router = useRouter(); useEffect(() => reportError(error, { boundary: "urbaneye_root" }), [error]); return <div className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="text-xl font-bold">This page didn’t load</h1><p className="mt-2 text-sm text-muted-foreground">The interface encountered a temporary problem.</p><Button className="mt-5" onClick={() => { router.invalidate(); reset(); }}>Try again</Button></div></div>; }
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" }, { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }, { rel: "icon", href: "/favicon.ico" }] }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><AppProvider><AppShell><Outlet /></AppShell><Toaster richColors position="top-right" /></AppProvider></QueryClientProvider>; }
