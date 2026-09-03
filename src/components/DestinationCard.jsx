import { ArrowRight, Heart } from 'lucide-react'

export default function DestinationCard({ destination, index, onSelect }) {
  return <article className={`destination-card card-${index}`} onClick={() => onSelect(destination)} onKeyDown={(event) => event.key === 'Enter' && onSelect(destination)} role="button" tabIndex="0"><img src={destination.image} alt={`${destination.name}, ${destination.country}`} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement.classList.add('image-fallback') }} /><div className="card-overlay" /><button className="save" aria-label={`Save ${destination.name}`} onClick={(event) => event.stopPropagation()}><Heart size={17} /></button><div className="card-info"><span className="card-number">0{index + 1}</span><div><p>{destination.country} <span>• {destination.weather}</span></p><h3>{destination.name}</h3><small>{destination.tag}</small></div><ArrowRight className="card-arrow" size={20} /></div></article>
}
