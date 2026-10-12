# JalRakshak Backend

Secure, modular Flask REST API MVP for the JalRakshak frontend. It uses
SQLAlchemy with SQLite by default, JWT bearer authentication, role-protected
administrative mutations, CORS allowlisting, password hashing, and explicit
demo records marked with `isDemo`.

## Run on Windows

```powershell
cd "C:\Users\Prasoon kc\Documents\Jalrakshak\Backend"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

Check `http://127.0.0.1:5000/health`. Set `VITE_API_BASE_URL=http://127.0.0.1:5000`
in the frontend to use this API. Login at `POST /api/auth/login`; send
`Authorization: Bearer <accessToken>` for protected operations. Public read
endpoints and citizen submissions are intentionally available without an
account; administrative operations always require an admin JWT.

## Endpoint groups

`/api/alerts`, `/reports`, `/rescue-requests`, `/shelters`, `/facilities`,
`/relief-requests`, `/inventory`, `/recovery-applications`, and
`/admin/*` match the frontend service contract. Responses are JSON objects or
arrays; errors consistently use `{"error": "..."}`.

Never use demo records as live emergency information. Change all default
secrets and disable `SEED_DEMO` before deployment.
## Live weather

`GET /api/weather?lat=27.7172&lon=85.3240` proxies Open-Meteo from the server.
The response includes the provider, coordinates, retrieval time, current conditions,
five-day precipitation/temperature forecasts, and a warning that forecasts are not
confirmed flood warnings. Responses are cached for `WEATHER_CACHE_SECONDS` (300
seconds by default) and upstream failures return an honest `503` unavailable state.
Configure `WEATHER_API_BASE_URL`, `WEATHER_TIMEOUT_SECONDS`, and
`WEATHER_CACHE_SECONDS` in `.env`; no API key is required for the default provider.
Existing alerts and incident records remain platform/database records and are
explicitly marked demo where seeded.

## In-app notifications

Authenticated users can read their own notifications at `GET /api/notifications`
and mark an item read with `PATCH /api/notifications/<id>/read`. Notifications
are generated for report, rescue, and recovery status changes. This is an
in-app feature only; no email, SMS, push provider, or external credentials are
used.

The frontend also offers an opt-in proximity monitor. After the user grants
browser location permission, it watches the current location while the app is
open and shows an in-app warning when the user is within 1 km of a verified
hazard marker. Location is kept in memory and is not submitted to the backend.
Background tracking is not enabled, and the monitor requires HTTPS or
localhost.

## Evidence uploads

Report, rescue, and recovery submissions accept optional JPG, PNG, WebP, or PDF
evidence up to 5 MB. Files are stored in the configured private upload folder,
with randomized server-side names and metadata only returned in API records.
There is no public file-serving route. Configure `UPLOAD_FOLDER` and
`MAX_UPLOAD_BYTES` in `.env`.

## Shelter management

Shelter occupancy and facility updates require a JWT with `provider` or
`admin` role. Occupancy cannot be negative or exceed the reported capacity.
Updates are marked unverified until an administrator verifies them.
