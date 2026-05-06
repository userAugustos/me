import { t } from '../../i18n'

const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=-23.474177409874983&longitude=-46.31547198780909&current=temperature_2m,wind_speed_10m'

interface ForecastResponse {
  current: {
    temperature_2m: number
    wind_speed_10m: number
  }
}

function vibe(celsius: number): string {
  if (celsius < 10) return t('weather.vibes.cold')
  if (celsius < 16) return t('weather.vibes.chilly')
  if (celsius < 22) return t('weather.vibes.mild')
  if (celsius < 28) return t('weather.vibes.warm')
  if (celsius < 32) return t('weather.vibes.hot')
  return t('weather.vibes.veryHot')
}

function format(data: ForecastResponse): string {
  const celsius = Math.round(data.current.temperature_2m)
  return t('weather.current', {
    vibe: vibe(celsius),
    temperature: celsius,
    location: t('weather.location'),
  })
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
    target.textContent = t('weather.fallback', {
      vibe: t('weather.vibes.veryHot'),
      location: t('weather.location'),
    })
  }
}
