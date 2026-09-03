const demoWeather = { temperature: 24, feelsLike: 25, condition: 'Clear skies', location: 'Near you' }

export async function getWeather(latitude, longitude) {
  const endpoint = import.meta.env.VITE_WEATHER_API_URL
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  if (!endpoint || !apiKey) return demoWeather
  const response = await fetch(`${endpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
  if (!response.ok) throw new Error('Weather service unavailable')
  const data = await response.json()
  return { temperature: Math.round(data.main.temp), feelsLike: Math.round(data.main.feels_like), condition: data.weather[0]?.description ?? 'Current conditions', location: 'Near you' }
}

export { demoWeather }
