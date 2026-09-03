const demoItinerary = [
  { day: 'DAY 01', title: 'Arrive softly', detail: 'Check in near Gion · Evening walk along the Shirakawa canal' },
  { day: 'DAY 02', title: 'Follow the light', detail: 'Fushimi Inari at dawn · Tea ceremony in Higashiyama' },
  { day: 'DAY 03', title: 'Into the green', detail: 'Arashiyama bamboo grove · A quiet lunch by the river' },
]

function formatDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function buildDemoItinerary({ startDate, endDate, destination = 'Kyoto', preferences = '' } = {}) {
  const start = startDate ? new Date(`${startDate}T12:00:00`) : new Date()
  const end = endDate ? new Date(`${endDate}T12:00:00`) : new Date(start.getTime() + 2 * 86400000)
  const days = Math.max(1, Math.min(14, Math.floor((end - start) / 86400000) + 1))
  const activities = [`Arrive softly in ${destination} · Settle in and take an evening walk`, `Start early · Discover a local landmark and pause for a slow lunch`, `Follow the neighbourhood rhythm · A small gallery, market, or garden`, `Take the scenic route · A memorable meal and a little room to wander`]
  return Array.from({ length: days }, (_, index) => ({ day: `DAY ${String(index + 1).padStart(2, '0')} · ${formatDay(new Date(start.getTime() + index * 86400000))}`, title: index === 0 ? 'Arrive softly' : index === days - 1 ? 'Leave something open' : `A day for ${preferences || 'curiosity'}`, detail: activities[index % activities.length] }))
}

export async function createItinerary(preferences) {
  const endpoint = import.meta.env.VITE_AI_API_URL
  if (!endpoint) return buildDemoItinerary(preferences)
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preferences) })
  if (!response.ok) throw new Error('AI planner unavailable')
  return response.json()
}

export { demoItinerary }
