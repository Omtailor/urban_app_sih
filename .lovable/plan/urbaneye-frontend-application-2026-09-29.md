# UrbanEye Frontend Application

## Goal
Build the complete responsive UrbanEye smart-city operations prototype, using the uploaded mockup as the visual source of truth. The app will be frontend-only, run entirely on local mock data and shared React state, and open at `/dashboard`.

## Product structure
- Create the shared command-center shell: collapsible navy sidebar, responsive mobile drawer, page-aware header, live clock, operational status, notification panel, and admin menu.
- Add complete routes for Dashboard, Live Map, Alerts, Issues, Issue Details, Analytics, and Settings; redirect `/` to `/dashboard`.
- Match the reference’s dense civic-operations hierarchy: light blue workspace, compact white panels, blue active navigation, severity colors, map-first layouts, restrained motion, and readable data density.

## Core experience
- Seed 40+ varied Mumbai demo issues, 15+ alerts, 20+ activity events, and 30 days of analytics data.
- Centralize issues, alerts, activities, settings, notifications, and simulation controls so every screen updates together.
- Implement live simulation controls with start/pause, speed selection, issue-type selection, and immediate issue generation.
- Make generated issues update markers, counts, charts, alerts, activity, bell state, and toast notifications in real time.
- Persist appropriate UI preferences, simulation settings, and changed issue statuses locally.

## Screens
- **Dashboard:** animated KPI cards, dominant Mumbai monitoring map, recent alerts, activity timeline, issue distribution, resolution chart, and service health.
- **Live Map:** map with severity markers, corridor overlays, popups, legend, controls, and working filter drawer/panel.
- **Alerts:** searchable severity tabs, counts, readable alert rows/cards, and issue navigation.
- **Issues:** combined search/filter/sort controls, working 10-row pagination, desktop table, and mobile cards.
- **Issue Details:** image gallery, summary, confidence meter, timeline, assignment dialog, and synchronized status actions.
- **Analytics:** responsive category, trend, priority, and area charts plus resolution KPIs.
- **Settings:** functional interface, simulation, and notification preferences stored locally.

## Technical approach
- Use TanStack Router’s existing file-based routing rather than adding another router.
- Use React context and focused hooks/components; no backend, API routes, authentication, database, or external AI calls.
- Add Leaflet/React Leaflet for the working OpenStreetMap display, Recharts for charts, Motion for restrained transitions, Lucide for icons, and Sonner for notifications.
- Dynamically load the browser-only map implementation so server rendering remains stable.
- Define the complete semantic color, spacing, typography, elevation, and status system in `src/styles.css` using Tailwind v4 tokens.
- Use generated/local issue imagery with safe fallback handling; the uploaded composite remains a design reference rather than an embedded screenshot.

## Quality checks
- Verify every visible control has a meaningful local interaction and every route has unique page metadata.
- Test the primary demo flow: generate issue → inspect details → assign/change status → confirm dashboard, map, alerts, issues, activity, and analytics synchronize.
- Check desktop and mobile layouts, map rendering, filters, sorting, pagination, notification panel, dialogs, loading/empty/error states, and browser console.
- Confirm the preview build reports no errors and no page has horizontal overflow.
