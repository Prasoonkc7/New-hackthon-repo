// Open-Meteo forecast (free, no key). This is FORECAST data — never a flood warning.
export interface Forecast {
  place: string;
  fetchedAt: string;
  days: { date: string; precipitation: number; probability: number; tMax: number }[];
}

export async function getRainfallForecast(place: string, lat: number, lng: number): Promise<Forecast> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max&timezone=Asia%2FKathmandu&forecast_days=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather service error (${res.status})`);
  const j = await res.json();
  return {
    place,
    fetchedAt: new Date().toISOString(),
    days: (j.daily.time as string[]).map((date, i) => ({
      date,
      precipitation: j.daily.precipitation_sum[i] ?? 0,
      probability: j.daily.precipitation_probability_max[i] ?? 0,
      tMax: j.daily.temperature_2m_max[i] ?? 0,
    })),
  };
}
