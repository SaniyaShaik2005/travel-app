import { ArrowRight, MapPin, Sun } from 'lucide-react'

export default function WeatherWidget({ location, weather, locationState, onRequestLocation, onManualLocation }) {
  const fallback = locationState === 'denied' || locationState === 'error'
  return <section className="signal-band"><div className="signal-icon"><Sun size={22} /></div><div><p className="eyebrow">Travel, in real time</p><h3>Made for <em>this moment.</em></h3></div><div className="weather-line"><span className="weather-place"><MapPin size={15} /> {location}</span><strong>{weather.temperature}°</strong><span>{weather.condition}<br /><small>Feels like {weather.feelsLike}°</small></span></div><button className="text-button" onClick={fallback ? onManualLocation : onRequestLocation}>{locationState === 'loading' ? 'Locating...' : fallback ? 'Search manually' : 'Update location'} <ArrowRight size={16} /></button></section>
}
