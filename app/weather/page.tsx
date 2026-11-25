'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import {
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow,
  CloudSun, Droplets, MapPin, Search, Sun, Sunrise, Sunset, Wind,
} from 'lucide-react'
import './weather.css'

type City = { name: string; country: string; admin1?: string; latitude: number; longitude: number; timezone?: string }
type Forecast = {
  current: { temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; is_day: number; precipitation: number; weather_code: number; wind_speed_10m: number }
  hourly: { time: string[]; temperature_2m: number[]; precipitation_probability: number[]; weather_code: number[] }
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; sunrise: string[]; sunset: string[]; uv_index_max: number[] }
}

const defaultCity: City = { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' }

function weatherDescription(code: number) {
  if (code === 0) return 'Clear sky'
  if ([1, 2].includes(code)) return 'Mostly clear'
  if (code === 3) return 'Overcast'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain showers'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowfall'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'
  return 'Variable conditions'
}

function WeatherIcon({ code, size = 22, isDay = true }: { code: number; size?: number; isDay?: boolean }) {
  const props = { size, strokeWidth: 1.7 }
  if (code === 0) return isDay ? <Sun {...props}/> : <Sun {...props}/>
  if ([1, 2].includes(code)) return <CloudSun {...props}/>
  if (code === 3) return <Cloud {...props}/>
  if ([45, 48].includes(code)) return <CloudFog {...props}/>
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...props}/>
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain {...props}/>
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...props}/>
  if ([95, 96, 99].includes(code)) return <CloudLightning {...props}/>
  return <CloudSun {...props}/>
}

const dayLabel = (iso: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', options).format(new Date(`${iso}T12:00:00`))
const timeLabel = (iso: string) => new Intl.DateTimeFormat('en-IN', { hour: 'numeric' }).format(new Date(iso))

export default function WeatherDashboard() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<City>(defaultCity)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadForecast = useCallback(async (place: City) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        latitude: String(place.latitude), longitude: String(place.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,precipitation_probability,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
        timezone: place.timezone || 'auto', forecast_days: '7', temperature_unit: 'celsius', wind_speed_unit: 'kmh',
      })
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!response.ok) throw new Error('Weather service is temporarily unavailable. Please try again.')
      const data = await response.json() as Forecast
      setForecast(data)
      setCity(place)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load weather right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadForecast(defaultCity) }, [loadForecast])

  async function searchCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const searchTerm = query.trim()
    if (!searchTerm) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({ name: searchTerm, count: '1', language: 'en', format: 'json' })}`)
      if (!response.ok) throw new Error('Could not search locations. Please try again.')
      const result = await response.json() as { results?: City[] }
      const match = result.results?.[0]
      if (!match) throw new Error(`No location found for “${searchTerm}”. Try another city.`)
      await loadForecast(match)
      setQuery('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not search for that city.')
      setLoading(false)
    }
  }

  const current = forecast?.current
  const hourlyStart = forecast?.hourly.time.findIndex(time => new Date(time).getTime() >= Date.now()) ?? 0
  const hourlyIndices = forecast ? Array.from({ length: 24 }, (_, index) => (Math.max(0, hourlyStart) + index) % forecast.hourly.time.length) : []
  const observedAt = forecast?.current ? new Date().toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''

  return (
    <main className="weather-app">
      <header className="weather-header">
        <a className="weather-brand" href="/" aria-label="Gharana Realty home"><span className="brand-symbol"><CloudSun size={21}/></span><span>SKYLINE <small>WEATHER</small></span></a>
        <form className="city-search" onSubmit={searchCity}><Search size={17}/><input aria-label="Search city" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a city..."/><button type="submit" disabled={loading} aria-label="Find city">Search</button></form>
        <div className="unit-pill"><span className="unit-selected">°C</span><span>°F</span></div>
      </header>

      <section className="weather-content">
        <div className="weather-title"><div><p className="weather-kicker">LOCAL WEATHER · INDIA</p><h1>Your day, in the forecast.</h1></div><div className="updated-label">{observedAt && <>Updated {observedAt}</>}</div></div>
        {error && <div className="weather-error" role="alert">{error}</div>}

        <section className="current-weather" aria-label="Current weather">
          <div className="current-copy"><div className="location-label"><MapPin size={15}/>{city.name}{city.admin1 ? `, ${city.admin1}` : ''}{city.country ? `, ${city.country}` : ''}</div>
            {loading && !current ? <div className="loading-title">Loading local forecast…</div> : <><div className="temperature">{current ? Math.round(current.temperature_2m) : '--'}<span>°</span></div><div className="condition">{current ? weatherDescription(current.weather_code) : 'Weather unavailable'}</div><div className="feels-like">Feels like {current ? Math.round(current.apparent_temperature) : '--'}°</div></>}
          </div>
          <div className="current-art"><div className="sun-glow"/><div className="cloud-shape cloud-back"/><div className="cloud-shape cloud-front"/><div className="weather-main-icon">{current && <WeatherIcon code={current.weather_code} size={72} isDay={current.is_day === 1}/>}</div></div>
          <div className="current-details"><div><span>Humidity</span><strong><Droplets size={16}/>{current?.relative_humidity_2m ?? '--'}%</strong></div><div><span>Wind</span><strong><Wind size={16}/>{current?.wind_speed_10m ?? '--'} <small>km/h</small></strong></div><div><span>Rain</span><strong><CloudRain size={16}/>{current?.precipitation ?? '--'} <small>mm</small></strong></div></div>
        </section>

        <section className="forecast-card hourly-card"><div className="section-heading"><div><span className="section-kicker">THE NEXT 24 HOURS</span><h2>Hourly forecast</h2></div><span className="soft-tag">Local time</span></div><div className="hourly-strip">{forecast && hourlyIndices.map((index, itemIndex) => <article className={`hour-item ${itemIndex === 0 ? 'hour-now' : ''}`} key={forecast.hourly.time[index]}><span>{itemIndex === 0 ? 'Now' : timeLabel(forecast.hourly.time[index])}</span><WeatherIcon code={forecast.hourly.weather_code[index]} size={23}/><strong>{Math.round(forecast.hourly.temperature_2m[index])}°</strong><small><Droplets size={11}/>{forecast.hourly.precipitation_probability[index] ?? 0}%</small></article>)}{loading && !forecast && <p className="forecast-loading">Getting hourly forecast…</p>}</div></section>

        <div className="lower-grid"><section className="forecast-card week-card"><div className="section-heading"><div><span className="section-kicker">PLAN AHEAD</span><h2>7-day forecast</h2></div><span className="soft-tag">°C</span></div><div className="week-list">{forecast?.daily.time.map((date, index) => <article className="week-row" key={date}><strong>{index === 0 ? 'Today' : dayLabel(date, { weekday: 'short' })}</strong><WeatherIcon code={forecast.daily.weather_code[index]} size={21}/><span>{weatherDescription(forecast.daily.weather_code[index])}</span><div className="temp-range"><small>{Math.round(forecast.daily.temperature_2m_min[index])}°</small><i><b style={{ left: `${Math.min(78, Math.max(0, (forecast.daily.temperature_2m_min[index] - 10) * 3))}%`, width: `${Math.max(18, Math.min(70, (forecast.daily.temperature_2m_max[index] - forecast.daily.temperature_2m_min[index]) * 3))}%` }}/></i><strong>{Math.round(forecast.daily.temperature_2m_max[index])}°</strong></div></article>)}</div></section>

          <section className="forecast-card highlights-card"><div className="section-heading"><div><span className="section-kicker">OUTDOOR CONDITIONS</span><h2>Today’s highlights</h2></div></div><div className="highlight-grid"><article className="highlight sunrise"><span><Sunrise size={18}/>Sunrise</span><strong>{forecast?.daily.sunrise[0] ? timeLabel(forecast.daily.sunrise[0]) : '--'}</strong><small>Golden hour starts early</small></article><article className="highlight sunset"><span><Sunset size={18}/>Sunset</span><strong>{forecast?.daily.sunset[0] ? timeLabel(forecast.daily.sunset[0]) : '--'}</strong><small>Make the most of daylight</small></article><article className="highlight uv"><span><Sun size={18}/>UV index</span><strong>{forecast?.daily.uv_index_max[0] ?? '--'} <small>{(forecast?.daily.uv_index_max[0] ?? 0) >= 8 ? 'Very high' : (forecast?.daily.uv_index_max[0] ?? 0) >= 6 ? 'High' : 'Moderate'}</small></strong><div className="uv-meter"><i style={{width: `${Math.min(100, Number(forecast?.daily.uv_index_max[0] ?? 0) * 10)}%`}}/></div></article><article className="highlight comfort"><span><Wind size={18}/>Feels like</span><strong>{current ? Math.round(current.apparent_temperature) : '--'}°</strong><small>Current comfort level</small></article></div><p className="weather-source">Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>. Forecasts are indicative and may change.</p></section></div>

        <footer className="weather-footer"><span>Skyline Weather</span><span>Clear skies for planning your day.</span></footer>
      </section>
    </main>
  )
}
