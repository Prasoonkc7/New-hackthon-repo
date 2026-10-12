# Build JalRakshak — Nepal Flood Resilience & Recovery Platform

Build a complete, modern, responsive disaster-management web application named **JalRakshak**, focused on flood preparedness, emergency response, rescue coordination, relief distribution, and post-disaster recovery in Nepal.

This project is for a 48-hour hackathon. The website must have a polished, professional UI, functional navigation, interactive maps, working forms, realistic dashboard interactions, and a clean architecture that can later connect to a Flask backend and SQLite/MySQL database.

Do not create just a landing page or static UI mockup. Build a cohesive multi-page frontend with reusable components, realistic workflows, loading states, empty states, form validation, and success/error feedback.

## 1. Mission and target users

The platform serves:

- Citizens affected by floods and landslides.
- People requesting emergency rescue or essential supplies.
- Disaster-response teams and volunteers.
- Shelter managers and relief organizations.
- Government or authorized administrators.
- Families requiring recovery assistance after a disaster.

The main goal is to help users answer five questions:

1. Where is the danger?
2. Who needs urgent assistance?
3. Where can people find verified shelters?
4. Where are food, water, medicine, and relief supplies available?
5. How can affected families track their recovery assistance?

## 2. Technology and project structure

Use the following frontend stack:

- React with TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui components.
- Lucide icons.
- React Router for navigation.
- Leaflet and React Leaflet for interactive maps.
- Recharts for dashboard charts.
- React Hook Form and Zod for form handling and validation.
- A small, reusable API service layer for future Flask integration.

Use clean, modular components and a consistent design system.

Organize the project into pages, components, layouts, hooks, types, utilities, and services.

Create a configurable API base URL using a Vite environment variable such as `VITE_API_BASE_URL`.

Keep all API calls in a dedicated service layer. Do not scatter API requests throughout UI components.

## 3. Visual design

Create a trustworthy, premium-quality disaster-response interface.

Design direction:

- Deep navy: #102D36.
- Teal: #14B8A6.
- Emergency red: #DC2626.
- Warning amber: #F59E0B.
- Soft off-white background: #F8FAFC.
- White cards with subtle borders and restrained shadows.
- Dark navy text with readable secondary text.

Use a modern sans-serif font, consistent spacing, rounded cards, subtle hover transitions, clear typography, and accessible color contrast.

The visual style should combine a professional emergency operations dashboard with a friendly public-service website.

Avoid excessive gradients, unnecessary animations, oversized decorative elements, generic marketing sections, and cluttered dashboards.

Use clear status badges, informative icons, map legends, compact statistics cards, and strong visual hierarchy.

The design must work on desktop, tablet, and mobile.

Use accessible buttons, visible keyboard focus, properly labeled forms, and semantic HTML.

## 4. Global navigation

Create a responsive navigation bar with:

- JalRakshak logo and brand name.
- Home.
- Disaster Dashboard.
- Live Map.
- Request Help.
- Shelters & Relief.
- Recovery.
- Preparedness.
- Language selector for English and Nepali.
- User account menu.
- A prominent red SOS / Request Emergency Help button.

On mobile, use a collapsible navigation menu and a prominent emergency action that remains easy to find.

Include a footer with official information links, project information, privacy information, and a clear statement that JalRakshak is a prototype and is not an official government emergency service.

## 5. Homepage

Create a compelling homepage with:

### Hero section
Headline: "When Disaster Strikes, Every Second Matters."

Supporting text: "One platform for flood alerts, emergency assistance, safe shelters, relief coordination, and recovery support across Nepal."

Primary CTA: "Request Emergency Help"

Secondary CTA: "View Disaster Map"

Add a compact information banner explaining that users should follow official emergency instructions.

### Quick action cards
- Report a Flood or Landslide.
- Request Rescue.
- Find a Shelter.
- Request Food and Water.
- Report Road or Bridge Damage.
- Apply for Recovery Assistance.

### Current situation section
Display current alerts from connected data sources when available.

Each alert should show:
- Alert title.
- District or municipality.
- Hazard type.
- Severity.
- Source.
- Publication time.
- Last-updated time.
- Verification status.

If no live source is connected, display a clear "Demo Data — Not Live Emergency Information" label. Never represent sample data as an actual emergency.

### Preparedness section
Include practical flood-preparedness guidance, emergency-kit checklists, evacuation readiness, and links to official Nepal weather and disaster-information sources.

## 6. Disaster operations dashboard

Route: `/dashboard`

Build a comprehensive emergency operations dashboard.

### Summary cards
- Active verified alerts.
- Pending reports.
- Open rescue requests.
- Available shelters.
- Unfulfilled relief requests.
- Recovery applications awaiting review.

All figures must be derived from available application data, not arbitrary hardcoded numbers presented as real statistics.

### Dashboard sections
- Interactive disaster map.
- Latest verified alerts.
- Recent community reports.
- Urgent rescue requests.
- Shelter capacity overview.
- Relief inventory overview.
- Rescue request status chart.
- Disaster reports by hazard type.
- Recent administrative activity.

Add filters for district, municipality, hazard type, severity, verification status, and date.

Provide clear empty states when no data is available.

## 7. Interactive disaster map

Route: `/map`

Use Leaflet with OpenStreetMap-compatible map tiles.

Display distinct markers for:
- Flood reports.
- Landslides.
- Blocked roads.
- Damaged bridges.
- Emergency requests.
- Shelters.
- Relief centers.
- Medical facilities.

Create a map legend and filters to toggle each marker category.

When a marker is selected, open a detail panel showing its location, description, source, status, report time, and last verification time.

Include:
- Search by district or municipality.
- Current-location button when browser geolocation permission is granted.
- Map zoom controls.
- List view as an accessible alternative.
- Mobile-friendly marker details.
- Loading and map-error states.

Use different marker styles for verified incidents and unverified community reports.

Do not draw a route and claim it is safe merely because a road exists on the map. Display blocked roads when supported by current reports, and show uncertainty when road conditions are unverified.

Use clearly labeled sample coordinates for the demo. Do not invent actual active incidents.

## 8. Flood alerts and external data integration

Create a dedicated alert service that can later integrate with official Nepal disaster-information sources and weather APIs.

Potential data sources:
- Nepal Department of Hydrology and Meteorology: https://www.dhm.gov.np/
- Nepal National Disaster Risk Reduction and Management Authority: https://ndrrma.gov.np/np/
- Open-Meteo weather API: https://open-meteo.com/en/docs

Show rainfall forecasts and weather conditions when successfully retrieved.

Weather forecasts must not be labeled as confirmed flood warnings. Display official warnings separately from forecast data and community reports.

Each data item should include its source, timestamp, and freshness status.

Implement:
- Loading indicators.
- API error handling.
- Retry controls.
- Last-updated timestamps.
- Stale-data warnings.
- A clearly labeled demo fallback.

Do not pretend that an official data feed exists if its availability has not been verified. Do not scrape government sites from the browser.

For the initial frontend, build the integration interface and service functions. If external APIs require credentials or backend endpoints, keep them configurable and provide a mock-data adapter for development.

## 9. Emergency SOS and rescue requests

Route: `/report` and `/request-help`

Build a dedicated emergency-request workflow.

The form should collect:
- Request category.
- Name or optional contact details.
- Phone number when voluntarily provided.
- District and municipality.
- Latitude and longitude, when available.
- Number of people requiring assistance.
- Description of the situation.
- Immediate safety or medical concerns.
- Optional photograph.
- Preferred contact method.

Request categories:
- Immediate rescue.
- Evacuation assistance.
- Medical assistance.
- Stranded family.
- Food and clean water.
- Temporary shelter.
- Other essential needs.

Use clear urgency options, with immediate danger prominently identified.

Allow users to use browser geolocation with permission or manually select a location.

Validate all required fields, restrict attachment sizes and file types, show upload progress when applicable, and display a submission confirmation.

After submission, display a unique request reference and a status timeline:
- Submitted.
- Under Review.
- Assigned.
- Assistance in Progress.
- Resolved.

For immediate danger, prominently advise users to contact appropriate official emergency services when possible. Make clear that submitting a website form does not guarantee rescue or automatically contact emergency responders.

Never claim that a rescue request has been sent unless the backend confirms successful submission.

## 10. Community disaster reporting

Route: `/report-hazard`

Allow users to report:
- Flooding.
- Rising river levels.
- Landslides.
- Blocked roads.
- Damaged bridges.
- Damaged homes.
- Infrastructure damage.
- Other hazards.

Fields:
- Hazard type.
- Location.
- Description.
- Observation time.
- Optional image.
- Reporter contact details, if voluntarily provided.

Each report should have a visible status:
- Unverified.
- Under Review.
- Verified.
- Rejected.
- Resolved.
- Outdated.

Show verification status, source, and last-updated time on the map and report details.

Add duplicate-report detection at the UI/workflow level where feasible. Do not treat repeated reports as automatic proof of an incident.

Include a community-report disclaimer explaining that user-submitted reports may be incomplete or inaccurate until verified.

## 11. Shelter finder

Route: `/shelters`

Build a shelter directory with both card and map views.

Each shelter should show:
- Name.
- District and municipality.
- Address or approximate public location.
- Available capacity and current occupancy, if confirmed.
- Drinking water.
- Food availability.
- Medical support.
- Toilets and sanitation.
- Accessibility information.
- Contact information when authorized for public display.
- Verification status.
- Last-updated timestamp.

Add filters for location, available capacity, medical support, food, water, and accessibility.

Display only shelters that exist in the dataset. Use clearly labeled demo entries until real shelters are verified.

Never mark a shelter as open or a route as safe solely because the data is old.

Include a report-an-update workflow for shelter managers.

## 12. Relief supply coordination

Route: `/relief`

Build a relief directory connecting affected communities with verified relief providers.

Support:
- Food.
- Clean drinking water.
- Blankets and clothing.
- Hygiene kits.
- First-aid supplies.
- Essential medicines.
- Temporary accommodation.
- Other approved relief items.

Users can submit a supply request.

Relief providers can register available inventory and update quantities.

Each request should show:
- Item or service needed.
- Quantity.
- General delivery area.
- Urgency.
- Request status.
- Assigned provider, when applicable.
- Last update.

Request states:
- Pending.
- Reviewed.
- Matched.
- Accepted.
- Dispatched.
- Delivered.
- Cancelled.

Build a coordination view that helps identify unmet needs and available supplies.

Do not advertise an item as available unless a provider has confirmed its availability.

Protect beneficiaries' private contact information and exact locations.

## 13. Recovery assistance portal

Route: `/recovery`

Build a post-disaster recovery workflow for affected households.

Allow users to submit:
- Household or business damage reports.
- Damaged home information.
- Agricultural losses.
- Essential household needs.
- Temporary housing requests.
- Infrastructure damage reports.
- Requests for reconstruction or livelihood support.

Allow optional evidence uploads.

Application status:
- Draft.
- Submitted.
- Under Review.
- Additional Information Required.
- Approved.
- Assistance in Progress.
- Completed.
- Rejected, with an explanation where appropriate.

Build a recovery dashboard where a user can see their own applications and status timeline.

Build an authorized reviewer view for evaluating applications and recording decisions.

Clearly distinguish community-reported damage from officially assessed damage.

Do not imply that an application is approved for government funding or assistance unless an authorized source confirms that status.

## 14. Preparedness and early-action center

Route: `/preparedness`

Include:
- Before, during, and after a flood guidance.
- Emergency-kit checklist.
- Family emergency planning.
- Evacuation readiness.
- Safe water and hygiene guidance.
- Post-flood cleanup safety.
- Landslide and flash-flood awareness.
- Official alert links.
- Downloadable preparedness checklist.

Support English and Nepali for essential safety content.

Prioritize simple language, readable typography, and mobile accessibility.

Do not invent official evacuation instructions. Label general preparedness guidance appropriately and direct users to current official warnings.

## 15. Authentication and user roles

Create the UI for role-based access.

Roles:
- Public visitor.
- Registered citizen.
- Responder or volunteer.
- Shelter or relief provider.
- Administrator.

Public visitors should be able to view public alerts and public shelter information without creating an account.

Registered citizens can manage their own requests and recovery applications.

Responders can access assigned requests and update authorized statuses.

Providers can manage their own shelter or inventory records.

Administrators can verify reports, manage assignments, and review application records.

Hide or disable restricted actions in the UI based on role, but remember that actual authorization must be enforced by the backend.

Provide login, registration, forgot-password, and logout screens.

Do not implement fake authentication that implies sensitive data is securely protected. If the backend is not connected, clearly identify the prototype authentication mode.

## 16. Administration and verification center

Route: `/admin`

Create a dedicated operations interface for authorized administrators.

Include:
- Pending incident reports.
- Urgent rescue requests.
- Report verification queue.
- Shelter verification.
- Relief inventory management.
- Request assignment.
- Recovery application review.
- Status updates.
- Search and filters.
- Activity and audit-log view.

Provide a report detail panel with available evidence, source, timestamp, location, duplicate candidates, and verification actions.

Every sensitive action should require confirmation.

Record the acting administrator and change timestamp in the backend when connected.

Do not allow ordinary users to approve their own reports or access another user's private request details.

## 17. English and Nepali language support

Implement a real language switcher for English and Nepali.

Use centralized translation dictionaries rather than scattering text conditionals throughout components.

Translate:
- Navigation.
- Emergency actions.
- Forms.
- Status labels.
- Error messages.
- Preparedness instructions.
- Essential user-facing guidance.

Use a suitable Unicode font and test Nepali text wrapping on small screens.

Persist the selected language using an appropriate frontend preference mechanism.

## 18. Poor-network and offline-friendly experience

Optimize for users with limited mobile data or unstable connectivity.

Include:
- Lightweight layouts.
- Minimal unnecessary animation.
- Loading skeletons.
- Clear connection and synchronization status.
- Retry buttons.
- Locally saved form drafts where appropriate.
- An optional PWA/offline shell if time permits.

If an offline report is saved locally, label it "Saved on this device — not submitted."

Only show "Submitted" after receiving backend confirmation.

Do not claim offline SOS delivery.

## 19. AI-assisted features

Create optional, clearly labeled AI-assisted functionality for:
- Summarizing long disaster reports.
- Grouping similar reports for moderator review.
- Translating user descriptions.
- Producing a summary of unmet relief needs.

AI outputs must be labeled as suggestions and reviewed by an authorized human before being used for emergency decisions.

Do not use AI-generated content as an official warning or as the sole basis for rescue prioritization.

If no AI provider is configured, provide a graceful fallback and do not simulate a real AI response.

## 20. Backend integration contract

Prepare the frontend to integrate with a Flask REST API.

Use a centralized API client and define TypeScript types for all important records.

Suggested endpoints:
- `GET /api/alerts`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/rescue-requests`
- `POST /api/rescue-requests`
- `GET /api/shelters`
- `GET /api/relief-requests`
- `POST /api/relief-requests`
- `GET /api/recovery-applications`
- `POST /api/recovery-applications`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id/verify`
- `PATCH /api/admin/rescue-requests/:id/status`

Treat these as the proposed frontend contract; the Flask backend will need to implement and authorize them.

Use environment-based configuration for the backend URL.

Create mock-data services that conform to the same TypeScript interfaces as the real API services. Make switching from mock mode to backend mode straightforward.

Do not store real personal information in mock data.

## 21. Security and privacy requirements

- Never expose API secrets in client-side code.
- Validate and sanitize user-provided data.
- Do not expose private phone numbers or exact vulnerable-person locations publicly.
- Use role-based access in the UI.
- Assume backend authorization is mandatory.
- Do not trust user-submitted verification status.
- Restrict and validate file uploads.
- Avoid storing sensitive information in browser storage.
- Do not claim the website is an official government platform.
- Display a clear privacy notice before collecting personal or location data.

## 22. Functional requirements

Every visible button must have a meaningful action.

Ensure:
- Navigation links work.
- Search and filters update results.
- Forms validate and submit through the selected data service.
- Loading, success, error, and empty states exist.
- Dashboard numbers are derived from the current dataset.
- The map and list view use consistent records.
- Role-restricted actions are hidden or disabled appropriately.
- Demo data is clearly labeled.
- API failures do not crash the application.
- No broken routes, placeholder links, or fake success messages remain.

## 23. Suggested implementation priorities

Build in this order:

Phase 1:
- Global layout and navigation.
- Homepage.
- Disaster dashboard.
- Interactive map.
- Emergency SOS form.
- Community reporting.

Phase 2:
- Shelter finder.
- Relief coordination.
- Admin verification dashboard.
- Authentication UI.

Phase 3:
- Recovery portal.
- Preparedness center.
- English/Nepali localization.
- Offline drafts and optional AI-assisted tools.

Prioritize a polished, working Phase 1 before adding advanced features.

## 24. Final deliverable

Deliver a cohesive, fully navigable frontend that looks ready for a serious national disaster-resilience hackathon demonstration.

The finished website should tell a complete story: a citizen reports a flood hazard, the report enters a verification queue, an authorized responder receives an assigned rescue request, relief is coordinated, and the affected household can subsequently track recovery assistance.

Use realistic but explicitly fictional demo data, strong mobile responsiveness, accessible controls, reusable components, and clean TypeScript.

Before finishing, check every route, form, filter, status update, and visible action. Clearly identify features that require a backend, external API, or provider credentials.

The priority is practical disaster-response value, data integrity, safety, usability, and a professional presentation—not unnecessary complexity.