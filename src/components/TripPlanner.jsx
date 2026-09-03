import { ArrowRight, Sparkles, X } from 'lucide-react'
import DatePicker from './DatePicker'

export default function TripPlanner({ open, input, startDate, endDate, itinerary, loading, onInputChange, onStartChange, onEndChange, onGenerate, onClose }) {
  if (!open) return null
  const invalidDates = !startDate || !endDate || endDate < startDate
  return <div className="modal-backdrop" onClick={onClose}><aside className="planner-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={onClose} aria-label="Close planner"><X /></button><div className="planner-modal-head"><Sparkles size={20} /><p className="eyebrow">Wayfarer AI</p><h2>A trip with<br /><em>room to breathe.</em></h2><p>Shape a first draft around how you want to travel.</p></div><label className="planner-input-label" htmlFor="trip-preferences">What are you in the mood for?</label><input className="planner-input" id="trip-preferences" value={input} onChange={(event) => onInputChange(event.target.value)} /><DatePicker startDate={startDate} endDate={endDate} onStartChange={onStartChange} onEndChange={onEndChange} /><div className="itinerary">{itinerary.map((item) => <div key={item.day}><span>{item.day}</span><strong>{item.title}</strong><p><b>Morning:</b> {item.morning}</p><p><b>Afternoon:</b> {item.afternoon}</p><p><b>Evening:</b> {item.evening}</p></div>)}</div><button className="button button-dark" onClick={onGenerate} disabled={loading || invalidDates}>{loading ? 'Creating your route...' : 'Refresh itinerary'} <ArrowRight size={17} /></button></aside></div>
}
