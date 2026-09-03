const highlights = [
  ['48', 'curated destinations'],
  ['12k+', 'travellers inspired'],
  ['4.9', 'average experience rating'],
]

const inspiration = [
  ['Slow travel', 'Long lunches, local rituals, and time to notice the details.', 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=85'],
  ['Wild horizons', 'The kind of landscapes that make a phone feel unnecessary.', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85'],
  ['City after dark', 'A new neighbourhood, a small table, and nowhere else to be.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85'],
]

export default function TravelHighlights() {
  return <section className="travel-highlights" aria-label="Travel highlights"><div className="highlights-stats">{highlights.map(([value, label]) => <div className="highlight-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="inspiration-heading"><p className="eyebrow"><span /> Find your way in</p><h2>Travel by<br /><em>feeling.</em></h2></div><div className="inspiration-grid">{inspiration.map(([title, description, image]) => <article className="inspiration-card" key={title}><img src={image} alt="" /><div><p>{title}</p><span>{description}</span></div></article>)}</div></section>
}
