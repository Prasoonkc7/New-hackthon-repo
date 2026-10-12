# JalRakshak Codebase Audit

**Audit date:** 2026-10-12  
**Audited app:** `Frontend/`  
**Scope:** Follow-up implementation audit after the Phase 1 implementation.

## Executive summary

The source-of-truth specification is present as [`Project_scope.md`](<C:/Users/Prasoon kc/Documents/Jalrakshak/Project_scope.md>) rather than `PROJECT_SPEC.md`. It defines Phase 1 as global layout/navigation, homepage, dashboard, interactive map, emergency SOS form, and community reporting.

The current product has a substantial Phase 1 slice, but is not yet fully compliant with the supplied specification:

- Shared navigation/footer includes the Phase 1 links, language toggle, emergency CTA, responsive mobile menu, and translated demo/backend mode labels.
- The home page includes quick actions, demo labeling, alert cards, and query loading/empty/error states.
- The dashboard includes service-backed metrics, district/severity filters, Recharts visualizations, alert listings, and query states.
- The map includes Leaflet markers, legend, district/type/verified filters, selection details, demo labeling, and query states.
- Emergency-help and hazard-report forms include Zod validation, service-backed confirmation, local drafts, offline messaging, errors, and success states.
- The exact specification additionally requires six homepage quick actions, preparedness content, a more comprehensive dashboard, map search/current-location controls, and `/report` as an accepted emergency-request route.
- `npm install` and `npm run build` both succeed.

## 1. Routes

Since `PROJECT_SPEC.md` is missing, the table below reports every route currently present in the application and its observable implementation state. Spec-route coverage is **not verifiable** until the spec is restored.

| Route | File | Status | Evidence |
|---|---|---|---|
| `/` | `src/routes/index.tsx` | Partly built | Hero, demo badge, emergency-help/map CTAs, five quick actions, alert cards, and query loading/empty/error handling. The spec also requires food/water and recovery actions plus preparedness content. |
| `/about` | `src/routes/about.tsx` | Exists, not built | Only page header and `This section is not built yet.` |
| `/admin` | `src/routes/admin.tsx` | Exists, not built | Only page header and empty placeholder; no role guard or verification workflows. |
| `/dashboard` | `src/routes/dashboard.tsx` | Partly built | Metrics, district/severity filters, hazard/severity Recharts charts, alert list, demo labeling, and query states. The spec also requires six summary metrics, an interactive map, reports/rescues/shelter/relief/recovery/activity sections, and more filters. |
| `/login` | `src/routes/login.tsx` | Exists, not built | Only page header and empty placeholder; `AuthProvider` has demo sign-in logic but the route has no form. |
| `/map` | `src/routes/map.tsx` | Partly built | Interactive Leaflet map, legend, district/type/verified filters, selectable list/detail view, demo labeling, and query states. Municipality search and current-location control remain. |
| `/preparedness` | `src/routes/preparedness.tsx` | Exists, not built | Translation keys for preparedness copy exist, but the route renders only a placeholder. |
| `/recovery` | `src/routes/recovery.tsx` | Exists, not built | No application form, list, status timeline, or role-based view. |
| `/relief` | `src/routes/relief.tsx` | Exists, not built | No request list, provider inventory, matching, or forms. |
| `/report-hazard` | `src/routes/report-hazard.tsx` | Partly built | Zod-validated hazard/location/time/evidence form, local drafts, offline notice, service error, and post-confirmation success state. Reporter contact fields, actual image upload, duplicate detection, and the community disclaimer remain. |
| `/report` | — | Missing | The specification lists `/report` as an accepted emergency-request route in addition to `/request-help`. |
| `/request-help` | `src/routes/request-help.tsx` | Partly built | SOS warning, Zod-validated request form, local drafts, offline notice, service error, reference confirmation after service success, and tracking handoff. Actual photo upload, file validation, browser geolocation, and confirmation timeline remain. |
| `/shelters` | `src/routes/shelters.tsx` | Exists, not built | No shelter list/map, filters, capacity/resource details, or update workflow. |
| `/track` | `src/routes/track.tsx` | Exists, not built | No reference lookup, timeline, ownership/privacy checks, or not-found state. |

`src/routeTree.gen.ts` includes all of the above routes, so there are no missing route files relative to the current navigation shell. It is generated and should not be edited manually.

## 2. Page-by-page sections, forms, filters, and states

The required sections cannot be checked against the absent spec. The concrete implementation audit is:

| Page | Required/product surface expected | Done | Missing |
|---|---|---|---|
| Home | Hero, emergency CTA, map CTA, official warning | Done: hero, demo badge, quick actions, alert section, query states | Preparedness content remains for later work |
| Live map | Map, legend, marker types, filters, list/detail view, freshness, loading/empty/error | Done: Leaflet route wiring, translated legend, type/district/verified filters, list/detail selection, query states, demo label | Municipality/status/freshness filters remain |
| Dashboard | KPIs, alerts, charts, district/time filters, loading/empty/error | Done: KPIs, alert list, district/severity filters, Recharts charts, query states | Time-range filters remain |
| Shelters | Search/filter, district/municipality filters, capacity/resources, verified/freshness state, map/list | Data types and service methods exist | Entire page and all states/actions |
| Hazard report | Hazard/location/description/observed-time/image fields, validation, duplicate warning, offline draft, confirmed response | Done: React Hook Form/Zod, location/evidence fields, local draft, offline notice, API confirmation/error/success | Duplicate detection and real image upload remain |
| Emergency help | SOS warning, category/urgency/contact/people/location/details, privacy notice, validation, offline draft, confirmed reference | Done: warning, form validation, approximate location, local draft, offline notice, API confirmation/error/success | Background retry queue remains |
| Track request | Reference lookup, status timeline, loading/empty/error/not-found, privacy/ownership | `getRescueByReference` and `StatusTimeline` exist | Entire page and lookup workflow |
| Relief | Public requests, provider inventory, filters, matching/status updates, role-specific actions | Types and mock methods exist | Entire page, forms, filters, role gates, states |
| Recovery | Application form, evidence, loss/type fields, applicant list, timeline/decision state | Types and mock methods exist | Entire page, validation, evidence upload, ownership, admin decision UI |
| Preparedness | Before/during/after guidance, official-source disclaimer | Translation keys exist | Route rendering, translated sections, source links and demo/educational labeling |
| Admin | Role guard, report/rescue/shelter/recovery review, verification, status updates, activity log | Service methods and `useAuth.can` exist | Actual guard, tables, actions, audit/activity UI and states |
| Login | Sign-in fields/role behavior, errors, session state | Demo auth context exists | Login form, translated labels/errors, real backend integration and route behavior |
| About/privacy | Product disclaimer, data/privacy explanation, demo limitations, official sources | Footer contains some disclaimer/source links | Full page content and translated copy |

Reusable `QueryState`, `ListSkeleton`, `EmptyState`, `ErrorState`, `OfflineBar`, status badges, and timelines are now used by the Phase 1 home, dashboard, and map surfaces; both Phase 1 forms provide validation/loading/error/success states.

## 3. Cross-cutting status

### API service layer

**Implemented for Phase 1 surfaces.** `src/services/api.ts` centralizes reads and mutations behind an `ApiService` interface and selects either:

- HTTP mode using `VITE_API_BASE_URL`, or
- mock mode when no base URL is configured.

The interface covers alerts, reports, rescue, shelters, facilities, relief, inventory, recovery, and activity. React Query hooks in `src/hooks/use-data.ts` wrap the reads and provide a generic mutation helper. However:

- Home, dashboard, and map call the read hooks; the two Phase 1 forms call the service mutations.
- HTTP methods accept `actor` parameters in the TypeScript interface but do not transmit them; the backend must derive identity from authentication.
- HTTP responses are cast to domain types without runtime validation.
- There is no visible authentication token/session integration for the backend adapter.

### Mock-data services

**Implemented as a useful demo adapter.** `src/services/mock-data.ts` seeds typed fictional records and `api.ts` persists the demo database in browser local storage. It strips rescue names and phone numbers before persistence. Mutations return delayed cloned results and append activity records.

Gaps:

- Most records are marked `isDemo`, but the UI that would show them is absent.
- The global demo warning is visible on the home page only; feature pages must repeat or inherit an unmistakable `Demo Data — Not Live Emergency Information` label when displaying records.
- Mock mode has no simulated failure controls, so error states are difficult to exercise manually.

### TypeScript types

**Good domain coverage, not runtime-safe end to end.** `src/lib/types.ts` defines core entities and status unions for alerts, reports, rescue, shelters, relief, inventory, recovery, facilities, activity, users, roles, and map points. API input types are derived with `Omit`.

Gaps:

- No Zod schemas for API responses or form payloads.
- Backend JSON is trusted through type assertions.
- The absent spec prevents validating whether all required fields/status transitions are represented.

### Translations (English/Nepali)

**Partial.** `src/lib/i18n.tsx` has English keys and a Nepali partial dictionary with fallback to English. Core navigation, demo disclaimer, official warning, status/severity labels, preparedness copy, privacy text, and offline text are translated.

Gaps:

- Most page headings, descriptions, footer labels, role labels, map legend labels, source strings, metadata, and error-boundary text are hard-coded English.
- No route content exists to exercise the dictionaries.
- `ROLE_LABEL` is English-only.
- The language toggle's accessible label is hard-coded bilingual text rather than a dictionary key.

### Role-based UI

**Scaffold only.** `AuthProvider` supports demo roles (`public`, `citizen`, `responder`, `provider`, `admin`) in session storage, and the header conditionally shows admin navigation for responders/admins. `useMarkers` hides emergency request markers from non-privileged users and rounds privileged request coordinates.

Gaps:

- `/admin` has no actual route guard.
- `/login` cannot select/sign in a role because it has no UI.
- No route-level authorization, ownership checks, or provider/responder/admin action gating exists.
- Demo auth is explicitly not real authorization; backend authorization is not demonstrably connected.

### Map markers, legend, and filters

**Phase 1 implemented.** Leaflet, lazy loading, error boundary, Nepal center, marker kinds/colors/glyphs, verified/unverified styling, tooltips, selection callback, fly-to, user location circle, role-sensitive rescue marker handling, translated legend, and district/type/verified filters are wired into `/map`.

Remaining beyond Phase 1:

- Municipality/status/freshness filters and richer map detail actions are not yet present.

### Dashboard charts

**Phase 1 implemented.** The dashboard uses Recharts for hazard counts and severity distribution, with KPI aggregation, district/severity filters, and loading/empty/error states.

### Form validation

**Phase 1 implemented for two public forms.** React Hook Form + Zod validate emergency-help and hazard-report inputs before calling the typed service layer. Server/service errors are displayed and success is rendered only after the promise resolves.

### Offline drafts

**Phase 1 implemented for public forms.** `src/services/drafts.ts` provides explicit local read/write/clear operations; both forms restore drafts, allow manual save/clear, and distinguish local drafts from confirmed submissions. There is not yet a background retry queue or conflict handling.

## 4. Broken imports, TypeScript errors, placeholder links, inactive buttons, fake success

### Build/import status

- `npm run build` completed successfully for client, SSR, and Nitro output.
- No TypeScript or broken-import errors were reported by the production build.
- Generated route code has `@ts-nocheck` as expected for TanStack Router output; it is not evidence of application type safety.
- `npm install` completed successfully and reported zero package vulnerabilities.

### Placeholders and inactive product surfaces

- Every feature route except `/` renders the literal placeholder `This section is not built yet.`.
- No `href="#"` links were found.
- Existing links in the header/footer/home route to real routes or official external sources.
- The root error page has functioning retry and home actions.
- There are no feature-page buttons to audit because the feature pages contain no forms/actions.

### Fake success / prohibited confirmation wording

- The UI does not currently show a fake successful submission because no submission UI exists.
- `status.submitted` is present in the translation dictionary and seeded/mock rescue data, and the mock adapter assigns `submitted` after a delayed promise. This is acceptable as a domain status only if the UI displays it after the service promise resolves; the current routes do not display it.
- The mock activity log says `Submitted shelter update (needs verification)`. This is an internal activity description, but any future UI must avoid presenting “Submitted” before the service/backend promise confirms success.
- `form.savedLocal` correctly says “not submitted”; preserve that distinction when implementing drafts.

### Hard-coded user-facing text

The route headings, metadata, placeholder text, root error/404 text, header role labels, footer labels, map metadata, service-source strings, and map failure message bypass `useI18n`. This conflicts with the stated requirement that all user-facing text go through English/Nepali dictionaries.

## 5. Validation commands

Commands were run from `C:\Users\Prasoon kc\Documents\Jalrakshak\Frontend`:

```text
npm install
exit code: 0
result: removed 5 packages, audited 523 packages, found 0 vulnerabilities

npm run build
exit code: 0
result: client, SSR, and Nitro builds completed successfully
```

Non-blocking build warnings:

- Vite reports that `vite-tsconfig-paths` is detected and native `resolve.tsconfigPaths` is available.
- Nitro reports that `inlineDynamicImports` is ignored when code splitting is enabled.

Neither warning caused a TypeScript/build failure.

## Prioritized build order

The exact phase definitions must be recovered from `PROJECT_SPEC.md` before implementation begins. Subject to that limitation, the safest order following the requested Phase 1 → 2 → 3 sequence is:

### Phase 1 — Core public safety experience

1. Restore/add `PROJECT_SPEC.md` and turn its route/acceptance criteria into implementation checklists.
2. Build the public live map route: wire queries and `useMarkers`, add legend, filters, list/detail panel, freshness, demo label, and all query states.
3. Build shelters with list/map views, district/municipality and resource filters, capacity/occupancy, verification/freshness, and loading/empty/error states.
4. Build the emergency-help and hazard-report forms with React Hook Form + Zod, privacy/official emergency warnings, geolocation/image handling as specified, and confirmation only after API success.
5. Add offline draft persistence and recovery for both public forms; distinguish “saved locally” from “submitted”.
6. Build request tracking with reference lookup, not-found/error/loading states, and a translated status timeline.
7. Make all public text and labels use complete English/Nepali dictionaries, including metadata, role labels, map legend, errors, and footer/about content.

### Phase 2 — Coordination and recovery

1. Build the dashboard with API-backed KPIs, alert summaries, filters, and Recharts visualizations.
2. Build relief request/provider inventory flows, matching, status transitions, role-specific actions, and confirmation/error states.
3. Build recovery applications, evidence handling, applicant ownership, status history, and decision notes.
4. Build login/demo-role UI and enforce route/action visibility consistently for citizen, responder, provider, and admin roles.
5. Add runtime Zod validation for HTTP responses and explicit service error handling.

### Phase 3 — Governance and operational completeness

1. Build admin verification/review screens for reports, rescue requests, shelters, relief, and recovery, including activity/audit history.
2. Add backend-backed authentication/authorization and ownership/privacy enforcement; do not treat demo `sessionStorage` roles as security.
3. Add robust retry/offline synchronization, conflict handling, mock failure scenarios, and tests for every loading/empty/error/success path.
4. Add route-level and component-level tests covering translations, role gates, map filters, form validation, no-fake-success behavior, and demo labeling.
5. Re-run `npm run build`, lint, and the test suite after each phase and update this audit against the restored spec.
## Live disaster information integration (current)

- **Backend weather proxy:** Done. `GET /api/weather?lat=&lon=` validates coordinates, calls Open-Meteo server-side, normalizes current/hourly/daily forecast data, caches responses, and returns an honest unavailable response on provider failure.
- **Dashboard integration:** Done. The existing dashboard now shows current conditions, a five-day forecast, source, retrieval time, forecast safety note, loading state, retry state, and unavailable state. It refreshes at most every five minutes.
- **Data integrity:** Done for the new weather surface. Forecasts are explicitly not flood warnings; seeded alerts/incidents remain labeled demo/database data. No DHM/NDRRMA machine-readable warning feed was added without a verified endpoint.
- **Configuration/documentation:** Done. Backend `.env.example` and README document provider URL, timeout, cache interval, limitations, and no-key default configuration.
- **Tests/build:** Backend weather validation and normalization tests added. Backend tests and frontend production build pass; existing Vite/Nitro configuration warnings remain non-blocking.

## Master-prompt implementation update (2026-10-12)

### Fully working or connected

- Authentication now uses the Flask JWT login/register/me endpoints when `VITE_API_BASE_URL` is configured; the token is held in session storage and sent by the centralized API client.
- Citizen login/registration UI is available at `/login`.
- SOS request submission, server persistence, owner/admin access rules, request tracking by reference, and admin status updates are connected.
- Community report submission, server persistence, admin verification, and map/dashboard consumption are connected.
- Dashboard, weather proxy, map, and shelter directory are connected to the service layer with loading, empty, error, and freshness states.
- Admin review surface is available at `/admin` for report verification and rescue status coordination, with server-side role enforcement.
- Public rescue responses now omit contact details, exact locations, and private ownership fields unless the caller is the owner or an authorized role.
- Public hazard report responses no longer expose reporter identifiers.

### Partially implemented or remaining

- `/relief`, `/recovery`, `/preparedness`, and `/about` remain placeholder pages; backend service contracts exist for relief and recovery but their full forms/review UX are not yet wired.
- Shelter provider update controls exist in the backend service contract but are not exposed as a complete provider management workflow in the frontend.
- File uploads/evidence storage, notifications, pagination, search by municipality, and responder-specific assignment queues are not complete.
- Official DHM/NDRRMA machine-readable warning feeds were not added because a verified public endpoint and access contract were not available during inspection.
- The current demo adapter remains intentionally available when `VITE_API_BASE_URL` is unset; demo records are labeled and must not be interpreted as live emergency information.

### Validation

- Backend: `7 passed` with only existing short-test-secret JWT warnings.
- Frontend: `npm run build` passed.

### Completed in the follow-up implementation

- **Preparedness:** Replaced the placeholder with translated before/during/after flood guidance, emergency-kit checklist, and safety notice.
- **About and privacy:** Replaced the placeholder with mission, privacy, data-source, and safety sections.
- **Relief coordination:** Added a typed relief request form, available-inventory list, request list, validation, loading, empty, error, and success states.
- **Recovery applications:** Added a typed application form, reference confirmation, application status list, validation, loading, empty, error, and success states.
- **Recovery privacy:** Backend recovery listings are now restricted to the owner or administrator instead of exposing every application publicly.
- **Notifications:** Added authenticated in-app notifications for report, rescue, and recovery status changes. The header shows an unread count and allows users to mark notifications read. No external messaging provider is used.
- **Evidence uploads:** Added optional JPG, PNG, WebP, and PDF uploads to hazard reports, rescue requests, and recovery applications. Uploads are limited to 5 MB, stored under a private randomized filename, and exposed only through boolean metadata. No public file-serving endpoint was added.
- **Shelter management:** Shelter updates now require provider/admin authorization, validate occupancy and facility booleans, mark changes unverified, and expose admin controls for updating and re-verifying shelter records.
