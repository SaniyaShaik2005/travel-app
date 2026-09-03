import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import './App.css'
import { destinations, places } from './data/destinations'
import { askTravelAssistant, buildDemoItinerary, createItinerary, demoItinerary } from './services/ai'
import Hero from './components/Hero'
import SearchPanel from './components/SearchPanel'
import DestinationGrid from './components/DestinationGrid'
import DestinationDetails from './components/DestinationDetails'
import FamousPlaces from './components/FamousPlaces'
import WeatherWidget from './components/WeatherWidget'
import TripPlanner from './components/TripPlanner'
import TravelChatbot from './components/TravelChatbot'
import Footer from './components/Footer'
import { useWeather } from './hooks/useWeather'

const categories = ['All places', 'Coastlines', 'Wild escapes', 'City rituals']
const today = () => new Date().toISOString().slice(0, 10)
const inThreeDays = () => new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All places')
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Tell me what kind of trip you are imagining. I can help with places, pace, food, or a little inspiration.' }])
  const [tripInput, setTripInput] = useState('slow mornings, local food, and art')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(inThreeDays)
  const [itinerary, setItinerary] = useState(demoItinerary)
  const [plannerLoading, setPlannerLoading] = useState(false)
  const { weather, location, status: locationState, requestLocation, setManualLocation, selectDestination } = useWeather()
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')

  const filteredDestinations = useMemo(() => destinations.filter((destination) => `${destination.name} ${destination.country}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All places' || destination.category === category)), [query, category])
  function promptForLocation() { setManualLocation(window.prompt('Enter a city or region')) }
  async function answerAssistant() {
    const question = chatInput.trim()
    if (!question || chatLoading) return
    setChatInput('')
    setChatError('')
    setChatMessages((messages) => [...messages, { role: 'user', text: question }])
    setChatLoading(true)
    try { const text = await askTravelAssistant({ question, destination: selectedDestination, weather }); setChatMessages((messages) => [...messages, { role: 'assistant', text }]) }
    catch { setChatError('The assistant is temporarily unavailable. Please try again.') }
    finally { setChatLoading(false) }
  }
  async function generateItinerary() {
    setPlannerLoading(true)
    const preferences = { destination: selectedDestination?.name ?? 'Kyoto', preferences: tripInput, startDate, endDate }
    try { setItinerary(await createItinerary(preferences)) } catch { setItinerary(buildDemoItinerary(preferences)) } finally { setPlannerLoading(false) }
  }
  function selectByDestinationName(destinationName) { const destination = destinations.find((item) => item.name === destinationName); if (destination) { setSelectedDestination(destination); selectDestination(destination) } }
  function openPlanner() { setSelectedDestination(null); setPlannerOpen(true) }
  function showAllPlaces() { setQuery(''); setCategory('All places'); document.querySelector('#explore')?.scrollIntoView({ behavior: 'smooth' }) }

  return <main>
    <Hero poster={destinations[1].image} location={location} mobileNav={mobileNav} onToggleMenu={() => setMobileNav((open) => !open)} onRequestLocation={requestLocation} onExplore={() => document.querySelector('#explore')?.scrollIntoView({ behavior: 'smooth' })} />
    <section className="intro" id="explore"><div><p className="eyebrow"><span /> The world, well chosen</p><h2>Where will you<br /><em>feel most alive?</em></h2></div><p className="intro-copy">Not a checklist. A collection of places selected for their character, rhythm, and the little details you will remember long after you return.</p></section>
    <section className="explorer"><SearchPanel query={query} category={category} categories={categories} onQueryChange={setQuery} onCategoryChange={setCategory} /><DestinationGrid destinations={filteredDestinations} onSelect={(destination) => { setSelectedDestination(destination); selectDestination(destination) }} /></section>
    <WeatherWidget location={location} weather={weather} locationState={locationState} onRequestLocation={requestLocation} onManualLocation={promptForLocation} />
    <FamousPlaces places={places} onSelectDestination={selectByDestinationName} onSeeAll={showAllPlaces} />
    <section className="planner" id="journal"><div className="planner-copy"><p className="eyebrow light"><span /> Your next chapter</p><h2>Tell us how you<br /><em>want to feel.</em></h2><p>Our travel assistant turns a few instincts into a day-by-day itinerary that leaves space for life to happen.</p><button className="button button-light" onClick={() => setPlannerOpen(true)}><Sparkles size={16} /> Build my itinerary</button></div><div className="planner-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-label">The art of<br /><em>going.</em></span><span className="art-coord">35° 00' N<br />135° 46' E</span></div></section>
    <Footer />
    <DestinationDetails destination={selectedDestination} places={places} onClose={() => setSelectedDestination(null)} onPlan={openPlanner} />
    <TripPlanner open={plannerOpen} input={tripInput} startDate={startDate} endDate={endDate} itinerary={itinerary} loading={plannerLoading} onInputChange={setTripInput} onStartChange={setStartDate} onEndChange={setEndDate} onGenerate={generateItinerary} onClose={() => setPlannerOpen(false)} />
    <TravelChatbot open={chatOpen} messages={chatMessages} input={chatInput} loading={chatLoading} error={chatError} onInputChange={setChatInput} onSend={answerAssistant} onClose={() => setChatOpen(false)} onOpen={() => setChatOpen(true)} />
  </main>
}

export default App
