const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=-23.474177409874983&longitude=-46.31547198780909&current=temperature_2m,wind_speed_10m'

const LOCATION = 'Itaquaquecetuba, SP'
const FALLBACK = `Very hot, ${LOCATION}`

interface ForecastResponse {
  current: {
    temperature_2m: number
    wind_speed_10m: number
  }
}

function vibe(celsius: number): string {
  if (celsius < 10) return 'Cold'
  if (celsius < 16) return 'Chilly'
  if (celsius < 22) return 'Mild'
  if (celsius < 28) return 'Warm'
  if (celsius < 32) return 'Hot'
  return 'Very hot'
}

function format(data: ForecastResponse): string {
  const celsius = Math.round(data.current.temperature_2m)
  return `${vibe(celsius)} · ${celsius}°C · ${LOCATION}`
}

export async function loadWeather(target: HTMLElement): Promise<void> {
  try {
    const response = await fetch(ENDPOINT)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data: unknown = await response.json()
    if (typeof (data as ForecastResponse)?.current?.temperature_2m !== 'number') {
      throw new Error('invalid forecast payload')
    }
    target.textContent = format(data as ForecastResponse)
  } catch {
    target.textContent = FALLBACK
  }
}
