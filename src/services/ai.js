const demoItinerary = [
  { day: 'DAY 01', title: 'Arrive softly', morning: 'Check in near Gion', afternoon: 'Rest and orient yourself', evening: 'Walk along the Shirakawa canal' },
  { day: 'DAY 02', title: 'Follow the light', morning: 'Fushimi Inari at dawn', afternoon: 'Tea ceremony in Higashiyama', evening: 'Dinner in a lantern-lit alley' },
  { day: 'DAY 03', title: 'Into the green', morning: 'Arashiyama bamboo grove', afternoon: 'A quiet lunch by the river', evening: 'Return to a favourite neighbourhood' },
]

function formatDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function buildDemoItinerary({ startDate, endDate, destination = 'Kyoto', preferences = '' } = {}) {
  const start = startDate ? new Date(`${startDate}T12:00:00`) : new Date()
  const end = endDate ? new Date(`${endDate}T12:00:00`) : new Date(start.getTime() + 2 * 86400000)
  const days = Math.max(1, Math.min(14, Math.floor((end - start) / 86400000) + 1))
  const activities = [`Settle in and take an evening walk`, `Discover a local landmark and pause for a slow lunch`, `A small gallery, market, or garden`, `A memorable meal and a little room to wander`]
  return Array.from({ length: days }, (_, index) => ({ day: `DAY ${String(index + 1).padStart(2, '0')} · ${formatDay(new Date(start.getTime() + index * 86400000))}`, title: index === 0 ? 'Arrive softly' : index === days - 1 ? 'Leave something open' : `A day for ${preferences || 'curiosity'}`, morning: index === 0 ? `Check in near ${destination}` : `Start early in ${destination}`, afternoon: activities[index % activities.length], evening: index === days - 1 ? 'Keep the final evening unhurried' : 'Dinner somewhere recommended by a local' }))
}

export async function createItinerary(preferences) {
  const endpoint = import.meta.env.VITE_AI_API_URL
  if (!endpoint) return buildDemoItinerary(preferences)
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preferences) })
  if (!response.ok) throw new Error('AI planner unavailable')
  return response.json()
}

export async function askTravelAssistant({ question, destination, weather }) {
  const endpoint = import.meta.env.VITE_AI_CHAT_URL
  if (endpoint) {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, destination }) })
    if (!response.ok) throw new Error('AI assistant unavailable')
    const result = await response.json()
    return result.answer ?? result.message
  }
  const lower = question.toLowerCase()
  if (lower.includes('when') || lower.includes('season')) return `${destination?.name ?? 'This destination'} is best during ${destination?.bestIn ?? 'the shoulder seasons'}, when the pace is gentler and the weather is comfortable.`
  if (lower.includes('how long') || lower.includes('days')) return `Plan ${destination?.duration ?? '4–6 days'} in ${destination?.name ?? 'this destination'} so you have time for the essential places and unplanned discoveries.`
  if (lower.includes('weather')) return `The current demo weather near ${destination?.name ?? 'your destination'} is ${weather.temperature}° with ${weather.condition.toLowerCase()}.`
  return `${destination?.name ?? 'This destination'} rewards a slower itinerary. Start with its famous places, leave an afternoon open, and ask me about food, seasons, or how long to stay.`
}

export { demoItinerary }
