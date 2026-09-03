import { Compass } from 'lucide-react'
import DestinationCard from './DestinationCard'

export default function DestinationGrid({ destinations, onSelect }) {
  if (!destinations.length) return <div className="empty-state"><Compass size={26} /><h3>No destinations found</h3><p>Try a country, coastline, or city.</p></div>
  return <div className="destination-grid">{destinations.map((destination, index) => <DestinationCard key={destination.id} destination={destination} index={index} onSelect={onSelect} />)}</div>
}
