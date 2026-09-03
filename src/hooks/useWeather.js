import { useState } from 'react'
import { demoWeather, getWeather } from '../services/weather'

export function useWeather() {
  const [weather, setWeather] = useState(demoWeather)
  const [location, setLocation] = useState('Your location')
  const [status, setStatus] = useState('idle')
  async function requestLocation() {
    setStatus('loading')
    if (!navigator.geolocation) { setStatus('denied'); return }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try { const current = await getWeather(coords.latitude, coords.longitude); setWeather(current); setLocation(current.location); setStatus('success') }
      catch { setStatus('error') }
    }, () => setStatus('denied'))
  }
  function setManualLocation(value) { if (value?.trim()) { setLocation(value.trim()); setStatus('success') } }
  function selectDestination(destination) { setWeather({ temperature: Number.parseInt(destination.weather, 10), feelsLike: Number.parseInt(destination.weather, 10) + 1, condition: 'Typical conditions', location: destination.name }); setLocation(destination.name); setStatus('success') }
  return { weather, location, status, requestLocation, setManualLocation, selectDestination }
}
