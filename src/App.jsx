import { useMemo, useRef, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Compass, Heart, MapPin, Menu, MessageCircle, Navigation, Search, Sparkles, Star, Sun, X } from 'lucide-react'
import { buildDemoItinerary, createItinerary, demoItinerary } from './services/ai'
import { demoWeather, getWeather } from './services/weather'
import './App.css'

const destinations = [
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', tag: 'Temple mornings', category: 'City rituals', weather: '18°', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85', accent: 'vermillion' },
  { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', tag: 'A slower blue', category: 'Coastlines', weather: '24°', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85', accent: 'azure' },
  { id: 'patagonia', name: 'Patagonia', country: 'Argentina', tag: 'Edge of the map', category: 'Wild escapes', weather: '7°', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85', accent: 'moss' },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', tag: 'A sensory atlas', category: 'City rituals', weather: '27°', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85', accent: 'saffron' },
]

const places = [
  ['Fushimi Inari', 'Kyoto', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85'],
  ['Blue Grotto', 'Amalfi Coast', 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85'],
  ['Torres del Paine', 'Patagonia', 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85'],
  ['Jardin Majorelle', 'Marrakech', 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=85'],
]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All places')
  const [active, setActive] = useState(null)
  const [location, setLocation] = useState('Your location')
  const [locationState, setLocationState] = useState('idle')
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Tell me what kind of trip you are imagining. I can help with places, pace, food, or a little inspiration.' }])
  const [tripInput, setTripInput] = useState('slow mornings, local food, and art')
  const [itinerary, setItinerary] = useState(demoItinerary)
  const [plannerLoading, setPlannerLoading] = useState(false)
  const [weather, setWeather] = useState(demoWeather)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10))
  const [videoPlaying, setVideoPlaying] = useState(true)
  const videoRef = useRef(null)
  const [mobileNav, setMobileNav] = useState(false)
  const filtered = useMemo(() => destinations.filter((d) => `${d.name} ${d.country}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All places' || d.category === category)), [query, category])

  function requestLocation() {
    setLocationState('loading')
    if (!navigator.geolocation) { setLocationState('denied'); return }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => { try { const current = await getWeather(coords.latitude, coords.longitude); setWeather(current); setLocation(current.location); setLocationState('success') } catch { setLocationState('error') } }, () => setLocationState('denied'))
  }

  function searchLocation() { const manual = window.prompt('Enter a city or region'); if (manual?.trim()) { setLocation(manual.trim()); setLocationState('success') } }
  function answerAssistant() { const question = chatInput.trim(); if (!question) return; const lower = question.toLowerCase(); const answer = lower.includes('kyoto') ? 'Kyoto is wonderful for a slower rhythm: start at Fushimi Inari, make time for a tea ceremony, and keep an evening free in Gion.' : lower.includes('weather') ? `The demo forecast near ${location.toLowerCase()} is ${weather.temperature}° with ${weather.condition.toLowerCase()}.` : 'I would start with a place that matches your pace. Try Kyoto for ritual and craft, Amalfi for sea days, or Patagonia for a true reset.'; setChatMessages((messages) => [...messages, { role: 'user', text: question }, { role: 'assistant', text: answer }]); setChatInput('') }
  async function generateItinerary() { setPlannerLoading(true); try { const result = await createItinerary({ destination: active?.name ?? 'Kyoto', preferences: tripInput, startDate, endDate }); setItinerary(result) } catch { setItinerary(buildDemoItinerary({ destination: active?.name ?? 'Kyoto', preferences: tripInput, startDate, endDate })) } finally { setPlannerLoading(false) } }
  function toggleVideo() { const video = videoRef.current; if (!video) return; if (video.paused) { video.play().then(() => setVideoPlaying(true)).catch(() => setVideoPlaying(false)) } else { video.pause(); setVideoPlaying(false) } }

  function scrollToExplorer() { document.querySelector('#explore')?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <main>
      <section className="hero" aria-label="Discover your next journey">
        <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline poster={destinations[1].image} onPlay={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)}><source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-the-coast-1577/1080p.mp4" type="video/mp4" /></video>
        <div className="hero-shade" />
        <header className="nav"><a className="brand" href="#top"><span className="brand-mark">✦</span> wayfarer</a><nav className={mobileNav ? 'nav-links open' : 'nav-links'}><a href="#explore">Explore</a><a href="#places">Places</a><a href="#journal">Journal</a></nav><div className="nav-actions"><button className="location-pill" onClick={requestLocation} aria-label="Set your location"><MapPin size={15} /> {location} <ChevronDown size={14} /></button><button className="icon-button menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">{mobileNav ? <X size={20} /> : <Menu size={20} />}</button></div></header>
        <div className="hero-content"><p className="eyebrow light"><span /> Curated for the curious</p><h1>Go somewhere<br /><em>that stays with you.</em></h1><p className="hero-copy">A more considered way to travel. Find places with a pulse, plan with intention, and leave room for the unexpected.</p><div className="hero-ctas"><button className="button button-light" onClick={scrollToExplorer}>Explore destinations <ArrowRight size={17} /></button><button className="round-play" onClick={toggleVideo} aria-label={videoPlaying ? 'Pause travel film' : 'Play travel film'}>{videoPlaying ? 'Ⅱ' : '▶'}</button></div></div>
        <div className="hero-bottom"><span>01 <i /> 04</span><span className="scroll-cue">Scroll to wander <ArrowRight size={15} /></span><span>© 2025 wayfarer studio</span></div>
      </section>

      <section className="intro" id="explore"><div><p className="eyebrow"><span /> The world, well chosen</p><h2>Where will you<br /><em>feel most alive?</em></h2></div><p className="intro-copy">Not a checklist. A collection of places selected for their character, rhythm, and the little details you will remember long after you return.</p></section>
      <section className="explorer"><div className="explorer-toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations" aria-label="Search destinations" /></div><div className="filters">{['All places', 'Coastlines', 'Wild escapes', 'City rituals'].map((filter) => <button key={filter} className={`filter ${category === filter ? 'active' : ''}`} onClick={() => setCategory(filter)}>{filter}</button>)}</div></div><div className="destination-grid">{filtered.map((destination, index) => <article className={`destination-card card-${index}`} key={destination.id} onClick={() => setActive(destination)} onKeyDown={(e) => e.key === 'Enter' && setActive(destination)} role="button" tabIndex="0"><img src={destination.image} alt={`${destination.name}, ${destination.country}`} /><div className="card-overlay" /><button className="save" aria-label={`Save ${destination.name}`} onClick={(e) => e.stopPropagation()}><Heart size={17} /></button><div className="card-info"><span className="card-number">0{index + 1}</span><div><p>{destination.country} <span>• {destination.weather}</span></p><h3>{destination.name}</h3><small>{destination.tag}</small></div><ArrowRight className="card-arrow" size={20} /></div></article>)}</div>{filtered.length === 0 && <div className="empty-state"><Compass size={26} /><h3>No destinations found</h3><p>Try a country, coastline, or city.</p></div>}</section>

      <section className="signal-band"><div className="signal-icon"><Sun size={22} /></div><div><p className="eyebrow">Travel, in real time</p><h3>Made for <em>this moment.</em></h3></div><div className="weather-line"><span className="weather-place"><MapPin size={15} /> {location}</span><strong>{weather.temperature}°</strong><span>{weather.condition}<br /><small>Feels like {weather.feelsLike}°</small></span></div><button className="text-button" onClick={locationState === 'denied' || locationState === 'error' ? searchLocation : requestLocation}>{locationState === 'denied' ? 'Search manually' : locationState === 'loading' ? 'Locating...' : locationState === 'error' ? 'Search manually' : 'Update location'} <ArrowRight size={16} /></button></section>

      <section className="places-section" id="places"><div className="section-heading"><div><p className="eyebrow"><span /> Worth the detour</p><h2>Famous places.<br /><em>Personal stories.</em></h2></div><button className="text-button">See all places <ArrowRight size={16} /></button></div><div className="places-grid">{places.map(([name, region, image], index) => <article className="place-card" key={name}><img src={image} alt={name} /><div className="place-caption"><span>0{index + 1}</span><div><h3>{name}</h3><p>{region}</p></div><Star size={16} fill="currentColor" /></div></article>)}</div></section>

      <section className="planner" id="journal"><div className="planner-copy"><p className="eyebrow light"><span /> Your next chapter</p><h2>Tell us how you<br /><em>want to feel.</em></h2><p>Our travel assistant turns a few instincts into a day-by-day itinerary that leaves space for life to happen.</p><button className="button button-light" onClick={() => setPlannerOpen(true)}><Sparkles size={16} /> Build my itinerary</button></div><div className="planner-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-label">The art of<br /><em>going.</em></span><span className="art-coord">35° 00' N<br />135° 46' E</span></div></section>

      <footer><a className="brand" href="#top"><span className="brand-mark">✦</span> wayfarer</a><span>Travel with intention.</span><span>hello@wayfarer.studio</span></footer>
      {active && <div className="modal-backdrop" onClick={() => setActive(null)}><aside className="detail-panel" onClick={(e) => e.stopPropagation()}><button className="close-button" onClick={() => setActive(null)} aria-label="Close destination details"><X /></button><img src={active.image} alt={active.name} /><div className="detail-content"><p className="eyebrow">{active.country} · {active.weather}</p><h2>{active.name}</h2><p>Arrive slowly. Follow the morning light through hidden lanes, local kitchens, and landscapes that ask you to stay a little longer.</p><div className="detail-meta"><span><CalendarDays size={16} /> Best in April–June</span><span><Navigation size={16} /> 7 day suggestion</span></div><h3 className="detail-places-heading">Famous places</h3><div className="detail-places">{places.filter(([, region]) => region === active.name).map(([name, region, image]) => <div key={name}><img src={image} alt={name} /><span>{name}<small>{region}</small></span></div>)}</div><button className="button button-dark" onClick={() => { setActive(null); setPlannerOpen(true) }}>Plan this trip <ArrowRight size={17} /></button></div></aside></div>}
      {plannerOpen && <div className="modal-backdrop" onClick={() => setPlannerOpen(false)}><aside className="planner-modal" onClick={(e) => e.stopPropagation()}><button className="close-button" onClick={() => setPlannerOpen(false)} aria-label="Close planner"><X /></button><div className="planner-modal-head"><Sparkles size={20} /><p className="eyebrow">Wayfarer AI</p><h2>A trip with<br /><em>room to breathe.</em></h2><p>Shape a first draft around how you want to travel.</p></div><label className="planner-input-label" htmlFor="trip-preferences">What are you in the mood for?</label><input className="planner-input" id="trip-preferences" value={tripInput} onChange={(e) => setTripInput(e.target.value)} /><div className="date-fields"><label className="planner-input-label" htmlFor="start-date">Start date</label><input className="planner-input" id="start-date" type="date" value={startDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setStartDate(e.target.value)} /><label className="planner-input-label" htmlFor="end-date">End date</label><input className="planner-input" id="end-date" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} /></div><div className="itinerary">{itinerary.map((item) => <div key={item.day}><span>{item.day}</span><strong>{item.title}</strong><p>{item.detail}</p></div>)}</div><button className="button button-dark" onClick={generateItinerary} disabled={plannerLoading || !startDate || !endDate || endDate < startDate}>{plannerLoading ? 'Creating your route...' : 'Refresh itinerary'} <ArrowRight size={17} /></button></aside></div>}
      {assistantOpen && <div className="modal-backdrop" onClick={() => setAssistantOpen(false)}><aside className="planner-modal" onClick={(e) => e.stopPropagation()}><button className="close-button" onClick={() => setAssistantOpen(false)} aria-label="Close assistant"><X /></button><div className="planner-modal-head"><MessageCircle size={20} /><p className="eyebrow">Wayfarer assistant</p><h2>Ask about<br /><em>anywhere.</em></h2></div><div className="chat-messages">{chatMessages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.text}</p>)}</div><div className="chat-compose"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && answerAssistant()} placeholder="Ask about a destination..." aria-label="Ask Wayfarer a question" /><button className="button button-dark" onClick={answerAssistant} aria-label="Send question"><ArrowRight size={17} /></button></div></aside></div>}
      <button className="assistant-button" onClick={() => setAssistantOpen(true)} aria-label="Open AI travel assistant"><MessageCircle size={21} /><span>Ask Wayfarer</span></button>
    </main>
  )
}

export default App
