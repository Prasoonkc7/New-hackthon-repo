from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


class WeatherProviderError(Exception):
    """Raised when the configured weather provider cannot return valid data."""


_cache: dict[tuple[float, float], tuple[float, dict]] = {}
_cache_lock = Lock()


def _validate_coordinates(lat: float, lon: float) -> None:
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ValueError("Latitude must be between -90 and 90 and longitude between -180 and 180")


def get_weather(
    latitude: float,
    longitude: float,
    *,
    base_url: str,
    timeout_seconds: float = 5,
    cache_seconds: int = 300,
) -> dict:
    _validate_coordinates(latitude, longitude)
    key = (round(latitude, 3), round(longitude, 3))
    now = time.monotonic()
    with _cache_lock:
        cached = _cache.get(key)
    if cached and now - cached[0] < cache_seconds:
        result = dict(cached[1])
        result["status"] = "live"
        result["from_cache"] = True
        return result

    query = urlencode(
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure",
            "hourly": "temperature_2m,precipitation,precipitation_probability,weather_code",
            "daily": "temperature_2m_min,temperature_2m_max,precipitation_sum,precipitation_probability_max,weather_code",
            "timezone": "Asia/Kathmandu",
            "forecast_days": 5,
        }
    )
    request = Request(f"{base_url.rstrip('/')}/v1/forecast?{query}", headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=timeout_seconds) as response:
            payload = json.load(response)
    except (HTTPError, URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        raise WeatherProviderError("Weather provider is unavailable") from exc

    current = payload.get("current") or {}
    hourly = payload.get("hourly") or {}
    daily = payload.get("daily") or {}
    if not isinstance(current, dict) or not isinstance(daily.get("time"), list):
        raise WeatherProviderError("Weather provider returned an invalid response")

    fetched_at = datetime.now(timezone.utc).isoformat()
    result = {
        "source": "Open-Meteo",
        "source_url": base_url,
        "latitude": latitude,
        "longitude": longitude,
        "fetched_at": fetched_at,
        "status": "live",
        "is_stale": False,
        "from_cache": False,
        "timezone": payload.get("timezone"),
        "current_conditions": {
            "time": current.get("time"),
            "temperature": current.get("temperature_2m"),
            "feels_like": current.get("apparent_temperature"),
            "humidity": current.get("relative_humidity_2m"),
            "wind_speed": current.get("wind_speed_10m"),
            "wind_direction": current.get("wind_direction_10m"),
            "pressure": current.get("surface_pressure"),
            "precipitation": current.get("precipitation"),
            "rain": current.get("rain"),
            "weather_code": current.get("weather_code"),
        },
        "hourly": [
            {"time": t, "temperature": (hourly.get("temperature_2m") or [None] * len(hourly.get("time", [])))[i], "precipitation": p, "probability": (hourly.get("precipitation_probability") or [None] * len(hourly.get("time", [])))[i], "weather_code": (hourly.get("weather_code") or [None] * len(hourly.get("time", [])))[i]}
            for i, (t, p) in enumerate(zip(hourly.get("time", []), hourly.get("precipitation", [])))
        ][:24],
        "forecast": [
            {
                "date": date,
                "precipitation": (daily.get("precipitation_sum") or [None] * len(daily["time"]))[i],
                "probability": (daily.get("precipitation_probability_max") or [None] * len(daily["time"]))[i],
                "temperature_min": (daily.get("temperature_2m_min") or [None] * len(daily["time"]))[i],
                "temperature_max": (daily.get("temperature_2m_max") or [None] * len(daily["time"]))[i],
                "weather_code": (daily.get("weather_code") or [None] * len(daily["time"]))[i],
            }
            for i, date in enumerate(daily["time"])
        ],
        "warning_note": "Forecast data is not a confirmed flood warning.",
    }
    with _cache_lock:
        _cache[key] = (now, result)
    return result
